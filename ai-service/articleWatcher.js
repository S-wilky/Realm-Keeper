import supabase from "./app/services/ai-service-Supabase-client.js";
import { embedText } from "./embedder.js";

async function watchNewArticles() {
    const myChannel = supabase.channel("articles-channel")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "realms", table: "articles"},
            async (payload) => {
                console.log("New article created:", payload.new.title);

                // Build text like in embedder.js
                let text = `${payload.new.title}\n\n${payload.new.body ?? ""}`;
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
                
                if (error) console.error("Failed to embed new article:", error);
                else console.log("Article embedding saved:", payload.new.title);
            }
        );

    await myChannel.subscribe();
    console.log("Watching for new articles in realms schema...");
}

watchNewArticles();