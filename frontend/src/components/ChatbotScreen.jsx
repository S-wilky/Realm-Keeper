import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import generateQuest from "../../../ai-service/app/generateQuest";
<<<<<<< HEAD
import { saveGeneratedQuest, linkQuestAndTemplate, deleteGeneratedQuest } from "../services/questQueries";
=======
>>>>>>> develop

const ChatbotScreen = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [savedQuests, setSavedQuests] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
<<<<<<< HEAD
        if (!input.trim()) return;

        const userMessage = input.trim();
=======
        if (!input.trim()) //return;
        {
            const questData = await generateQuest();
            console.log("Data retreived:", questData);
            const quest = questData.quest_hook
            console.log("Quest:", quest);

            setMessages((prev) => [
            ...prev,
            { sender: "user", text: "Use generate input function here." },
            { sender: "bot", text: quest }, //quest.quest_hook
        ]);
        } else {
            // Placeholder for backend integration:
            // Shane's backend code will replace this
            setMessages((prev) => [
                ...prev,
                { sender: "user", text: input },
                { sender: "bot", text: "AI response will appear here." },
            ]);
        }
>>>>>>> develop

        // Add user message instantly
        
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            // Generate quest
            const questData = await generateQuest();

            // Save to Supabase
            const savedQuest = await saveGeneratedQuest(questData);
            setSavedQuests((prev) => [...prev, savedQuest]);

            // Display AI response
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: questData.quest_hook || "AI couldn't generate a quest." },
            ]);
        } catch (err) {
            console.error("Error generating quest:", err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Something went wrong while generating your quest." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuest = async (questId) => {
        try {
            await deleteGeneratedQuest(questId);
            setSavedQuests(prev => prev.filter(q => q.quest_id !== questId));
        } catch (err) {
            console.error("Error deleting quest:", err);
        }
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