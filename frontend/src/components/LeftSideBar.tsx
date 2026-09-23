import React, { useState } from "react";
import { 
    Plus, 
    Search, 
    Globe, 
    Flame, 
    Map, 
    Users, 
    Bell, 
    Settings, 
    ChevronRight, 
    ChevronLeft,
    Sparkles
} from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface LeftSideBarProps {
    currentPath?: string;
    onNavigate?: (id: string) => void;
    onCreateClick?: () => void;
    userName?: string;
    userAvatar?: string;
    level?: number;
    currentXp?: number;
    maxXp?: number;
    notificationCount?: number;
    className?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
    { id: "worlds", label: "Worlds", icon: <Globe className="w-5 h-5 shrink-0" /> },
    { id: "campaigns", label: "Campaigns", icon: <Flame className="w-5 h-5 shrink-0" /> },
    { id: "maps", label: "Maps", icon: <Map className="w-5 h-5 shrink-0" /> },
    { id: "characters", label: "Characters", icon: <Users className="w-5 h-5 shrink-0" /> },
];

export default function LeftSideBar({
    currentPath = "worlds",
    onNavigate,
    onCreateClick,
    userName = "Shane",
    userAvatar = "S",
    level = 3,
    currentXp = 420,
    maxXp = 1000,
    notificationCount = 3,
    className = "",
}: LeftSideBarProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>(currentPath);

    const xpPercentage = Math.min(Math.max((currentXp / maxXp) * 100, 0), 100);

    const handleIconClick = (id: string) => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
        setActiveTab(id);
        onNavigate?.(id);
    };

    return (
        <aside
            aria-label="Sidebar Navigation"
            className={`flex flex-col h-screen bg-[#0B1320] border-r border-[#1E2D4A] transition-all duration-300 select-none overflow-hidden ${
                isExpanded ? "w-72" : "w-20"
            } ${className}`}
        >
            {/* Top Section: Logo & Create */}
            <div className="flex flex-col p-4 gap-4 border-b border-[#1E2D4A]/50">
                <div className="flex items-center justify-between h-12">
                    <button
                        onClick={() => handleIconClick("dashboard")}
                        aria-label="Realm Keeper Home"
                        className={`w-12 h-12 rounded-xl bg-[#121C2E] border flex items-center justify-center font-bold text-lg shadow-sm transition-colors cursor-pointer shrink-0 ${
                            activeTab === "dashboard"
                                ? "border-[#FF7A2F] text-[#FF7A2F]"
                                : "border-[#2A3A55] text-[#FF7A2F] hover:border-[#FF7A2F]"
                        }`}
                    >
                        RK
                    </button>
                    {isExpanded && (
                        <span className="font-bold text-[#ECE6DA] text-base tracking-wide truncate ml-3 flex-1 animate-fadeIn">
                            Realm Keeper
                        </span>
                    )}
                </div>

                {/* Create Button */}
                <button
                    onClick={onCreateClick}
                    aria-label="Create New"
                    className={`w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A2F] to-[#E56A22] text-white font-medium flex items-center shadow-md shadow-[#FF7A2F]/15 hover:opacity-95 transition-all cursor-pointer ${
                        isExpanded ? "px-4 gap-2 justify-start" : "justify-center px-0"
                    }`}
                >
                    <Plus className="w-5 h-5 shrink-0" />
                    {isExpanded && <span className="truncate animate-fadeIn">Create</span>}
                </button>
            </div>

            {/* Middle Section: Search & Nav Links */}
            <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto overflow-x-hidden">
                {/* Search Bar - Unified styling for both states */}
                <div className={`relative flex items-center h-12 shrink-0 transition-all ${isExpanded ? "w-full" : "w-12 mx-auto"}`}>
                    {isExpanded ? (
                        <>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-full bg-[#121C2E] border border-[#2A3A55] rounded-xl pl-9 pr-3 text-sm text-[#ECE6DA] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF7A2F] transition-colors"
                            />
                        </>
                    ) : (
                        <button
                            onClick={() => setIsExpanded(true)}
                            aria-label="Search"
                            className="w-12 h-12 rounded-xl bg-[#121C2E] border border-[#2A3A55] flex items-center justify-center text-[#94A3B8] hover:text-[#ECE6DA] hover:border-[#FF7A2F] transition-colors cursor-pointer"
                        >
                            <Search className="w-4 h-4 shrink-0" />
                        </button>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col gap-1">
                    {DEFAULT_NAV_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleIconClick(item.id)}
                                title={!isExpanded ? item.label : undefined}
                                className={`flex items-center h-12 rounded-xl text-sm font-medium transition-all cursor-pointer shrink-0 ${
                                    isExpanded ? "px-3 gap-3 justify-start" : "w-12 justify-center mx-auto"
                                } ${
                                    isActive
                                        ? "bg-[#1E2D4A] text-[#FF7A2F] border border-[#FF7A2F]/30 shadow-inner"
                                        : "text-[#94A3B8] hover:text-[#ECE6DA] hover:bg-[#121C2E]/60 border border-transparent"
                                }`}
                            >
                                {item.icon}
                                {isExpanded && <span className="truncate animate-fadeIn">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Footer Section */}
            <div className="flex flex-col p-4 gap-3 border-t border-[#1E2D4A] bg-[#0B1320]">
                {/* Notifications */}
                <button
                    onClick={() => handleIconClick("notifications")}
                    title={!isExpanded ? "Notifications" : undefined}
                    className={`flex items-center h-12 rounded-xl text-sm transition-colors cursor-pointer shrink-0 ${
                        isExpanded ? "px-3 justify-between" : "w-12 justify-center mx-auto relative"
                    } ${
                        activeTab === "notifications"
                            ? "bg-[#1E2D4A] text-[#FF7A2F] border border-[#FF7A2F]/30"
                            : "text-[#94A3B8] hover:text-[#ECE6DA] hover:bg-[#121C2E] border border-transparent"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 shrink-0" />
                        {isExpanded && <span>Notifications</span>}
                    </div>
                    {notificationCount > 0 && (
                        <span className={`${
                            isExpanded 
                                ? "px-2 py-0.5 rounded-full bg-[#FF7A2F] text-white text-xs font-bold" 
                                : "absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FF7A2F] ring-2 ring-[#0B1320]"
                        }`}>
                            {isExpanded ? notificationCount : ""}
                        </span>
                    )}
                </button>

                {/* User Profile / XP (Strict h-20 lock, no wrapper) */}
                <div className={`flex flex-col justify-center overflow-hidden transition-all duration-300 shrink-0 h-20 ${
                    isExpanded 
                        ? "px-2" 
                        : "w-12 mx-auto items-center"
                }`}>
                    {/* Top Row: Avatar & Details */}
                    <div className="flex items-center w-full min-w-0 h-10 shrink-0">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-lg bg-[#1E2D4A] border border-[#2A3A55] flex items-center justify-center text-[#ECE6DA] font-semibold text-sm shrink-0 ${!isExpanded && "mx-auto"}`}>
                            {userAvatar}
                        </div>
                        
                        {/* Expanded Profile Text */}
                        {isExpanded && (
                            <div className="flex items-center justify-between w-full min-w-0 ml-3 animate-fadeIn">
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-medium text-[#ECE6DA] leading-tight truncate">{userName}</span>
                                    <span className="text-[11px] text-[#FF7A2F] flex items-center gap-1 mt-0.5 font-medium truncate">
                                        <Sparkles className="w-3 h-3 shrink-0" /> Lvl {level} Explorer
                                    </span>
                                </div>
                                <button 
                                    title="User Settings"
                                    onClick={(e) => { e.stopPropagation(); handleIconClick("settings"); }}
                                    className="text-[#94A3B8] hover:text-[#ECE6DA] transition-colors cursor-pointer shrink-0 ml-1"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bottom Row: XP Bar & Percentage Text */}
                    <div className={`flex flex-col justify-end transition-all duration-300 mt-2 ${isExpanded ? "w-full" : "w-10 mx-auto"}`}>
                        {/* Fixed height text row to prevent Y-axis jumping */}
                        <div className="flex justify-between items-center text-[#94A3B8] mb-1 leading-none h-3 overflow-hidden">
                            {isExpanded ? (
                                <>
                                    <span className="text-[10px] font-medium animate-fadeIn">Quest Progress</span>
                                    <span className="text-[10px] font-medium animate-fadeIn">{currentXp} / {maxXp} XP</span>
                                </>
                            ) : (
                                <span className="w-full text-center text-[9px] font-bold animate-fadeIn tracking-tighter">
                                    {xpPercentage.toFixed(1)}%
                                </span>
                            )}
                        </div>
                        
                        <div className="w-full h-1.5 bg-[#121C2E] rounded-full overflow-hidden border border-[#2A3A55]/40 shrink-0">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF7A2F] to-[#FFA166] rounded-full transition-all duration-500"
                                style={{ width: `${xpPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Collapse / Expand Toggle Arrow (Fixed Height) */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    className="w-full h-10 flex items-center justify-center text-[#94A3B8] hover:text-[#ECE6DA] transition-colors cursor-pointer shrink-0"
                >
                    {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </aside>
    );
}