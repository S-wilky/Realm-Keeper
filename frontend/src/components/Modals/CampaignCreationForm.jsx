// Campaign Creation Popup

import React, { useState } from "react";

const CampaignCreationForm = ({ onClose, onCreate, worlds = [] }) => {
    const [title, setTitle] = useState("");
    const [worldId, setWorldId] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const isFormValid =
        title.trim() !== "" && worldId.trim() !== "";
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const tagsArray = tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        onCreate({ 
            title,
            description,
            world_id: worldId,
            tags: tagsArray, 
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1rem" }}>Create New Campaign</h2>
            <input
                type="text"
                placeholder="Campaign Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #504B52",
                    backgroundColor: "#2C3539",
                    color: "#D9DDDC",
                }}
                required
            />
            <select 
                value={worldId}
                onChange={(e) => setWorldId(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #504B52",
                    backgroundColor: "#2C3539",
                    color: "#D9DDDC",
                }}
                required
            >
                <option value="">Select a World</option>
                {worlds.map((w) => (
                    <option key={w.world_id} value={w.world_id}>
                        {w.name}
                    </option>
                ))}
            </select>
            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #504B52",
                    backgroundColor: "#2C3539",
                    color: "#D9DDDC",
                }}
            />
            <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #504B52",
                    backgroundColor: "#2C3539",
                    color: "#D9DDDC",
                }}
            />
            <button
                type="submit"
                disabled={!isFormValid}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isFormValid ? "#504B52" : "#3A363C",
                    color: "#D9DDDC",
                    cursor: isFormValid ? "pointer" : "not-allowed",
                }}
            >
                Create Campaign
            </button>
        </form>
    );
};

export default CampaignCreationForm;