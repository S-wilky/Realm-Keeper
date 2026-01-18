import supabase from "../../../frontend/src/services/supabase-client";
import { embedText } from "./embeddingModel.js";

// Retrieve relevant user articles for RAG
export async function retrieveRelevantArticles(
    userQuery,
    matchCount = 3
) {
    const queryVector = await embedQuery(userQuery);

    // Call pgvector similarity search
    const { data, error } = await supabase.rpc(
        "match_articles",
        {
            query_embedding: queryVector,
            match_count: matchCount
        }
    );

    if (error) {
        console.error("RAG retrieval failed:", error);
        return[];
    }

    return data;
}