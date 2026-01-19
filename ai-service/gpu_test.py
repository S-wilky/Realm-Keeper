import torch

# 1. PyTorch GPU check
print("=== PyTorch GPU Check ===")
print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("Current device:", torch.cuda.current_device())
    print("Device name:", torch.cuda.get_device_name(torch.cuda.current_device()))

# 2. bitsandbytes check
try:
    import bitsandbytes as bnb
    print("\n=== bitsandbytes Check ===")
    print("bitsandbytes version:", bnb.__version__)
    print("CUDA available for bnb:", torch.cuda.is_available())
except ImportError:
    print("\nbitsandbytes not installed!")

# 3. Optional: model device map (if you want to load the model)
try:
    from transformers import AutoModelForCausalLM, AutoTokenizer
    model_id = "microsoft/phi-3-mini-4k-instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        trust_remote_code=True,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    print("\n=== Model Device Map ===")
    print(model.device_map)
except Exception as e:
    print("\nError loading model:", e)