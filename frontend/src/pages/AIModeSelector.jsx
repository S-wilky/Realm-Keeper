import React from "react";
import { useNavigate } from "react-router-dom";
import RK_Button from "../components/RK_Button";
import RK_Icon from "../components/RK_Icon";
import { wholeScreen } from "../styles/tailwindClasses";

const AIModeSelector = () => {
    const navigate = useNavigate();

    return (
        <div className={`${wholeScreen} items-center justify-center`}>
            <div className="bg-[#2C3539] border border-gray-600 rounded-2xl p-10 text-center w-full max-w-xl shadow-lg">

                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <RK_Icon icon="sparkles" size="md" color="pale-orange" />
                    <h1 className="text-3xl font-semibold">Realm Keeper AI</h1>
                    <p className="text-gray-400 text-sm">
                        Choose what kind of help you would like
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 mt-6">
                    <RK_Button
                        type="accent"
                        size="md"
                        onClick={() => navigate("/chatbot/chat", { state: { mode: "quest" } })}
                    >
                        Fantasy Quest Generator
                    </RK_Button>

                    <RK_Button
                        type="standard"
                        size="md"
                        onClick={() => navigate("/chatbot/chat", { state: { mode: "lore" } })}
                    >
                        Lore Keeper
                    </RK_Button>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <RK_Button
                        type="standard"
                        size="sm"
                        onClick={() => navigate("/")}
                    >
                        Back to Dashboard
                    </RK_Button>
                </div>
            </div>
        </div>
    );
};

export default AIModeSelector;