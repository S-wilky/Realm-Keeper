from supabase import create_client
# from sentence_transformers import SentenceTransformer
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def fetch_context(user_input: str, match_count: int = 3, min_similarity: float = 0.50) -> str:
    # query_embedding = embedding_model.encode(user_input).tolist()
    """
    Fetch top matching articles from Supabase based on the user's input.
    Uses OpenAI embeddings (1536-dim) to match Supabase vector schema.
    """

    response = client.embeddings.create(
        input=user_input,
        model="text-embedding-3-small"
    )
    query_embedding = response.data[0].embedding

    response = supabase.rpc(
        "match_articles",
        {
            "query_embedding": query_embedding,
            "match_count": match_count
        }
    ).execute()

    if not response.data:
        return "NO_RELEVANT_CONTEXT"
    
    context_blocks = []
    for article in response.data:
        similarity = article.get("similarity")
        if similarity and similarity >= min_similarity and article.get("body"):
            context_blocks.append(article["body"])

    # context_blocks = [article["body"] for article in response.data if article.get("body")]

    if not context_blocks:
        return "NO_RELEVANT_CONTEXT"

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