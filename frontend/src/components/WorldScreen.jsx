//World Screen

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import supabase from "../services/supabase-client";

const WorldScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <p>No world data found.</p>;

    const { world_id, name: initialName, description: initialDescription, user_id, onDelete } = state;

    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const { error } = await supabase
            .from("worlds")
            .update({ name, description })
            .eq("world_id", world_id);

        if (error) {
            alert("Error saving world: " + error.message);
        } else {
            alert("World saved!");
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this world?")) return;

        const { data, error } = await supabase
            .from("worlds")
            .delete()
            .eq("world_id", world_id);

        if (error) {
            console.log("Delete error:", error);
            alert("Error deleting world: " + error.message);
        } else {
            alert("World deleted!");
            navigate("/");
        }
    };

    return (
        <div className="p-6">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl mb-4">{name}</h1>
                    <p className="mb-4">{description}</p>
                </>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
                {isEditing ? (
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                )}
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDelete}
                >
                    Delete
                </button>
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/")}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default WorldScreen;