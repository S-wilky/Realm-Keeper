// World Creation Popup

import React, { useState } from "react";

const WorldCreationForm = ({ onClose, onCreate }) => {
    const [worldName, setWorldName] = useState("");
    const [description, setDescription] = useState("");

    const isFormValid = worldName.trim() !== "" && description.trim() !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        onCreate({ name: worldName, description });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1rem" }}>Create New World</h2>
            <input
                type="text"
                placeholder="World Name"
                value={worldName}
                onChange={(e) => setWorldName(e.target.value)}
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
            <textarea
                placeholder="Description"
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
                required
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
                Create World
            </button>
        </form>
    );
};

export default WorldCreationForm;