// Campaign Creation Popup

import React, { useState } from "react";

const CampaignCreationForm = ({ onClose, onCreate }) => {
    const [campaignName, setCampaignName] = useState("");
    const [world, setWorld] = useState("");
    const [summary, setSummary] = useState("");

    const isFormValid =
        campaignName.trim() !== "" && world.trim() !== "" && summary.trim() !== "";
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        onCreate({ campaignName, world, summary });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1rem" }}>Create New Campaign</h2>
            <input
                type="text"
                placeholder="Campaign Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
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
            <input
                type="text"
                placeholder="Linked World"
                value={world}
                onChange={(e) => setWorld(e.target.value)}
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
                placeholder="Short Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
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
                Create Campaign
            </button>
        </form>
    );
};

export default CampaignCreationForm;