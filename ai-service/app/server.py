# from vllm import LLM, SamplingParams
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI

# from app.model.phi3Model import generate_quest_from_prompt
# from app.rag import fetch_context
from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SECRET_KEY"]
)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
# openai.api_key = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],
    allow_origins=[
        "https://realmkeeper.netlify.app",
        "https://www.realmkeeper.netlify.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "microsoft/Phi-3-mini-4k-instruct"

# print("Loading model...")
# llm = LLM(
#     MODEL_NAME,
#     # trust_remote_code=True,  # Required for Phi-3
#     dtype="float16",
#     gpu_memory_utilization=0.8
# )

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 150
    temperature: float = 0.7
    top_p: float = 0.9

class EmbedArticleRequest(BaseModel):
    article_id: str
    title: str
    body: str

@app.post("/generate")
async def generate(req: GenerateRequest):
    from app.phi3Model import generate_quest_from_prompt
    from rag import fetch_context


    context = fetch_context(req.prompt)
    print("RAG CONTEXT:\n", context)

    full_prompt = f"Context:\n{context}\n\nQuestion:\n{req.prompt}"

    result = generate_quest_from_prompt(
        user_input=full_prompt,
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
    )

    # outputs = llm.generate(req.prompt, params)
    # result = outputs[0].outputs[0].text.strip()

    return {"response": result}

from fastapi import Response

@app.options("/generate")
async def generate_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://realmkeeper.netlify.app",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )

@app.post("/embed-article")
async def embed_article(req: EmbedArticleRequest):
    """
    Generates embedding for the given article text and updates Supabase directly.
    """
    try:
        if not req.article_id or not req.body:
            return {"success": False, "error": "article_id and body are required"}
        
        text_to_embed = f"{req.title}\n\n{req.body}"

        response = client.embeddings.create(
            input=text_to_embed,
            model="text-embedding-3-small"
        )
        embedding_vector = response.data[0].embedding
        # embedding_vector = [float(x) for x in response["data"][0]["embedding"]]

        response = supabase.schema("realms").table("articles") \
            .update({"embedding_vector": embedding_vector}) \
            .eq("article_id", req.article_id) \
            .execute()
        
        if not response.data:
            print("Supabase error:", response)
            return {"success": False, "error": str(response)}

        # data, error = supabase.schema("realms").from_("articles").update({
        #     "embedding_vector": embedding_vector
        # }).eq("article_id", req.article_id).execute()

        # if error:
        #     print("Supabase error:", error)
        #     return {"success": False, "error": str(error)}
        
        print("Updated embedding for article:", req.article_id)
        return {"success": True, "data": response.data}
    
    except Exception as e:
        print("Embedding error:", e)
        return {
            "success": False,
            "error": str(e)
        }

        # supabase_response = supabase.from_("articles").update({
        #     "embedding_vector": embedding_vector
        # }).eq("article_id", req.article_id).execute()

        # if supabase_response.error:
        #     print("Supabase error:", supabase_response.error)
        #     return {"success": False, "error": str(supabase_response.error)}
        
        # print("Updated embedding for article:", req.article_id)
        # return {"success": True, "data": supabase_response.data}

# run this to start server:
# uvicorn app.server:app --host 0.0.0.0 --port 8000
