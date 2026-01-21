import os
import requests
# import torch
# from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
# from peft import PeftModel

# # Disable accelerate auto-dispatch
# os.environ["NO_ACCELERATE"] = "1"
# os.environ["ACCELERATE_DISABLE_MPS_FALLBACK"] = "1"

# BASE_MODEL = "microsoft/phi-3-mini-4k-instruct"
# LORA_DIR = "phi3_qlora_out"
HF_MODEL = "Eckkeh/rk-phi3-model"
HF_TOKEN = os.getenv("HF_TOKEN")

HF_API_URL = f"https://router.huggingface.co/models/{HF_MODEL}"

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json",
}

# # Load tokenizer
# tokenizer = AutoTokenizer.from_pretrained(HF_MODEL, use_fast=True)
# if tokenizer.pad_token is None:
#     tokenizer.add_special_tokens({"pad_token": "<|pad|>"})

# Load base mode (4-bit)
# bnb_config = BitsAndBytesConfig(
#     load_in_4bit=True,
#     bnb_4bit_compute_dtype=torch.float16,
#     bnb_4bit_use_double_quant=True,
#     bnb_4bit_quant_type="nf4",
# )

# model = AutoModelForCausalLM.from_pretrained(
#     HF_MODEL,
#     # device_map="auto",
#     # quantization_config=bnb_config,
#     # torch_dtype=torch.float16,
#     use_auth_token=HF_TOKEN,
#     torch_dtype=torch.float16
# )

# model.eval()

# model.resize_token_embeddings(len(tokenizer))

# Load LoRA adapter
# model = PeftModel.from_pretrained(model, HF_MODEL, use_auth_token=HF_TOKEN)
# model.eval()

# Wrap generation in a function
def generate_quest_from_prompt(user_input: str, max_tokens=150, temperature=0.7, top_p=0.9):
    prompt = f"""<|system|>
    You are a creative tabletop RPG designer specializing in 5e-friendly quests. You generate short, punchy quest hooks with clear motivations, simple stakes, and genre-appropriate flavor.
    <|user|>
    {user_input}
    <|assistant|>
    """

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
            "do_sample": True,
            "return_full_text": False,
        },
        "options": {
            "wait_for_model": True
        }
    }

    response = requests.post(
        HF_API_URL,
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"Hugging Face API error {response.status_code}: {response.text}"
        )
    
    result = response.json()

    # HF can return different shapes depending on backend
    if isinstance(result, list) and "generated_text" in result[0]:
        return result[0]["generated_text"].strip()
    
    if isinstance(result, dict) and "generated_text" in result:
        return result["generated_text"].strip()
    
    raise RuntimeError(f"Unexpected HF response format: {result}")

    # inputs = tokenizer(prompt, return_tensors="pt", add_special_tokens=False).to(model.device)

    # print("\nGenerating response...\n")

    # with torch.no_grad():
    #     output = model.generate(
    #         **inputs,
    #         max_new_tokens=max_tokens,
    #         temperature=temperature,
    #         top_p=top_p,
    #         do_sample=True,
    #         pad_token_id=tokenizer.eos_token_id
    #     )

    # generated_tokens = output[0][inputs["input_ids"].shape[-1]:]
    # result = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

    # return result
    # result = tokenizer.decode(output[0], skip_special_tokens=True)
    # print(result)  # <- This prints it directly
    # return result



# uvicorn app.main:app --host 0.0.0.0 --port 8000
