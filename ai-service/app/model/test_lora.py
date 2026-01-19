import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import PeftModel

BASE_MODEL = "microsoft/phi-3-mini-4k-instruct"
LORA_DIR = "phi3_qlora_out"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    BASE_MODEL,
    use_fast=True
)

if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({"pad_token": "<|pad|>"})

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

print("Loading base model (4-bit)...")
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    device_map="auto",
    quantization_config=bnb_config,
    torch_dtype=torch.float16,
)

model.resize_token_embeddings(len(tokenizer))

print("Loading LoRA adapter...")
model = PeftModel.from_pretrained(model, LORA_DIR)

model.eval()

user_input = input("\nEnter your quest prompt:\n> ")

prompt = f"""<|system|>
You are a creative tabletop RPG designer specializing in 5e-friendly quests. You generate short, punchy quest hooks with clear motivations, simple stakes, and genre-appropriate flavor.
<|user|>
{user_input}
<|assistant|>
"""

inputs = tokenizer(
    prompt, 
    return_tensors="pt",
    add_special_tokens=False
).to(model.device)

print("\nGenerating response...\n")

with torch.no_grad():
    output = model.generate(
        **inputs,
        max_new_tokens=120,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

print(tokenizer.decode(output[0], skip_special_tokens=True))