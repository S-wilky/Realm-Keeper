from supabase import create_client
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def fetch_context(user_input: str, match_count: int = 3) -> str:
    query_embedding = embedding_model.encode(user_input).tolist()

    response = supabase.rpc(
        "match_articles",
        {
            "query_embedding": query_embedding,
            "match_count": match_count
        }
    ).execute()

    if not response.data:
        return ""
    
    context_blocks = [article["body"] for article in response.data if article.get("body")]

    return "\n\n---\n\n".join(context_blocks)

# def fetch_context(user_input: str. match_count: int = 3) -> str:

#     # response = (
#     #     supabase
#     #     .schema("realms")
#     #     .table("articles")
#     #     .select("body")
#     #     .order("created_at", desc=True)
#     #     .limit(3)
#     #     .execute()
#     # )

#     if not response.data:
#         return ""
    
#     return "\n\n".join(article["body"] for article in response.data)