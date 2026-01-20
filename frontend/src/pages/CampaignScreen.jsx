// Campaign Screen

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";
import SideMenu from "../components/SideMenu";
import { wholeScreen, mainScreen } from "../styles/tailwindClasses";

const CampaignScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { campaign_id, title: initialTitle, description: initialDescription /*, user_id*/ } = state;
    
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [isEditing, setIsEditing] = useState(false);

    if (!state) return <p>No campaign data found.</p>;

    const handleSave = async () => {
        const { error } = await supabase
            .from("campaigns")
            .update({ title, description })
            .eq("campaign_id", campaign_id)

        if (error) {
            alert("Error saving campaign: " + error.message);
        } else {
            alert("Campaign saved!");
            // navigate("/", { replace: true })
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;

        const { error } = await supabase
            .from("campaigns")
            .delete()
            .eq("campaign_id", campaign_id)
            .maybeSingle();

        if (error) {
            alert("Error deleting campaign: " + error.message);
        } else {
            alert("Campaign deleted!");
            navigate("/");
        }
    };


    return (
        <div className={wholeScreen}>
            <SideMenu />
            <div className={mainScreen}>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                        <h1 className="text-3xl mb-4">{title}</h1>
                        <p className="mb-4">{description}</p>
                    </>
                )}

                <div className="flex gap-2 mt-4">
                    {isEditing ? (
                        <button
                            className="bg-dusky-blue text-white px-4 py-2 rounded"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            className="bg-dusky-blue text-white px-4 py-2 rounded"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        className="bg-pale-orange text-white px-4 py-2 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-dusky-blue text-white px-4 py-2 rounded"
                        onClick={() => navigate("/")}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignScreen;