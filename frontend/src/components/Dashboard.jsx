// Dashboard

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiPlus } from "react-icons/fi";
// import logout from "../services/SessionManagement";
import generateQuest from "../../../ai-service/app/generateQuest"

import PopupModal from "./PopupModal";
import WorldCreationForm from "./WorldCreationForm";
import CampaignCreationForm from "./CampaignCreationForm";
import ArticleCreationForm from "./ArticleCreationForm";
import ChatbotScreen from "./ChatbotScreen";

const initialSectionsData = {
    Worlds: [],
    Campaigns: [],
    Articles: [],
    "AI Chat": ["Chatbot"],
    Statblocks: [],
    Sessions: [],
};

const Dashboard = ({ user = "User" }) => {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({});
    const [sectionsDataState, setSectionsDataState] = useState(initialSectionsData);
    const [activePopup, setActivePopup] = useState(null);

    // Load saved sections from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("sectionsData");
        if (saved) setSectionsDataState(JSON.parse(saved));
    }, []);

    // Save to localStorage wheneber sectionsDataState changes
    useEffect(() => {
        localStorage.setItem("sectionsData", JSON.stringify(sectionsDataState));
    }, [sectionsDataState]);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleOpenPopup = (type) => setActivePopup(type);
    const handleClosePopup = () => setActivePopup(null);

    const renderSectionItems = (section, items) => {
        if (!items || items.length === 0) return <p className="text-gray-400">No items yet</p>;

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#2C3539] border border-gray-600 rounded-xl text-center py-4 text-[#D9DDDC] hover:bg-[#37414A] transition cursor-pointer"
                        onClick={() => {
                            // Navigate to Chatbot page when clicking "Chatbot"
                            if (section === "AI Chat" && item === "Chatbot") {
                                navigate("/chatbot");
                            }
                        }}
                    >
                        {typeof item === "string" ? (
                            item
                        ) : (
                            <div className="flex flex-col">
                                <strong>{item.name || "Unnamed"}</strong>
                                {item.description && (
                                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                )}
                                {item.summary && (
                                    <p className="text-sm text-gray-400 mt-1">{item.summary}</p>
                                )}
                                {item.category && (
                                    <p className="text-sm text-gray-400 mt-1">{item.category}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-screen h-screen m-0 p-0 overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans p-6 flex flex-col">
            {/* Top bar */}
            
            <div className="flex items-center justify-between mb-8">
                <img
                    src="/src/assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-20 h-20"
                />

                <h1 className="text-3xl font-semibold text-center flex-grow">
                    Welcome back, {user}!
                </h1>

                <div className="flex items-center gap-3">
                    {/* Search bar */}

                    <div className="flex items-center bg-[#3a3f47] rounded-full px-3 py-1">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400 px-2 w-32 md:w-48"
                        />
                        <FiSearch className="text-gray-400" />
                    </div>

                    {/* Hamburger icon */}

                    <button className="bg-[#EAAC59] p-3 rounded-full hover:opacity-80 transition" onClick={generateQuest /*logout*/}>
                        <FiMenu size={20} />
                    </button>
                </div>
            </div>

            {/* Sections */}

            <div className="space-y-6 flex-1 overflow-y-auto">
                {Object.entries(sectionsDataState).map(([section, items]) => (
                    <div
                        key={section}
                        className="border border-gray-500 rounded-2xl bg-[#2C3539] p-5"
                    >
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(section)}
                        >
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold">{section}</h2>
                                <span className="bg-[#EAAC59] text-black px-1.5 py-0.5 rounded-full text-sm flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent section toggle
                                        if (section === "Worlds") handleOpenPopup("world");
                                        else if (section === "Campaigns") handleOpenPopup("campaign");
                                        else if (section === "Articles") handleOpenPopup("article");
                                    }}
                                >
                                    <FiPlus size={14} />
                                </span>
                            </div>
                            <span className="text-2xl">
                                {openSections[section] ? "▾" : "▸"}
                            </span>
                        </div> 

                        {openSections[section] && renderSectionItems(section, items)}
                    </div>
                ))}
            </div>

            {/* Popups */}
            {activePopup && (
                <PopupModal onClose={handleClosePopup}>
                    {activePopup === "world" && (
                        <WorldCreationForm
                            onClose={handleClosePopup}
                            onCreate={(data) => 
                                setSectionsDataState((prev) => ({
                                    ...prev,
                                    Worlds: [...prev.Worlds, { name: data.name, description: data.description }],
                                }))
                            }
                        />
                    )}
                    {activePopup === "campaign" && (
                        <CampaignCreationForm
                            onClose={handleClosePopup}
                            onCreate={(data) => 
                                setSectionsDataState((prev) => ({
                                    ...prev,
                                    Campaigns: [...prev.Campaigns, { name: data.campaignName, world: data.world, summary: data.summary }],
                                }))
                            }
                        />
                    )}
                    {activePopup === "article" && (
                        <ArticleCreationForm
                            onClose={handleClosePopup}
                            onCreate={(data) => 
                                setSectionsDataState((prev) => ({
                                    ...prev,
                                    Articles: [...prev.Articles, { name: data.title, category: data.category, content: data.content }],
                                }))
                            }
                        />
                    )}
                </PopupModal>
            )}
        </div>
    );
};

export default Dashboard;