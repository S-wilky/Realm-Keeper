import supabase from "../services/supabase-client";
import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import logout from "../services/SessionManagement";
import "../styles/overrides.css";
import type { User } from "@supabase/supabase-js";

import PopupModal from "../components/Modals/PopupModal";
import WorldCreationForm from "../components/Modals/WorldCreationForm";
import CampaignCreationForm from "../components/Modals/CampaignCreationForm";
import ArticleCreationForm from "../components/Modals/ArticleCreationForm";
import SessionCreationForm from "../components/Modals/SessionCreationForm";
import RK_Icon from "../components/RK_Icon";

type SectionItem = {
    world_id?: string;
    article_id?: string;
    campaign_id?: string;
    session_id?: string;
    name?: string;
    title?: string;
    description?: string;
    summary?: string;
    category?: string;
    type?: string;
    body?: string;
    world_id_ref?: string;
    campaign_id_ref?: string;
    tags?: string[];
    [key: string]: any;
};

type SectionsData = {
    Worlds: SectionItem[];
    Articles: SectionItem[];
    "AI Chat": string[];
    Campaigns: SectionItem[];
    Sessions: SectionItem[];
};

type DashboardProps = {
    user?: User;
};

const initialSectionsData: SectionsData = {
    Worlds: [],
    Articles: [],
    "AI Chat": ["Chatbot"],
    Campaigns: [],
    Sessions: [],
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const navigate = useNavigate();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [sectionsDataState, setSectionsDataState] =
        useState<SectionsData>(initialSectionsData);

    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");

    document.title = "Realm Keeper | Dashboard";

    useEffect(() => {
        const getSession = async (): Promise<void> => {
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

        async function fetchUsername(): Promise<void> {
            const { data, error } = await supabase
                .from("profile")
                .select("username")
                .eq("profile_id", user?.id)
                .maybeSingle();
            
            if (error) {
                console.log("Dashboard fetch username error:", error);
            }

            if (data?.username) {
                setUsername(data.username);
            }
        }

        fetchUsername();
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async (): Promise<void> => {
            const { data: worlds } = await supabase
                .from("worlds")
                .select("*")
                .eq("user_id", user.id);

            const { data: articles } = await supabase
                .from("articles")
                .select("*")
                .eq("user_id", user.id);

            const { data: campaigns } = await supabase
                .from("campaigns")
                .select("*")
                .eq("user_id", user.id);

            const { data: sessions } = await supabase
                .from("sessions")
                .select("*")
                .eq("user_id", user.id);

            setSectionsDataState((prev) => ({
                ...prev,
                Worlds: worlds || [],
                Articles: articles || [],
                Campaigns: campaigns || [],
                Sessions: sessions || [],
            }));
        };

        fetchData();

        const worldChannel = supabase
            .channel("worlds_changes")
            .on(
                "postgres_changes",
                {
                   event: "INSERT",
                   schema: "realms",
                   table: "worlds",
                   filter: `user_id=eq.${user.id}`, 
                },
                (payload: any) => {
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
                {
                    event: "INSERT",
                    schema: "realms",
                    table: "campaigns",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload: any) => {
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
                {
                    event: "INSERT",
                    schema: "realms",
                    table: "articles",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload: any) => {
                    setSectionsDataState((prev) => ({
                        ...prev,
                        Articles: [...prev.Articles, payload.new],
                    }));
                }
            )
            .subscribe();

        const sessionChannel = supabase
            .channel("sessions_changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "realms",
                    table: "sessions",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload: any) => {
                    setSectionsDataState((prev) => ({
                        ...prev,
                        Sessions: [...prev.Sessions, payload.new],
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(worldChannel);
            supabase.removeChannel(articleChannel);
            supabase.removeChannel(campaignChannel);
            supabase.removeChannel(sessionChannel);
        };
    }, [user?.id]);

    useEffect(() => {
        localStorage.setItem(
            "sectionsData",
            JSON.stringify(sectionsDataState)
        );
    }, [sectionsDataState]);

    const toggleSection = (section: string): void => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleOpenPopup = (type: string): void => {
        setActivePopup(type);
    };

    const handleClosePopup = (): void => {
        setActivePopup(null);
    };

    const renderSectionItems = (
        section: string,
        items: any[]
    ): React.ReactNode => {
        if (!items || items.length === 0) {
            return <p className="text-gray-400">No items yet</p>;
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {items.map((item: any, index: number) => (
                    <div
                        key={index}
                        className="bg-gunmetal border border-gray-600 rounded-xl text-center py-4 text-[#D9DDDC] hover:opacity-80 hover:bg-dusky-blue transition cursor-pointer"
                        onClick={() => {
                            if (
                                section === "AI Chat" &&
                                item === "Chatbot"
                            ) {
                                navigate("/chatbot");
                            } else if (section === "Worlds") {
                                navigate(`/world/${item.world_id}`, {
                                    state: item,
                                });
                            } else if (section === "Articles") {
                                navigate(`/article/${item.article_id}`, {
                                    state: item,
                                });
                            } else if (section === "Campaigns") {
                                navigate(`/campaign/${item.campaign_id}`, {
                                    state: item,
                                });
                            } else if (section === "Sessions") {
                                navigate(`/session/${item.session_id}`, {
                                    state: item,
                                });
                            }
                        }}
                    >
                        {typeof item === "string" ? (
                            item
                        ) : (
                            <div className="flex flex-col">
                                <strong>
                                    {item.name ||
                                        item.title ||
                                        "Unnamed"}
                                </strong>

                                {item.description && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {item.description}
                                    </p>
                                )}

                                {item.summary && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {item.summary}
                                    </p>
                                )}

                                {item.category && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {item.category}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleCreateWorld = async (data: any): Promise<void> => {
        const { data: newWorld, error } = await supabase
            .from("worlds")
            .insert([
                {
                    name: data.name,
                    description: data.description,
                    user_id: user.id,
                },
            ])
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

    const handleCreateCampaign = async (
        data: any
    ): Promise<void> => {
        if (!data.world_id) {
            console.error(
                "World must be selected for a campaign!"
            );
            return;
        }

        const { data: newCampaign, error } = await supabase
            .from("campaigns")
            .insert([
                {
                    title: data.title,
                    description: data.description,
                    world_id: data.world_id,
                    user_id: user.id,
                    tags: data.tags || [],
                },
            ])
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

    const handleCreateArticle = async (
        data: any
    ): Promise<any> => {
        const { data: newArticle, error } = await supabase
            .from("articles")
            .insert([
                {
                    title: data.title,
                    type: data.type,
                    body: data.body,
                    world_id: data.world_id || null,
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (!error) {
            setSectionsDataState((prev) => ({
                ...prev,
                Articles: [...prev.Articles, newArticle],
            }));

            handleClosePopup();
        } else {
            console.error(
                "Failed to create article:",
                error
            );
        }

        return newArticle;
    };

    const handleCreateSession = async (
        data: any
    ): Promise<void> => {
        const { data: newSession, error } = await supabase
            .from("sessions")
            .insert([
                {
                    title: data.title,
                    description: data.description,
                    campaign_id: data.campaign_id || null,
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (!error) {
            setSectionsDataState((prev) => ({
                ...prev,
                Sessions: [...prev.Sessions, newSession],
            }));
        }

        handleClosePopup();
    };

    return (
        <div className="w-screen h-screen m-0 p-6 overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <img
                    src="https://xkrrvlwvkmygmxcrqauq.supabase.co/storage/v1/object/public/realm-assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-20 h-20"
                />

                {username !== "" ? (
                    <h1 className="text-3xl font-semibold text-center grow">
                        Welcome back, {username}!
                    </h1>
                ): (
                    <p className="text-3xl">
                        Welcome to Realm Keeper! Set your
                        username from the profile page {"---->"}
                    </p>
                )}

                <div className="flex items-center gap-3">
                    <button
                        className="bg-dusky-blue text-[#D9DDDC] m-0 p-0 rounded-full hover:opacity-80 transition"
                        onClick={() => 
                            setIsMenuOpen(!isMenuOpen)
                        }
                    >
                        <RK_Icon
                            icon="hamburger"
                            size="sm"
                            color="Abbey"
                            onClick={undefined}
                            className=""
                        />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-6 top-20 bg-[#2C3539] border border-gray-600 rounded-lg shadow-lg p-4 flex flex-col gap-2 z-50">
                            <button
                                onClick={() =>
                                    navigate("/profile")
                                }
                                className="bg-dusky-blue text-[#D9DDDC] hover:text-white text-left"
                            >
                                Profile
                            </button>

                            <button
                                onClick={logout}
                                className="bg-dusky-blue text-[#D9DDDC] hover:text-white text-left"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
                {Object.entries(sectionsDataState).map(
                    ([section, items]) => (
                        <div
                            key={section}
                            className="border border-gray-500 rounded-2xl bg-abbey p-5 hover:opacity-90"
                        >
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                    toggleSection(section)
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold">
                                        {section}
                                    </h2>

                                    <span
                                        className="bg-pale-orange text-black px-1.5 py-0.5 rounded-full text-sm flex items-center hover:opacity-80"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (
                                                section ===
                                                "Worlds"
                                            ) {
                                                handleOpenPopup(
                                                    "world"
                                                );
                                            } else if (
                                                section ===
                                                "Articles"
                                            ) {
                                                handleOpenPopup(
                                                    "article"
                                                );
                                            } else if (
                                                section ===
                                                "Campaigns"
                                            ) {
                                                handleOpenPopup(
                                                    "campaign"
                                                );
                                            } else if (
                                                section ===
                                                "Sessions"
                                            ) {
                                                handleOpenPopup(
                                                    "session"
                                                );
                                            } else if (
                                                section ===
                                                "AI Chat"
                                            ) {
                                                navigate(
                                                    "/chatbot"
                                                );
                                            }
                                        }}
                                    >
                                        <FiPlus size={14} />
                                    </span>
                                </div>

                                <span className="text-2xl">
                                    {openSections[section]
                                    ? "▾"
                                    : "▸"}
                                </span>
                            </div>

                            {openSections[section] &&
                                renderSectionItems(
                                    section,
                                    items as any[]
                                )}
                            </div>
                    )
                )}
            </div>

            {activePopup && (
                <PopupModal onClose={handleClosePopup}>
                    {activePopup === "world" && (
                        <WorldCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateWorld}
                        />
                    )}

                    {activePopup === "article" && (
                        <ArticleCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateArticle}
                            worlds={sectionsDataState.Worlds}
                        />
                    )}

                    {activePopup === "campaign" && (
                        <CampaignCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateCampaign}
                            worlds={sectionsDataState.Worlds}
                        />
                    )}

                    {activePopup === "session" && (
                        <SessionCreationForm
                            onClose={handleClosePopup}
                            onCreate={handleCreateSession}
                            campaigns={
                                sectionsDataState.Campaigns
                            }
                        />
                    )}
                </PopupModal>
            )}
        </div>
    );
};

export default Dashboard;