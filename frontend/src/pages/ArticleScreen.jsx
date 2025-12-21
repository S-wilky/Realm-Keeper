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

const ArticleScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { article_id, title: initialTitle, body: initialBody, type: initialType, /*user_id,*/ world_id } = state;

    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [type, setType] = useState(initialType);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    // const [isEditingBody, setIsEditingBody] = useState(false);
    const [isEditingType, setIsEditingType] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const inputRef = useRef(null);
    const measureRef = useRef(null);

    useEffect(() => {
        if (!isEditingTitle) return;
        if (!inputRef.current || !measureRef.current) return;

        const width = measureRef.current.offsetWidth;
        inputRef.current.style.width = `${width - 13}px`;
    }, [title, isEditingTitle]);
// END REACT HOOK CALLS

    if (!state) return <p>No article data found.</p>;

    const handleSave = async () => {
        const { error } = await supabase
            .from("articles")
            .update({ title, body, type, world_id })
            .eq("article_id", article_id);

        if (error) {
            alert("Error saving article: " + error.message);
        } else {
            setIsSaved(true);
            alert("Article saved!");
            // navigate("/", { replace: true })
        }
    };

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

    return (
        <div className="m-0 p-0 w-screen h-screen overflow-x-hidden bg-[#2C3539] text-[#D9DDDC] font-sans flex">
            {/* View Button */}
            <div className="fixed top-5 right-5 z-20 bg-erie rounded-full">
                    <RK_Icon size="sm" color="duskyBlue" onClick={() => setIsViewing(isViewing ? false : true)}></RK_Icon>
            </div>
            {/* Side Menu */}
            <div className="m-0 p-3 sticky bg-erie flex flex-col items-center top-0 w-25 h-screen">
                <img
                    onClick={() => navigate("/")}
                    src="/src/assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-20 h-20 mb-10 self-center cursor-pointer"
                />
                <RK_Icon size="md" color="duskyBlue" />
                <RK_Icon size="md" color="duskyBlue" />
                <RK_Icon size="md" color="duskyBlue" />
            </div>
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
                                    <RK_Icon size="md" color="duskyBlue" onClick={() => {}} />
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
                            {/* Article Type - TODO: On click, change to dropdown of all article types. Update and return to p on blur. */}
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
                            {/* <div className="flex">
                                <p className="text-sm text-gray-400 mb-2">Type:</p>
                                {isEditingType ? (
                                    <select 
                                        type="select"
                                        value={type}
                                        // autoFocus
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            isSaved ? setIsSaved(false) : null;
                                        }}
                                        onBlur={() => setIsEditingType(false)}
                                        className="text-sm text-gray-400 mb-2" //"border p-2 rounded"
                                        placeholder="Type"
                                    >
                                        <option value="" className="bg-abbey">{type}</option>
                                        {articleTypes.map((type, index) => (
                                            <option key={index} value={type} className="bg-abbey">
                                                {type}
                                            </option>
                                        ))}
                                    </select>) : (
                                    <p className="text-sm text-gray-400 mb-2"
                                        onClick={() => setIsEditingType(true)}
                                    >&nbsp;{type}</p>)
                                }
                            </div> */}
                        </div>
                    </div>
                    <div className="pt-30 m-10">
                        {/* Article Body - TODO: Add "View" button in top right and change to <p> on "view" */}
                        {isViewing ? 
                            <p className="p-2 rounded w-full bg-slate min-h-96"
                            >{body}</p> :
                            <textarea
                                value={body}
                                onChange={(e) => {
                                    setBody(e.target.value);
                                    isSaved ? setIsSaved(false) : null;
                                }}
                                className="border p-2 rounded w-full bg-slate min-h-96"
                            />
                        }
                        {/* {isEditing ? (
                            <div className="flex-col gap-2">
                            </div>
                        ) : (
                            <>
                                <p className="mb-4 whitespace-pre-line">{body}</p>
                            </>
                        )} */}
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
                </div>
            </div>
        </div>
    );
};

export default ArticleScreen;