import { pipeline } from "@xenova/transformers";

// Load embedding pipeline once
let embedder: any;

export async function embedText(
    text: string
): Promise<number[]> {
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

    return Array.from(output.data) as number[];
}