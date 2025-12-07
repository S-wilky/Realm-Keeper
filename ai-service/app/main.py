from fastapi import FastAPI
from app.model.phi3Model import model, tokenizer
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import GenerateRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(req: GenerateRequest):
    print("REQUEST RECEIVED:", req)
    inputs = tokenizer(req.prompt, return_tensors="pt").to(model.device)

    output_tokens = model.generate(
        **inputs,
        max_new_tokens=req.max_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
        do_sample=True,
    )

    output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    return {"response": output_text}


# run this to start server
# uvicorn app.main:app --host 0.0.0.0 --port 8000