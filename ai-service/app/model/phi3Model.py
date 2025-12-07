import os
import sys
import torch

# Disable accelerate auto-dispatch completely
os.environ["NO_ACCELERATE"] = "1"
os.environ["ACCELERATE_DISABLE_MPS_FALLBACK"] = "1"

from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

model_id = "microsoft/Phi-3-mini-4k-instruct"

tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)

# if not (hasattr(sys, "_called_from_test") or os.environ.get("RUN_MAIN") == "true"):
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    trust_remote_code=True,
    torch_dtype=torch.float16,
    device_map="auto",
    attn_implementation="eager",
    # attn_implementation="flash_attention_2",
    # attn_implementation="sdpa",
)


# uvicorn app.main:app --host 0.0.0.0 --port 8000
