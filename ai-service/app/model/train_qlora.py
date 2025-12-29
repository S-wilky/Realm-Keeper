#!/usr/bin/env python3
"""
train_qlora.py
Usage:
  - Place training_text.jsonl (single field `text`) in working directory, or provide --data_file
  - Run with accelerate: `accelerate launch app/model/train_qlora.py`
  - To run with 4-bit (QLoRa): `accelerate launch app/model/train_qlora.py --use_4bit --per_device_train_batch_size 1 --gradient_accumulation_steps 8 --epochs 3 --max_seq_length 1024 --learning_rate 2e-4`
  - To run without (LoRa): `accelerate launch app/model/train_qlora.py --per_device_train_batch_size 1 --gradient_accumulation_steps 8 --epochs 3 --max_seq_length 1024`
"""

import os
import json
from pathlib import Path
import argparse
import math
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling
)

# PEFT / LoRA imports
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import transformers
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser()
parser.add_argument("--model_name", type=str, default="microsoft/phi-3-mini-4k-instruct")
parser.add_argument("--data_file", type=str, default="./exports/training_data.jsonl")
parser.add_argument("--output_dir", type=str, default="./phi3_qlora_out")
parser.add_argument("--per_device_train_batch_size", type=int, default=1)  # 1 or 2 recommended for 4070
parser.add_argument("--micro_batch_size", type=int, default=1)
parser.add_argument("--gradient_accumulation_steps", type=int, default=8)   # accum to simulate larger batch
parser.add_argument("--epochs", type=int, default=1)
parser.add_argument("--max_seq_length", type=int, default=1024)  # try 1024, increase if memory allows
parser.add_argument("--learning_rate", type=float, default=2e-4)
parser.add_argument("--lora_r", type=int, default=16)
parser.add_argument("--lora_alpha", type=int, default=32)
parser.add_argument("--lora_dropout", type=float, default=0.05)
parser.add_argument("--use_4bit", action="store_true", help="Attempt to use 4-bit quantization (bitsandbytes).")
parser.add_argument("--push_to_hf", action="store_true", help="Push final merged model to HF hub")
parser.add_argument("--repo_id", type=str, default=None, help="HF repo to push to (username/modelname)")

args = parser.parse_args()

# -------------- Prepare dataset --------------
if not Path(args.data_file).exists():
    raise FileNotFoundError(f"{args.data_file} not found")

dataset = load_dataset("json", data_files=args.data_file, split="train")
logger.info("Loaded dataset with %d examples", len(dataset))

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained(args.model_name, use_fast=True)
if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({"pad_token": "<|pad|>"})

def tokenize_fn(ex):
    txt = ex["text"]
    data = tokenizer(txt, truncation=True, max_length=args.max_seq_length)
    return data

tokenized = dataset.map(tokenize_fn, remove_columns=dataset.column_names, batched=False)

# Data collator for causal LM
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# -------------- Model loading with optional 4-bit --------------
device_map = "auto"
model_kwargs = {}

use_4bit = args.use_4bit
quant_config = None

try:
    if use_4bit:
        from transformers import BitsAndBytesConfig
        quant_config = BitsAndBytesConfig(load_in_4bit=True,
                                         bnb_4bit_compute_dtype=torch.float16,
                                         bnb_4bit_use_double_quant=True,
                                         bnb_4bit_quant_type="nf4")
        logger.info("Attempting to load model in 4-bit with bitsandbytes")
        model = AutoModelForCausalLM.from_pretrained(
            args.model_name,
            device_map=device_map,
            quantization_config=quant_config,
            torch_dtype=torch.float16
        )
        # prepare for k-bit training
        model = prepare_model_for_kbit_training(model)
    else:
        raise Exception("4-bit disabled by flag")
except Exception as e:
    logger.warning("4-bit model load failed or disabled: %s", str(e))
    logger.info("Falling back to fp16 loading (if available)")
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name,
        device_map=device_map,
        torch_dtype=torch.float16
    )

# Resize token embeddings if tokenizer grew
model.resize_token_embeddings(len(tokenizer))

# Reduce VRAM + heat (balanced mode)
model.config.use_cache = False
model.gradient_checkpointing_enable()

# -------------- Apply LoRA (PEFT) --------------
peft_config = LoraConfig(
    r=args.lora_r,
    lora_alpha=args.lora_alpha,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_dropout=args.lora_dropout,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, peft_config)
logger.info("Applied LoRA config: r=%d alpha=%d", args.lora_r, args.lora_alpha)

# -------------- Training arguments --------------
training_args = TrainingArguments(
    output_dir=args.output_dir,
    per_device_train_batch_size=args.per_device_train_batch_size,
    gradient_accumulation_steps=args.gradient_accumulation_steps,
    num_train_epochs=args.epochs,
    learning_rate=args.learning_rate,
    fp16=True,
    logging_steps=20,
    save_steps=2000,
    save_total_limit=3,
    remove_unused_columns=False,
    dataloader_pin_memory=True,
    report_to="none",  # disable wandb by default; configure if you use wandb
)

# -------------- Trainer --------------
trainer = transformers.Trainer(
    model=model,
    train_dataset=tokenized,
    args=training_args,
    data_collator=data_collator,
)

# -------------- Train --------------
logger.info("Starting training")
trainer.train()
logger.info("Training complete")

# -------------- Save and optionally push --------------
logger.info("Saving peft model to %s", args.output_dir)
model.save_pretrained(args.output_dir)
tokenizer.save_pretrained(args.output_dir)

if args.push_to_hf:
    if not args.repo_id:
        raise ValueError("repo_id required to push to HF hub")
    from huggingface_hub import HfApi, Repository
    api = HfApi()
    api.upload_folder(repo_id=args.repo_id, folder_path=args.output_dir, path_in_repo=".")
    logger.info("Pushed model to HF repo %s", args.repo_id)
