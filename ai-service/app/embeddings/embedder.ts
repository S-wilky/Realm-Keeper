import supabase from "../services/ai-service-Supabase-client.js";
import { embedText } from "./embeddingModel.js";

type CustomField = {
    label: string;
    value: string;
};

type ArticleMetadata = {
    customFields?: CustomField[];
};

type Article = {
    article_id: string;
    title: string;
    body?: string;
    metadata?: ArticleMetadata;
    embedding_vector?: number[] | string | null;
};

async function fetchArticlesWithoutEmbeddings(): Promise<Article[]> {
    const { data: allData, error: allError } = await supabase
        .from("articles")
        .select("article_id, title, embedding_vector");

    console.log("DEBUG: All articles in table:", allData);

    if (allError) {
        console.error(
            "DEBUG: Error fetching all articles:",
            allError
        );
    }

    const { data, error } = await supabase
        .from("articles")
        .select(
            "article_id, title, body, metadata, embedding_vector"
        )
        .is("embedding_vector", null);

    if (error) {
        console.error(
            "DEBUG: Error fetching articles without embeddings:",
            error
        );

        throw error;
    }

    console.log(
        "DEBUG: Articles returned by .is('embedding_vector', null):",
        data
    );

    const filtered = (data ?? []).filter(
        (article: Article) =>
            !article.embedding_vector ||
            (
                Array.isArray(article.embedding_vector) &&
                article.embedding_vector.length === 0
            )
    );

    console.log(
        "DEBUG: Articles after filtering empty vectors:",
        filtered
    );

    return filtered;
}

function buildArticleText(article: Article): string {
    let text = `${article.title}\n\n${article.body ?? ""}`;

    if (article.metadata?.customFields) {
        for (const field of article.metadata.customFields) {
            text += `\n${field.label}: ${field.value}`;
        }
    }

    return text.trim();
}

export async function embedAllArticles(): Promise<void> {
    const { data: allData, error: allError } = await supabase
        .from("articles")
        .select("*")
        .limit(10);

    console.log(
        "DEBUG: First 10 articles in table:",
        allData
    );

    console.log(
        "DEBUG: Any error fetching table?",
        allError
    );

    const articles = await fetchArticlesWithoutEmbeddings();

    console.log(
        `Found ${articles.length} articles to embed`
    );

    for (const article of articles) {
        const text = buildArticleText(article);

        if (!text) continue;

        const vector = await embedText(text);

        const vectorString = `[${vector.join(",")}]`;

        const { data, error } = await supabase
            .from("articles")
            .update({ embedding_vector: vectorString })
            .eq("article_id", article.article_id)
            .select("article_id");

        if (error) {
            console.error(
                "Failed to update:",
                article.article_id,
                error
            );
        } else {
            console.log("Embedded:", article.title);
        }
    }
}