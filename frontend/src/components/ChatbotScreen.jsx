import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import generateQuest from "../../../ai-service/app/quests/generateQuest";
import generateText from "../utils/generateAIText";
import generateInputPrompt from "../../../ai-service/app/quests/generateInputPrompt";
import { saveGeneratedQuest, linkQuestAndTemplate, deleteGeneratedQuest } from "../services/questQueries";

const ChatbotScreen = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [savedQuests, setSavedQuests] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        if (!input.trim()) //return;
        {
            //Generate a random input prompt
            const promptData = await generateInputPrompt();
            // console.log("Prompt Data retreived:", promptData);
            const prompt = promptData.input_prompt;
            // console.log("Prompt: ", prompt);

            //Generate a random Quest
            const questData = await generateQuest(promptData);
            // console.log("Quest Data retreived:", questData);
            const quest = questData.quest_hook;
            // console.log("Quest:", quest);

            setMessages((prev) => [
            ...prev,
            { sender: "user", text: prompt },
            { sender: "bot", text: quest }, //quest.quest_hook
        ]);
        } else {
            // Placeholder for backend integration:
            let response = "";
            try {
                response = await generateText(input);
            } catch (err) {
                console.error("Generation failed: ", err);
                response = "Error: Could not generate text.";
            }
            
            setMessages((prev) => [
                ...prev,
                { sender: "user", text: input },
                { sender: "bot", text: response },
            ]);
        }

        // Add user message instantly
        
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-[#2C3539] text-[#D9DDDC] p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold">AI Chatbot</h1>
                <button
                    onClick={() => navigate("/")}
                    className="bg-[#EAAC59] px-4 py-2 rounded hover:opacity-80"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 border border-gray-600 rounded-lg bg-[#2E3A40]">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded ${
                            msg.sender === "user" ? "bg-[#3A4750] text-right" : "bg-[#45505A] text-left"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="text-center italic text-gray-400">AI is thinking...</div>}
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-[#3A3F47] text-[#D9DDDC]"
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} className="px-4 py-2 bg-[#EAAC59] rounded">
                    Send
                </button>
            </div>

            {/* Saved Quests */}
            {savedQuests.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Saved Quests</h2>
                    {savedQuests.map((quest) => (
                        <div
                            key={quest.quest_id}
                            className="flex justify-between items-center p-2 bg-[#3A4750] my-2 rounded"
                        >
                            <span>{quest.quest_hook}</span>
                            <button
                                className="bg-red-500 px-2 py-1 rounded hover:opacity-80"
                                onClick={() => handleDeleteQuest(quest.quest_id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatbotScreen;