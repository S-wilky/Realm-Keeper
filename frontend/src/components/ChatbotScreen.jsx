import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatbotScreen = ({ questHooks = [], articles = [] }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        // Placeholder for backend integration:
        // Shane's backend code will replace this
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: input },
            { sender: "bot", text: "AI response will appear here." },
        ]);

        setInput("");
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
        </div>
    );
};

export default ChatbotScreen;