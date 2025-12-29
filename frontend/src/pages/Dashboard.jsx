// Dashboard

import supabase from "../services/supabase-client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiPlus } from "react-icons/fi";
import logout from "../services/SessionManagement";
import "../styles/overrides.css";


import PopupModal from "../components/PopupModal";
import WorldCreationForm from "../components/WorldCreationForm";
import CampaignCreationForm from "../components/CampaignCreationForm";
import ArticleCreationForm from "../components/ArticleCreationForm";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.log("Error getting session:", error);
            } else {
                console.log("Supabase session:", data.session);
                console.log("Current UID", data.session?.user?.id);
            }
        };
        getSession();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const fetchUsername = async () => {
            const { data, error } = await supabase
                .from("profile")
                .select("username")
                .eq("profile_id", user.id)
                .maybeSingle();

            if (error) console.log("Dashboard fetch username error:", error);
            if (data?.username) setUsername(data.username);
        };

        fetchUsername();
    }, [user?.id]);

    // Fetch saved popups from Supabase
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const { data: worlds } = await supabase
                .from("worlds")
                .select("*")
                .eq("user_id", user.id);
            const { data: campaigns } = await supabase
                .from("campaigns")
                .select("*")
                .eq("user_id", user.id);
            const { data: articles } = await supabase
                .from("articles")
                .select("*")
                .eq("user_id", user.id);

            setSectionsDataState((prev) => ({
                ...prev,
                Worlds: worlds || [],
                Campaigns: campaigns || [],
                Articles: articles || [],
            }));
        };

        fetchData();

        // Real time listeners
        const worldChannel = supabase
            .channel("worlds_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "realms", table: "worlds", filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setSectionsDataState((prev) => ({
                        ...prev,
                        Worlds: [...prev.Worlds, payload.new],
                    }));
                }
            )
            .subscribe();

        const campaignChannel = supabase
            .channel("campaigns_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "realms", table: "campaigns", filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setSectionsDataState((prev) => ({
                        ...prev,
                        Campaigns: [...prev.Campaigns, payload.new],
                    }));
                }
            )
            .subscribe();

        const articleChannel = supabase
            .channel("articles_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "realms", table: "articles", filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setSectionsDataState((prev) => ({
                        ...prev,
                        Articles: [...prev.Articles, payload.new],
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(worldChannel);
            supabase.removeChannel(campaignChannel);
            supabase.removeChannel(articleChannel);
        };
    }, [user.id]);

    // Load saved sections from localStorage on mount
    // useEffect(() => {
    //     const saved = localStorage.getItem("sectionsData");
    //     if (saved) setSectionsDataState(JSON.parse(saved));
    // }, []);

    // Save to localStorage wheneber sectionsDataState changes
    useEffect(() => {
        localStorage.setItem("sectionsData", JSON.stringify(sectionsDataState));
    }, [sectionsDataState]);

    //Put event listener(s)

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
                            // Navigate to screens "World", "Campaigns", "Articles"
                            if (section === "AI Chat" && item === "Chatbot") {
                                navigate("/chatbot");
                            } else if (section === "Worlds") {
                                navigate(`/world/${item.world_id}`, { state: item });
                            } else if (section === "Campaigns") {
                                navigate(`/campaign/${item.campaign_id}`, { state: item });
                            } else if (section === "Articles") {
                                navigate(`/article/${item.article_id}`, { state: item });
                            }
                        }}
                    >
                        {typeof item === "string" ? (
                            item
                        ) : (
                            <div className="flex flex-col">
                                <strong>{item.name || item.title || "Unnamed"}</strong>
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

    // Handlers with Supabase inserts
    const handleCreateWorld = async (data) => {
        const { data: newWorld, error } = await supabase
            .from("worlds")
            .insert([{ 
                name: data.name, 
                description: data.description, 
                user_id: user.id }])
            .select()
            .single();

        if (!error) {
            setSectionsDataState((prev) => ({
                ...prev,
                Worlds: [...prev.Worlds, newWorld],
            }));
        }

        handleClosePopup();
    };

    const handleCreateCampaign = async (data) => {
        if (!data.world_id) {
            console.error("World must be selected for a campaign!");
            return;
        }

        const { data: newCampaign, error } = await supabase
            .from("campaigns")
            .insert([{ 
                title: data.title, 
                description: data.description, 
                world_id: data.world_id, 
                user_id: user.id, 
                tags: data.tags || [] }])
            .select()
            .single();

        if (!error) {
            setSectionsDataState((prev) => ({
                ...prev,
                Campaigns: [...prev.Campaigns, newCampaign],
            }));
        }

        handleClosePopup();
    };

    const handleCreateArticle = async (data) => {
        const { data: newArticle, error } = await supabase
            .from("articles")
            .insert([{ 
                title: data.title, 
                type: data.type, 
                body: data.body, 
                world_id: data.world_id || null, 
                user_id: user.id }])
            .select()
            .single();

        if (!error) {
            setSectionsDataState((prev) => ({
                ...prev,
                Articles: [...prev.Articles, newArticle],
            }));
        }

        handleClosePopup();
    };

    return (
        <div className="w-screen h-screen m-0 p-6 overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans flex flex-col">
            {/* Top bar */}
            
            <div className="flex items-center justify-between mb-8">
                <img
                    //onClick={logout}
                    src="/src/assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-20 h-20"
                />

                <h1 className="text-3xl font-semibold text-center grow">
                    Welcome back, {username || user?.email}!
                </h1>

                <div className="flex items-center gap-3">
                    {/* Search bar */}

                    <div className="flex items-center bg-[#3A3F47] rounded-full px-3 py-1">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400 px-2 w-32 md:w-48"
                        />
                        <FiSearch className="text-gray-400" />
                    </div>

                    {/* Hamburger icon */}

                    <button 
                        className="bg-pale-orange text-[#D9DDDC] p-3 rounded-full hover:opacity-80 transition" //pale-orange is #EAAC59
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FiMenu size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-6 top-20 bg-[#2C3539] border border-gray-600 rounded-lg shadow-lg p-4 flex flex-col gap-2 z-50"> 
                            <button
                                onClick={() => navigate("/profile")}
                                className="bg-pale-orange text-[#D9DDDC] hover:text-white text-left" //pale-orange is #EAAC59
                            >
                                Profile
                            </button>
                            <button
                                onClick={logout}
                                className="bg-pale-orange text-[#D9DDDC] hover:text-white text-left" //pale-orange is #EAAC59
                            >
                                Logout
                            </button>
                        </div>
                    )}
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
                            onCreate={handleCreateWorld} />
                    )}
                    {activePopup === "campaign" && (
                        <CampaignCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateCampaign}
                            worlds={sectionsDataState.Worlds}
                        />
                    )}
                    {activePopup === "article" && (
                        <ArticleCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateArticle}
                            worlds={sectionsDataState.Worlds}
                        />
                    )}
                </PopupModal>
            )}
        </div>
    );
};

export default Dashboard;