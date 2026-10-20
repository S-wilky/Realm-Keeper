import React, { useState } from "react";
import "../styles/overrides.css";
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
  Sparkles,
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
  {
    id: "worlds",
    label: "Worlds",
    icon: <Globe className="w-5 h-5 shrink-0" />,
  },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: <Flame className="w-5 h-5 shrink-0" />,
  },
  { id: "maps", label: "Maps", icon: <Map className="w-5 h-5 shrink-0" /> },
  {
    id: "characters",
    label: "Characters",
    icon: <Users className="w-5 h-5 shrink-0" />,
  },
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
      <div className="flex flex-col p-4 gap-4 border-b border-[#1E2D4A]/50 w-full">
        <div className="flex items-center h-12 w-full">
          {/* Static Icon Box */}
          <button
            onClick={() => handleIconClick("dashboard")}
            aria-label="Realm Keeper Home"
            className={`w-12 h-12 shrink-0 rounded-xl bg-[#121C2E] border flex items-center justify-center font-bold text-lg shadow-sm transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "border-[#FF7A2F] text-[#FF7A2F]"
                : "border-[#2A3A55] text-[#FF7A2F] hover:border-[#FF7A2F]"
            }`}
          >
            RK
          </button>
          {/* Animated Text Box */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isExpanded ? "w-full opacity-100 ml-3" : "w-0 opacity-0 ml-0"
            }`}
          >
            <span className="font-bold text-[#ECE6DA] text-base tracking-wide whitespace-nowrap">
              Realm Keeper
            </span>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          aria-label="Create New"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A2F] to-[#E56A22] text-white font-medium flex items-center shadow-md shadow-[#FF7A2F]/15 hover:opacity-95 transition-all cursor-pointer overflow-hidden"
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <Plus className="w-5 h-5 shrink-0" />
          </div>
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 text-left ${
              isExpanded ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          >
            <span className="whitespace-nowrap">Create</span>
          </div>
        </button>
      </div>

      {/* Middle Section: Search & Nav Links */}
      <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto overflow-x-hidden w-full">
        {/* Search Bar Wrapper */}
        <div
          className={`flex items-center w-full h-12 bg-surface border border-[#2A3A55] rounded-xl overflow-hidden transition-colors ${
            isExpanded ? "focus-within:border-[#FF7A2F]" : "hover:border-[#FF7A2F] cursor-pointer"
          }`}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center text-[#94A3B8]">
            <Search className="w-4 h-4 shrink-0" />
          </div>
          <div
            className={`flex items-center h-full overflow-hidden transition-all duration-300 ${
              isExpanded ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-full bg-transparent outline-none text-sm text-[#ECE6DA] placeholder-[#94A3B8] pr-3"
              disabled={!isExpanded}
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 w-full">
          {DEFAULT_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleIconClick(item.id)}
                title={!isExpanded ? item.label : undefined}
                className={`flex items-center w-full h-12 rounded-xl text-sm font-medium transition-colors cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-[#1E2D4A] text-[#FF7A2F] border border-[#FF7A2F]/30 shadow-inner"
                    : "text-[#94A3B8] hover:text-[#ECE6DA] hover:bg-[#121C2E]/60 border border-transparent"
                }`}
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                <div
                  className={`flex items-center overflow-hidden transition-all duration-300 text-left ${
                    isExpanded ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col p-4 gap-3 border-t border-[#1E2D4A] bg-[#0B1320] w-full">
        {/* Notifications */}
        <button
          onClick={() => handleIconClick("notifications")}
          title={!isExpanded ? "Notifications" : undefined}
          className={`flex items-center w-full h-12 rounded-xl text-sm transition-colors cursor-pointer overflow-hidden ${
            activeTab === "notifications"
              ? "bg-[#1E2D4A] text-[#FF7A2F] border border-[#FF7A2F]/30"
              : "text-[#94A3B8] hover:text-[#ECE6DA] hover:bg-[#121C2E] border border-transparent"
          }`}
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center relative">
            <Bell className="w-5 h-5 shrink-0" />
            {notificationCount > 0 && !isExpanded && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#FF7A2F] ring-2 ring-[#0B1320]" />
            )}
          </div>
          <div
            className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 pr-3 ${
              isExpanded ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          >
            <span className="whitespace-nowrap">Notifications</span>
            {notificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF7A2F] text-white text-xs font-bold shrink-0">
                {notificationCount}
              </span>
            )}
          </div>
        </button>

        {/* User Profile / XP */}
        <div className="flex flex-col justify-center overflow-hidden transition-all duration-300 shrink-0 h-20 w-full">
          {/* Avatar & Details Row */}
          <div className="flex items-center w-full h-10">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-[#1E2D4A] border border-[#2A3A55] flex items-center justify-center text-[#ECE6DA] font-semibold text-sm shrink-0">
                {userAvatar}
              </div>
            </div>

            <div
              className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${
                isExpanded ? "w-full opacity-100 ml-1" : "w-0 opacity-0 ml-0"
              }`}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-sm font-medium text-[#ECE6DA] leading-tight truncate">
                  {userName}
                </span>
                <span className="text-[11px] text-[#FF7A2F] flex items-center gap-1 mt-0.5 font-medium truncate">
                  <Sparkles className="w-3 h-3 shrink-0" /> Lvl {level} Explorer
                </span>
              </div>
              <button
                title="User Settings"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick("settings");
                }}
                className="text-[#94A3B8] hover:text-[#ECE6DA] transition-colors cursor-pointer shrink-0 ml-1"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* XP Bar (Locked properly under the w-12 column when collapsed) */}
          <div
            className={`flex flex-col justify-end transition-all duration-300 mt-2 ${
              isExpanded ? "w-full px-1" : "w-10 ml-1"
            }`}
          >
            <div className="flex justify-between items-center text-[#94A3B8] mb-1 leading-none h-3 overflow-hidden whitespace-nowrap">
              {isExpanded ? (
                <>
                  <span className="text-[10px] font-medium animate-fadeIn">Quest Progress</span>
                  <span className="text-[10px] font-medium animate-fadeIn">
                    {currentXp} / {maxXp} XP
                  </span>
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

        {/* Collapse / Expand Toggle Arrow */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className="flex items-center w-full h-10 text-[#94A3B8] hover:text-[#ECE6DA] transition-colors cursor-pointer shrink-0"
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </button>
      </div>
    </aside>
  );
}
