import supabase from "./app/services/ai-service-Supabase-client.js";
import { embedText } from "./app/embeddings/embeddingModel.js";
// import { embedText } from "./app/embeddings/embedder.js";

async function watchNewArticles(): Promise<void> {
    const myChannel = supabase
        .channel("article-channel")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "realms",
                table: "articles",
            },
            async (payload: any): Promise<void> => {
                console.log(
                    "New article created:",
                    payload.new.title
                );

                let text = `${payload.new.title}\n\n${
                    payload.new.body ?? ""
                }`;

                if (payload.new.metadata?.customFields) {
                    for (const field of payload.new.metadata.customFields) {
                        text += `\n${field.label}: ${field.value}`;
                    }
                }

                const vector = await embedText(text);

                const { error } = await supabase
                    .from("realms.articles")
                    .update({ embedding_vector: vector })
                    .eq("article_id", payload.new.article_id);

                if (error) {
                    console.error(
                        "Failed to embed new artcile:",
                        error
                    );
                } else {
                    console.log(
                        "Article embedding saved:",
                        payload.new.title
                    );
                }
            }
        );

    await myChannel.subscribe();

    console.log(
        "Watching for new artciles in realms schema..."
    );
}

watchNewArticles();