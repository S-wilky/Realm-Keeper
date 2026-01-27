// Article Creation Popup

import React, { useState } from "react";

const articleTypes = [
    // World & Lore
    "History",
    "Geography / Maps",
    "Cultures & Societies",
    "Politics & Governments",
    "Religion / Pantheon",
    "Factions / Guilds",
    "Species / Races / Monsters",
    "Legendary Events",
    "Myths & Folklore",

    // Characters & NPCs
    "NPCs / Important Figures",
    "Villains / Antagonists",
    "Allies / Companions",
    "Heroes / Player Characters",
    "Monsters / Beasts",

    // Adventures & Campaign Content
    "Quests / Story Hooks",
    "Encounters / Battles",
    "Locations / Dungeons",
    "Events / Festivals",
    "Traps / Puzzles",
    "Random Tables / Roll Tables",

    // Items & Magic
    "Weapons / Armor",
    "Artifacts / Legendary Items",
    "Consumables / Potions",
    "Spells / Magic Items",
    "Magical Phenomena / Curses",

    // Rules & Mechanics
    "Classes",
    "Subclasses",
    "Skills / Abilities",
    "Mechanics / Homebrew Rules",
    "Game Systems / Modifications",

    // Misc
    "Journals / Diaries",
    "Notes / Research",
    "Guides / Tutorials",
    "Story / Narrative Snippets",
    "Misc / Other",
    "Other (custom)",
];

const ArticleCreationForm = ({ onClose, onCreate, worlds }) => {
    const [title, setTitle] = useState("");
    const [world_id, setWorldId] = useState("");
    const [type, setType] = useState("");
    const [customType, setCustomType] = useState("");
    const [body, setBody] = useState("");

    const isFormValid =
        title.trim() !== "" && world_id.trim() !== "" && type.trim() !== "" && (type !== "Other (custom)" || customType.trim() !== "");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            // Create the article in Supabase
            const createdArticle = await onCreate({
                title,
                world_id,
                type: type === "Other (custom)" ? customType : type,
                body
            });

            // Ensure we have the article_id
            const articleId = createdArticle?.article_id;
            if (!articleId) {
                console.error("No article_id returned from onCreate");
                onClose();
                return;
            }

            // Call AI service to embed the article
            const res = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/embed-article`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ article_id: articleId, title: title, body: body }),
            });

            const embedData = await res.json();
            if (!embedData.success) {
                console.error("Embedding failed:", embedData.error);
            } else {
                console.log("Embedding successful:", embedData.data);
            }

            onClose(); // Close the form after creation and embedding
        } catch (err) {
            console.error("Article creation or embedding failed:", err);
            onClose();
        }
    };
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (!isFormValid) return;

    //     onCreate({ 
    //         title, 
    //         world_id,
    //         type: type === "Other (custom)" ? customType : type,
    //         body 
    //     });
    //     onClose();
    // };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1rem" }}>Create New Article</h2>
            <input
                type="text"
                placeholder="Article Title"
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
                value={world_id}
                onChange={(e) => setWorldId(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #504B52",
                    backgroundColor: "#3C3539",
                    color: "#D9DDDC",
                }}
                required
            >
                <option value="">Select World</option>
                {worlds.map((world) => (
                    <option key={world.world_id} value={world.world_id}>
                        {world.name}
                    </option>
                ))}
            </select>
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
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
                <option value="">Select Article Type</option>
                {articleTypes.map((t, idx) => (
                    <option key={idx} value={t}>
                        {t}
                    </option>
                ))}
            </select>

            {type === "Other (custom)" && (
                <input
                    type="text"
                    placeholder="Enter custom type"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
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
            )}
            <textarea
                placeholder="Body (optional)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
                Create Article
            </button>
        </form>
    );
};

export default ArticleCreationForm;