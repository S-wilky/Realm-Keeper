import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import generateText from "../utils/generateAIText";

type Message = {
    sender: "user" | "bot";
    text: string;
};

type Mode = "lore" | "quest";

type LocationState = {
    mode?: Mode;
};

const ChatbotScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LocationState | null;

    // Get selected AI mode
    const mode: Mode = state?.mode || "lore";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    document.title = "Realm Keeper | Chatbot";

    const handleSend = async (): Promise<void> => {
        if (loading) return;
        if (!input.trim()) return;

        setLoading(true);

        let response: string = "";

        try {
            response = await generateText(input, mode);
        } catch (err) {
            console.error("Generation failed: ", err);
            response = "Error: Could not generate text.";
        }

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: input },
            { sender: "bot", text: response },
        ]);

        setInput("");
        setLoading(false);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-[#2C3539] text-[#D9DDDC] p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <img
                    src="https://xkrrvlwvkmygmxcrqauq.supabase.co/storage/v1/object/public/realm-assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-15 h-15"
                    onClick={() => navigate("/")}
                />

                <h1 className="text-3xl font-semibold">
                    {mode === "quest" ? "Fantasy Quest Generator" : "Lore Keeper"}
                </h1>

                <button
                    onClick={() => navigate("/")}
                    className="bg-pale-orange px-4 py-2 rounded hover:opacity-80"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 border-gray-600 rounded-lg bg-[#2E3A40]">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded ${
                            msg.sender === "user"
                                ? "bg-[#3A4750] text-right"
                                : "bg-[#45505A] text-left"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && (
                    <div className="text-center italic text-gray-400">
                        AI is thinking...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-4">
                <textarea
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setInput(e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded bg-[#3A3F47] text-[#D9DDDC] resize-none"
                    placeholder={`Ask the ${
                        mode === "quest" ? "Fantasy Quest Generator" : "Lore Keeper"
                    }...`}
                    rows={2}
                    disabled={loading}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="px-4 py-2 bg-pale-orange rounded disabled:opacity-50"
                >
                    Send
                </button>
                </div>   
        </div>
    );
};

export default ChatbotScreen;