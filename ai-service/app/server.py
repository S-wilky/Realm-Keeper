from vllm import LLM, SamplingParams
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

MODEL_NAME = "microsoft/Phi-3-mini-4k-instruct"

print("Loading model...")
llm = LLM(
    MODEL_NAME,
    # trust_remote_code=True,  # Required for Phi-3
    dtype="float16",
    gpu_memory_utilization=0.8
)

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 256
    temperature: float = 0.7
    top_p: float = 0.9

@app.post("/generate")
async def generate(req: GenerateRequest):
    params = SamplingParams(
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
    )

    outputs = llm.generate(req.prompt, params)
    result = outputs[0].outputs[0].text.strip()

    return {"response": result}

# run this to start server:
# uvicorn app.server:app --host 0.0.0.0 --port 8000
