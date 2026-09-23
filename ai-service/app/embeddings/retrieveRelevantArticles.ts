import supabase from "../services/ai-service-Supabase-client.js";
import { embedText } from "./embeddingModel.js";

type MatchArticleResult = {
    article_id: string;
    title?: string;
    body?: string;
    similarity?: number;
};

export async function retreiveRelevantArticles(
    userQuery: string,
    matchCount: number = 3
): Promise<MatchArticleResult[]> {
    const queryVector = await embedText(userQuery);

    const { data, error } = await supabase.rpc(
        "match_articles",
        {
            query_embedding: queryVector,
            match_count: matchCount,
        }
    );

    if (error) {
        console.error("RAG retrieval failed:", error);
        return [];
    }

    return data ?? [];
}