// Dashboard

import React, { useState } from "react";
import { FiSearch, FiMenu, FiPlus } from "react-icons/fi";

const sectionsData = {
    Worlds: ["World One", "World Two"],
    Campains: ["Campaign One", "Campaign Two"],
    Articles: ["Article One", "Article Two"],
    "AI Chat": ["Chatbot"],
    Statblocks: ["Statblock One", "Statblock Two"],
    Sessions: ["Session One", "Session Two"],
};

const Dashboard = ({ user = "User" }) => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="min-h-screen bg-[#2C3539] text-white font-sans p-6">
            {/* Top bar */}
            
            <div className="flex items-center justify between mb-8">
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

                    <button className="bg-[#EAAC59] p-3 rounded-full hover:opacity-80 transition">
                        <FiMenu size={20} />
                    </button>
                </div>
            </div>

            {/* Sections */}

            <div className="space-y-6">
                {Object.entries(sectionsData).map(([section, items]) => (
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
                                <span className="bg-[#EAAC59] text-black px-1.5 py-0.5 rounded-full text-sm flex items-center">
                                    <FiPlus size={14} />
                                </span>
                            </div>
                            <span className="text-2xl">
                                {openSections[section] ? "▾" : "▸"}
                            </span>
                        </div> 

                        {openSections[section] && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {items.map((item) => (
                                    <div
                                        key={item}
                                        className="bg-[#2C3539] border border-gray-600 rounded-xl text-center py-4 text-[#D9DDDC] hover:bg-[#37414A] transition cursor-pointer"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;