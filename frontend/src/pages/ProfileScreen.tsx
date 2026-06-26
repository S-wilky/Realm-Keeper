// Profile Screen

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";
import "../styles/overrides.css"

const ProfileScreen = ({ user }) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    document.title = "Realm Keeper | Profile";

    useEffect(() => {
        if (!user?.id) return;
        // Fetch existing username if exists
        const fetchUsername = async () => {
            const { data, error } = await supabase
                .from("profile")
                .select("username")
                .eq("profile_id", user.id)
                .maybeSingle();

            if (error) console.log("Fetch username error:", error);
            if (data) setUsername(data.username || "");
        };

        fetchUsername();
    }, [user.id]);

    const handleSave = async () => {
        const { error } = await supabase
            .from("profile")
            .upsert({ profile_id: user.id, username, });

        if (error) {
            console.log("Save error:", error);
            alert("Error saving username");
        } else {
            alert("Username saved!");
        }
    };

    return (
        <div className="m-0 p-6 w-screen h-screen overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans">
            <h1 className="text-2xl mb-4">Profile</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border p-2 rounded mb-4"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="bg-pale-orange text-white px-4 py-2 rounded"
                >
                    Save
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-dusky-blue text-white px-4 py-2 rounded"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;