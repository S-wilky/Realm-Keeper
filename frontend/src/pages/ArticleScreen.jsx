// Article Screen (Pop up)

import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";
import RK_Button from "../components/RK_Button";
import RK_Icon from "../components/RK_Icon";
import "../styles/overrides.css";
import articleTypes from "../utils/articleTypes";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react"; // optional icon
import SideMenu from "../components/SideMenu"
import { FiPlus } from "react-icons/fi";

const ArticleScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { article_id, title: initialTitle, body: initialBody, type: initialType, metadata: metaData, /*user_id,*/ world_id } = state;

    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [type, setType] = useState(initialType);
    // const [metadata, setMetadata] = useState(metaData);
    const [activeTab, setActiveTab] = useState("content")
    const [customFields, setCustomFields] = useState(metaData?.customFields ?? [])
    const [newLabel, setNewLabel] = useState("");
    const [newValue, setNewValue] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    // const [isEditingBody, setIsEditingBody] = useState(false);
    const [isEditingType, setIsEditingType] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const inputRef = useRef(null);
    const measureRef = useRef(null);

    document.title = "Realm Keeper | Article";

    useEffect(() => {
        if (!isEditingTitle) return;
        if (!inputRef.current || !measureRef.current) return;

        const width = measureRef.current.offsetWidth;
        inputRef.current.style.width = `${width - 13}px`;
    }, [title, isEditingTitle]);
// END REACT HOOK CALLS

    if (!state) return <p>No article data found.</p>;

    const handleSave = async () => {
        let article_id_to_use = article_id; // use existing ID if editing

        try {
            // let result;

            if (article_id_to_use) {
                // Existing article -> update
                const { data, error } = await supabase
                    .from("articles")
                    .update({ title, body, type, world_id })
                    .eq("article_id", article_id_to_use)
                    .select();

                if (error) throw error;
                article_id_to_use = data[0].article_id; // ensure we have the correct ID
            } else {
                // New article -> insert
                const { data, error } = await supabase
                    .from("articles")
                    .insert({ title, body, type, world_id })
                    .select()
                    .single();

                if (error) throw error;
                article_id_to_use = data.article_id; // grab the new ID
            }

            // Ensure article_id exists before embedding
            if (!article_id_to_use) {
                console.error("Article ID missing; cannot embed");
                alert("Article saved, but no valid ID to embed.");
                return;
            }

            // Embed article
            const res = await fetch (`${import.meta.env.VITE_AI_SERVICE_URL}/embed-article`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ article_id: article_id_to_use, title: title, body: body }),
            });

            const embedData = await res.json();
            if (!embedData.success) {
                console.error("Embedding failed:", embedData.error);
                alert("Article saved, but embedding failed. Check console for detail.");
            } else {
                console.log("Embedding successful:", embedData.data);
            }

            setIsSaved(true);
            alert("Article saved!");
        } catch (err) {
            console.error("Error saving article:", err);
            alert("Error saving article. Check console for details.");
        }
    };
        // {
    //     const { error: saveError, data: savedData } = await supabase
    //         .from("articles")
    //         .update({ title, body, type, world_id })
    //         .eq("article_id", article_id)
    //         .select();

    //     if (saveError) {
    //         alert("Error saving article: " + saveError.message);
    //         return;
    //     }
        
    //     try {
    //         const res = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/embed-article`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 article_id,
    //                 body
    //             }),
    //         });

    //         const data = await res.json();

    //         if (!data.success) {
    //             console.error("Embedding failed:", data.error);
    //             alert("Article saved, but embeddding failed. Check console for details.");
    //         } else {
    //             console.log("Embedding successful:", data.data);
    //         }
    //     } catch (err) {
    //         console.error("Embedding request failed:", err);
    //         alert("Article saved, but embedding request failed. Check console.");
    //     }

    //         setIsSaved(true);
    //         alert("Article saved!");
    //         // navigate("/", { replace: true })
    // };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

        const { error } = await supabase
            .from("articles")
            .delete()
            .eq("article_id", article_id);

        if (error) {
            alert("Error deleting article: " + error.message);
        } else {
            alert("Article deleted!");
            navigate("/");
        }
    };

    const handleAddField = async () => {
        const field = {
            id: crypto.randomUUID(),
            label: newLabel,
            value: newValue,
        }

        const updatedFields = [...customFields, field]
        setCustomFields(updatedFields)

        setNewLabel("");
        setNewValue("");
        setIsModalOpen(false)

        await supabase
            .from("articles")
            .update({
            metadata: {
                ...metaData,
                customFields: updatedFields,
            },
            })
            .eq("article_id", article_id)
    }

    const handleDeleteField = async (fieldId) => {
        if (!window.confirm("Delete this field?")) return;

        const updatedFields = customFields.filter(
            (field) => field.id !== fieldId
        )

        setCustomFields(updatedFields)

        if (updatedFields.length === 0) {
            setActiveTab("content");
        }

        const { error } = await supabase
            .from("articles")
            .update({
            metadata: {
                ...metaData,
                customFields: updatedFields,
            },
            })
            .eq("article_id", article_id)

        if (error) {
            console.error("Failed to delete field:", error)
            alert("Error deleting field")
        }
    }

    return (
        <div className="m-0 p-0 w-screen h-screen overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans flex">
            {/* View Button */}
            <div className="fixed top-5 right-5 z-20 bg-erie rounded-full">
                    <RK_Icon icon={isViewing ? "pencil" : "binoculars"} size="sm" color="duskyBlue" onClick={() => setIsViewing(isViewing ? false : true)}></RK_Icon>
            </div>
            {/* Side Menu */}
            <SideMenu />
            {/* Main Page */}
            <div className="m-0 p-0 relative flex-1 overflow-y-auto">
                {/* Background Image - TODO: Add logic to switch this out. */}
                <img src="/src/assets/Snowy Mountain.jpg"
                        alt="Realm Keeper Logo"
                        className="m-0 p-0 h-100 w-full absolute inset-0" //  object-cover for no distortion
                />
                <div className="m-0 p-0 flex flex-col relative z-10">
                    {/* Title Box */}
                    <div className="flex items-center gap-2 mt-10 mb-10 p-10 bg-erie max-w-fit">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                {/* Article Icon - TODO: Add logic to update on click or based on article type */}
                                <div className="shrink-0">
                                    <RK_Icon size="md" color="duskyBlue" /*onClick={() => {}}*/ />
                                </div>
                                {/* Title */}
                                <div className="relative overflow-hidden">
                                    {/* Measurement span */}
                                    <span
                                        ref={measureRef}
                                        className="
                                            absolute invisible whitespace-nowrap
                                            text-[3em]/normal font-medium
                                            max-w-300 m-0
                                        "
                                        >
                                        {title || " "}
                                        &nbsp;
                                    </span>
                                    {isEditingTitle ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={title}
                                            autoFocus
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                isSaved ? setIsSaved(false) : null;
                                            }}
                                            onBlur={() => setIsEditingTitle(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === "Escape") {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            className="text-[3em]/normal font-medium bg-transparent border-none m-0 p-0 focus:outline-none"
                                        />
                                    ) :
                                        <h1 
                                            className={`text-[3em]/normal! m-0 font-medium cursor-pointer max-w-300 whitespace-nowrap
                                                        ${title ? "" : "opacity-80"}`}
                                            onClick={() => setIsEditingTitle(true)}
                                        >{title ? title : "Title"}</h1>
                                    }
                                </div>
                            </div>
                            {/* Article Type - TODO: Clean up dropdown to match base text (or vice versa) */}
                            <div className="flex items-center gap-1">
                                <p className="ms-4 text-sm text-gray-400">Type:</p>

                                {isEditingType ? (
                                    <Select.Root
                                        value={type}
                                        onValueChange={(value) => {
                                            setType(value);
                                            isSaved ? setIsSaved(false) : null;
                                        }}
                                        onOpenChange={(open) => {
                                            if (!open) setIsEditingType(false);
                                        }}
                                        // className="m-0 p-0"
                                    >
                                    <Select.Trigger
                                        autoFocus
                                        className="
                                        inline-flex items-center gap-1
                                        text-sm text-gray-400 leading-none
                                        bg-erie p-0 m-0
                                        border-none shadow-none
                                        focus:outline-none focus:ring-0 focus-visible:outline-none
                                        appearance-none cursor-pointer
                                        "
                                        // onBlur={() => setIsEditingType(false)}
                                    >
                                        <Select.Value placeholder="Type" />
                                        <Select.Icon className="opacity-60">
                                        <ChevronDown size={14} />
                                        </Select.Icon>
                                    </Select.Trigger>

                                    <Select.Portal>
                                        <Select.Content
                                        sideOffset={4}
                                        className="
                                            z-50
                                            bg-abbey
                                            rounded
                                            shadow-lg
                                            max-h-56
                                            overflow-hidden
                                            scrollbar-thin
                                            scrollbar-thumb-gray-600
                                            scrollbar-track-gray-800
                                            data-[state=open]:animate-in
                                            data-[state=closed]:animate-out
                                            data-[state=open]:fade-in
                                            data-[state=open]:zoom-in-95
                                        " //overflow-y-auto : max-h-60
                                        >
                                        <Select.Viewport className="p-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrolbar-track-gray-800">
                                            {articleTypes.map((t) => (
                                                <Select.Item
                                                    key={t}
                                                    value={t}
                                                    className="
                                                        px-2 py-1
                                                        text-sm text-gray-200
                                                        rounded
                                                        cursor-pointer
                                                        outline-none
                                                        data-highlighted:bg-gray-700
                                                        data-[state=checked]:bg-gray-600
                                                        "
                                                >
                                                    <Select.ItemText>{t}</Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Viewport>
                                        </Select.Content>
                                    </Select.Portal>
                                    </Select.Root>
                                ) : (
                                    <p
                                    className="text-sm text-gray-400 cursor-pointer"
                                    onClick={() => setIsEditingType(true)}
                                    >
                                    &nbsp;{type}
                                    </p>
                                )}
                                </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="pt-25 m-10">
                        <div className="flex border-b border-gray-600 place-content-center gap-200">
                            {["content", "custom"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        activeTab === "content" && tab === "custom" && customFields.length === 0 && setIsModalOpen(true);
                                    }}
                                    className={`px-4 py-2 text-sm font-medium bg-gunmetal
                                        ${activeTab === tab
                                        ? "border-b-2 border-dusky-blue text-white"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                    <div className="flex gap-2">
                                        {tab === "content" ? "Content" : "Custom Fields"}
                                        {activeTab === "content" && tab === "custom" && customFields.length === 0 &&
                                            <span className="bg-[#EAAC59] text-black px-1.5 py-0.5 rounded-full text-sm flex items-center">
                                                <FiPlus size={14} />
                                            </span>
                                        }
                                    </div>
                                </button>
                            ))}
                        </div>
                        {/* Article Body - TODO: Add formatting options */}
                        {activeTab === "content" && (
                            <div className="p-4">
                                {isViewing ? <p className="p-2 rounded w-full bg-slate min-h-75">{body}</p>
                                : <textarea value={body}
                                    onChange={(e) => {
                                        setBody(e.target.value);
                                        isSaved ? setIsSaved(false) : null;
                                    }}
                                    className="border p-2 rounded w-full bg-slate min-h-75"
                                />
                                }
                                <div className="flex grow gap-2 mt-4">
                                    {/* Save, Delete, and Return to Dashboard Buttons*/}
                                    <RK_Button onClick={handleSave}
                                        disabled={isSaved ? true : false}
                                    >Save</RK_Button>
                                    <RK_Button type="accent" onClick={handleDelete}>
                                        Delete
                                    </RK_Button>
                                    <RK_Button onClick={() => navigate("/")}>
                                        Return to Dashboard
                                    </RK_Button>
                                </div>
                            </div>
                        )}
                        {/* Custom Fields */}
                        {activeTab === "custom" && (
                            <div className="p-4 space-y-4">
                                {customFields.length === 0 ? (
                                    null
                                // <button
                                //     onClick={() => setIsModalOpen(true)}
                                //     className="px-4 py-2 bg-dusky-blue text-white rounded hover:opacity-90"
                                // >
                                //     + Add Custom Field
                                // </button>
                                ) : (
                                <>
                                    <div className="space-y-2">
                                    {customFields.map(field => (
                                        <div key={field.id} className="bg-gray-800 p-3 rounded flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">{field.label}</p>
                                                <p>{field.value}</p>
                                            </div>
                                            <RK_Icon icon="trash" size="sm" color="gray400" className="mt-1 shrink-0" onClick={() => handleDeleteField(field.id)}></RK_Icon>
                                        </div>
                                    ))}
                                    </div>

                                    <RK_Button onClick={() => setIsModalOpen(true)}>
                                        + Add another field
                                    </RK_Button>
                                </>
                                )}
                            </div>
                        )}
                        {/* Popup to add Custom Field */}
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-[#1f2933] p-6 rounded w-96 space-y-4">
                                <h3 className="text-lg font-semibold">Add Custom Field</h3>

                                <input
                                    placeholder="Field name"
                                    className="w-full bg-gray-800 p-2 rounded outline-none border border-gray-400"
                                    value={newLabel}
                                    onChange={e => setNewLabel(e.target.value)}
                                />

                                <textarea
                                    placeholder="Field value"
                                    className="w-full bg-gray-800 p-2 rounded outline-none border border-gray-400"
                                    value={newValue}
                                    onChange={e => setNewValue(e.target.value)}
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setNewLabel("");
                                        setNewValue("");
                                    }}
                                    className="text-gray-400"
                                    >
                                    Cancel
                                    </button>
                                    <button
                                        onClick={(
                                            handleAddField
                                        )}
                                        className="bg-dusky-blue px-4 py-2 rounded"
                                    >
                                    Add
                                    </button>
                                </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleScreen;