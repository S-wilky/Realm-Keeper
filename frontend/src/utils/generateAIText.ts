type Mode = "lore" | "quest";

type GenerateResponse = {
    response?: string;
    error?: string;
};

const generateText = async (
    prompt: string,
    mode: Mode = "lore"
): Promise<string> => {
    console.log("Prompt: ", prompt);
    console.log("Mode: ", mode);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt,
            mode,
        }),
    };

    console.log("JSON sent: ", requestOptions);

    try {
        const response = await fetch(
            `${import.meta.env.VITE_AI_SERVICE_URL}/generate`,
            requestOptions
        );

        const data: GenerateResponse = await response.json();

        console.log("JSON received: ", data);

        if (data.error) {
            throw new Error(data.error);
        }

        return data.response || "No response from AI.";
    } catch (err) {
        console.error("Generation failed: ", err);
        return "Error: Could not generate text.";
    }
};

export default generateText;