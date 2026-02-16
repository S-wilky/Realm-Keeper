import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import generateQuest from "../../../ai-service/app/quests/generateQuest";
import generateText from "../utils/generateAIText";
// import generateInputPrompt from "../../../ai-service/app/quests/generateInputPrompt";

const ChatbotScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get selected AI mode
    const mode = location.state?.mode || "lore";

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    document.title = "Realm Keeper | Chatbot";

    const handleSend = async () => {
        if (loading) return;
        if (!input.trim()) return;

        setLoading(true);

        let response = "";
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

        // if (!input.trim()) //return;
        // {
        //     setLoading(false);
        //     return;

        //     // console.warn("test");
        //     // //Generate a random input prompt
        //     // const promptData = await generateInputPrompt();
        //     // // console.log("Prompt Data retreived:", promptData);
        //     // const prompt = promptData.input_prompt;
        //     // // console.log("Prompt: ", prompt);

        //     // //Generate a random Quest
        //     // const questData = await generateQuest(promptData);
        //     // // console.log("Quest Data retreived:", questData);
        //     // const quest = questData.quest_hook;
        //     // // console.log("Quest:", quest);

        //     // setMessages((prev) => [
        //     // ...prev,
        //     // { sender: "user", text: prompt },
        //     // { sender: "bot", text: quest }, //quest.quest_hook
        //     // ]);
        // } else {
        //     // Placeholder for backend integration:
        //     let response = "";
        //     try {
        //         response = await generateText(input, mode);
        //     } catch (err) {
        //         console.error("Generation failed: ", err);
        //         response = "Error: Could not generate text.";
        //     }
            
        //     setMessages((prev) => [
        //         ...prev,
        //         { sender: "user", text: input },
        //         { sender: "bot", text: response },
        //     ]);
        // }

        // Add user message instantly
        
        // setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-[#2C3539] text-[#D9DDDC] p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <img
                    //onClick={logout}
                    // src="/src/assets/RealmKeeperLogo.png"
                    src="https://xkrrvlwvkmygmxcrqauq.supabase.co/storage/v1/object/public/realm-assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-15 h-15"
                    onClick={() => navigate("/")}
                />
                <h1 className="text-3xl font-semibold">
                    {mode === "quest" ? "Fantasy Quest Generator" : "Lore Keeper"}
                </h1>
                {/* <h1 className="text-3xl font-semibold">AI Chatbot</h1> */}
                <button
                    onClick={() => navigate("/")}
                    className="bg-pale-orange px-4 py-2 rounded hover:opacity-80"
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
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-[#3A3F47] text-[#D9DDDC] resize-none"
                    placeholder={`Ask the ${mode === "quest" ? "Fantasy Quest Generator" : "Lore Keeper"}...`}
                    rows={2}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={loading}
                    // onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={loading} 
                    className="px-4 py-2 bg-pale-orange rounded disabled:opacity-50">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotScreen;