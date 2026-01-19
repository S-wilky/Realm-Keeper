import { pipeline } from "@xenova/transformers";

// Load embedding pipeline once
let embedder;

export async function embedText(text) {
    if (!embedder) {
        embedder = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    const output = await embedder(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
}