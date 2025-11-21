// Profile Screen

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";

const ProfileScreen = ({ user }) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

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
        <div className="p-6">
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
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;