from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISH_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_context(user_input: str) -> str:
    response = (
        supabase
        .schema("realms")
        .table("articles")
        .select("body")
        .order("created_at", desc=True)
        .limit(3)
        .execute()
    )

    if not response.data:
        return ""
    
    return "\n\n".join(article["body"] for article in response.data)