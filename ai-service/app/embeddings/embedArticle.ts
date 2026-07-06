import supabase from "../services/ai-service-Supabase-client.js";
import { embedText } from "./embeddingModel.js";

export async function embedArticleById(
    req: any,
    res: any
): Promise<void> {
    try {
        const { article_id } = req.body;

        if (!article_id) {
            res.status(400).json({
                error: "article_id required",
            });
            return;
        }

        const { data: article, error } = await supabase
            .from("articles")
            .select(
                "article_id, title, body, metadata, embedding_vector"
            )
            .eq("article_id", article_id)
            .single();

        if (error) throw error;

        if (!article) {
            res.status(404).json({
                error: "Article not found",
            });
            return;
        }

        if (article.embedding_vector) {
            res.json({
                status: "already_embedded",
            });
            return;
        }

        let text = `${article.title}\n\n${
            article.body ?? ""
        }`;

        if (article.metadata?.customFields) {
            for (const field of article.metadata.customFields) {
                text += `\n${field.label}: ${field.value}`;
            }
        }

        if (!text.trim()) {
            res.json({
                status: "empty_text",
            });
            return;
        }

        const vector = await embedText(text);

        const { error: updateError } = await supabase
            .from("articles")
            .update({
                embedding_vector: vector,
            })
            .eq("article_id", article.article_id);

        if (updateError) throw updateError;

        res.json({
            status: "embedded",
        });
    } catch (err: unknown) {
        console.error(
            "Embedding failed:",
            err
        );

        res.status(500).json({
            error: "Embedding failed",
        });
    }
}