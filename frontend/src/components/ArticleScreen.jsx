// Article Screen (Pop up)

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";

const ArticleScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <p>No article data found.</p>;

    const { article_id, title: initialTitle, body: initialBody, type: initialType, user_id, world_id } = state;

    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [type, setType] = useState(initialType);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const { error } = await supabase
            .from("articles")
            .update({ title, body, type, world_id })
            .eq("article_id", article_id);

        if (error) {
            alert("Error saving article: " + error.message);
        } else {
            alert("Article saved!");
            // navigate("/", { replace: true })
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

        const { error } = await supabase
            .from("articles")
            .delete()
            .eq("article_id", article_id);

        if (error) {
            alert("Error deleting article: " + error.message);
        } else {
            alert("Article deleted!");
            navigate("/");
        }
    };

    return (
        <div className="p-6">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input 
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Type"
                    />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl mb-4">{title}</h1>
                    <p className="mb-4 whitespace-pre-line">{body}</p>
                    <p className="text-sm text-gray-400 mb-2">Type: {type}</p>
                </>
            )}

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

export default ArticleScreen;