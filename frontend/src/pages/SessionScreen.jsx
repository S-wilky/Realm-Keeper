//World Screen

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase-client";
import { wholeScreen } from "../styles/tailwindClasses.js"
// import SideMenu from "../components/SideMenu.jsx"
import RK_Icon from "../components/RK_Icon.jsx";
import RK_Button from "../components/RK_Button.jsx";
// import { useMediaQuery } from 'react-responsive';
// import isEmpty from "../utils/isEmpty.js";
import Tooltip from "../components/Tooltip.jsx";
import MapViewport from "../components/Sessions (VTT)/MapViewport.jsx";
import AddMapImageModal from "../components/Sessions (VTT)/AddMapImageModal.jsx";
import AddTokenModal from "../components/Sessions (VTT)/AddTokenModal.jsx";
import fetchUsername from "../utils/fetchUsername.js";

const SessionScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { user_id, session_id, /*stage_id , title: initialTitle, description: initialDescription, onDelete*/ } = state;

    
    // IMPORTANT: refs do NOT trigger re-renders
    const gridXRef = useRef(20);
    const gridYRef = useRef(20);
    const panelRef = useRef(null);
    const chatBottomRef = useRef(null);
    const hasInitializedRef = useRef(false);

    // const [title, setTitle] = useState(initialTitle);
    // const [description, setDescription] = useState(initialDescription);
    // const [isEditing, setIsEditing] = useState(false);
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [height, setHeight] = useState(240);
    const [isDragging, setIsDragging] = useState(false);
    // const [isFullScreen, setIsFullScreen] = useState(false);
    const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(true);
    const [activeTabBM, setActiveTabBM] = useState("chat");
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [username, setUsername] = useState("");
    const [worldX, setWorldX] = useState(1000);
    const [worldY, setWorldY] = useState(800);
    const [gridSize, setGridSize] = useState(50);
    const [stageId, setStageId] = useState(null);
    const [stages, setStages] = useState([]);
    const [editingStageId, setEditingStageId] = useState(null);
    const [stageTitle, setStageTitle] = useState("");
    // const [isStageReady, setIsStageReady] = useState(null);

    const [showMapModal, setShowMapModal] = useState(false);
    const [maps, setMaps] = useState([]);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokens, setTokens] = useState([]);

    const [interactionState, setInteractionState] = useState({
        activeLayer: "map", // "map" | "token" | "gm" | ...
        selected: { layer: null, id: null },     // { layer, id } | null
        mode: "idle",       // "idle" | "drag" | "resize"
    });

    const [camera, setCamera] = useState({
        x: 200,
        y: 200,
        zoom: 1
    })

    document.title = "Realm Keeper | Session";

    // const isSmallScreen = useMediaQuery({query: '(max-width: 1224px)'})

    // useEffect(() => {
    //     if (!stageId || !isStageReady) return;

    //     loadStage();
    // });

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            const newHeight = window.innerHeight - e.clientY;
            setHeight(Math.min(Math.max(newHeight, 120), 500));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Trigger scroll when messages change

    useEffect(() => {
        if (!user_id) return;

        setUsername(fetchUsername(user_id));
    }, [user_id]);

    const resetActiveStage = useCallback( async (sessionStages) => {
        if (!sessionStages || sessionStages?.length === 0) {
            console.log("No stage to set as active");
            return;
        }

        const { error: sessionStageError } = await supabase
            .from('session_stages')
            .update({is_active: true})
            .eq('session_id', session_id)
            .eq('position', 1)

        if (sessionStageError) {
            console.log(sessionStageError);
            return;
        }

        const { data: activeSessionStage, error: activeSessionStageError } = await supabase
            .from('session_stages')
            .select()
            .eq('session_id', session_id)
            .eq('is_active', true)
            .single()

        if (activeSessionStageError) {
            console.log(activeSessionStageError);
            return;
        } 
            
        // console.log(activeSessionStage);
        
        const { data: activeStage, error: stageError } = await supabase
            .from('stages')
            .select()
            .eq('stage_id', activeSessionStage.stage_id)
            .single()

        if (stageError) {
            console.log(stageError);
            return;
        }

        return activeStage;
    }, [session_id])

    const reorderStages = useCallback( async (sessionStages) => {
        if (!sessionStages || sessionStages.length === 0) {
            console.log("No stage to reorder.");
            return;
        }

        let currentPosition = 1;
        for (const i in sessionStages) {
            const stage = sessionStages[i];
            // console.log("Stage to reaorder: ", stage);
            if (stage.position !== currentPosition) {
                const { error: sessionStageError } = await supabase
                    .from('session_stages')
                    .update({position: currentPosition})
                    .eq('stage_id', stage.stage_id)

                if (sessionStageError) {
                    console.log(sessionStageError);
                    return;
                }
                
                const { error: stageError } = await supabase
                    .from('stages')
                    .update({position: currentPosition})
                    .eq('stage_id', stage.stage_id)

                if (stageError) {
                    console.log(stageError);
                    return;
                }

                // console.log("Setting stage at ", stage.position, " to position ", currentPosition);
                stage.position = currentPosition;
            }

            currentPosition++;
        }

        return sessionStages;
    }, []);
    
    const getStages = useCallback( async () => {
        console.warn("Getting Stages.");
        const { data: sessionStages, error: sessionStageError } = await supabase
            .from('session_stages')
            .select()
            .eq('session_id', session_id)
            .order('position', { ascending: true });

        if (sessionStageError) {
            console.warn(sessionStageError)
            return;
        } 
        // else {
            // console.log("Session Stages Retreived: ", sessionStages);
        // }

        const stageIds = sessionStages.map(s => s.stage_id);

        const { data: stages, error: stagesError } = await supabase
            .from('stages')
            .select()
            .in('stage_id', stageIds)
            .order('position', {ascending: true});

        if (stagesError) {
            console.error(stagesError);
            return;
        } else {
            console.log("Stages Retreived: ", stages);
        }

        setStages(stages);

        return sessionStages;
    }, [session_id]);

    // const getActiveStage = useCallback( (sessionStages) => {

    //     console.log("Active stage id: ", stageId);
    //     const stage = stages.filter((stage) => {return (stage.stage_id == stageId)})[0];
    //     console.log("Active stage: ", stage)
    //     if (!stage) {
    //         console.log("No active stage.");
    //         return null;
    //     }
    //     console.log("Active stage: ", stage)
    //     return stage;
    // }, [stages, stageId]);

    const loadStage = useCallback( async (stage = null, passed_stage_id = null) => {
      if (stage == null && passed_stage_id == null) {
        console.log("No stage passed.");
        return;
      }

      if (stage == null) {
        console.log("Loading stageId: ", passed_stage_id);
        setStageId(passed_stage_id);
        const { data, error } = await supabase
            .from("stages")
            .select()
            .eq("stage_id", passed_stage_id)
            .single();

        if (error) {
            console.error("Failed to load stage", error);
            return;
        }
        stage = data;
      }
      else {
        console.log("Loading Stage: ", stage);
        setStageId(stage.stage_id);
      }

      // Config
      setWorldX(stage.world_width);
      setWorldY(stage.world_height);
      setGridSize(stage.grid_size);

      // Shared state
      setMaps(stage.state?.maps ?? []);
      setTokens(stage.state?.tokens ?? []);

      console.log("Stage Loaded: ", stage);
    }, []);

    const setActiveStage = useCallback( async (stage) => {
        console.log("Setting active stage to: ", stage.title);
        // 1. Clear current active
        await supabase
            .from('session_stages')
            .update({ is_active: false })
            .eq('session_id', session_id);

        // 2. Set new active
        await supabase
            .from('session_stages')
            .update({ is_active: true })
            .eq('session_id', session_id)
            .eq('stage_id', stage.stage_id);

        
        loadStage(stage);
        getStages();
    }, [session_id, loadStage, getStages]);

    const createStage = useCallback( async () => {
        if (!stages) {
            console.log("No stages to get position from.");
        }
        console.log("Stages: ", stages);

        let nextPosition = 0;
        for (const i in stages) {
            // console.log("Position: ", stages[i].position);
            if (stages[i].position > nextPosition) {
                nextPosition = stages[i].position;
            }
        }
        nextPosition++;
        console.log("Next position: ", nextPosition);

        const { data: stage, error } = await supabase
            .from('stages')
            .insert({
            title: 'New Stage',
            world_width: 1200,
            world_height: 1200,
            grid_size: 50,
            position: nextPosition,
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return;
        }

        return stage;
    }, [stages]);

    const attachStageToSession = useCallback( async (stage) => {
      if (!stage) {
        console.log("No stage passed to attach.");
        return;
      }
      const { error: sessionStageError } = await supabase
        .from("session_stages")
        .insert({
          session_id: session_id,
          stage_id: stage.stage_id,
          is_active: false,
          position: stage.position,
        });

      if (sessionStageError) {
        console.error(sessionStageError);
        return;
      }
    }, [session_id]);

    const checkActiveLoadStage = useCallback( async () => {
        let sessionStages = await getStages();
        let activeSessionStage = sessionStages.find(s => s.is_active)

        if (!sessionStages || sessionStages?.length === 0) {
            const newStage = await createStage();
            console.log("No active stage, creating a new one: ", newStage);
            await attachStageToSession(newStage);
            await setActiveStage(newStage);
            return;
        }

        if (!activeSessionStage || activeSessionStage?.length === 0) {
            sessionStages = await reorderStages(sessionStages);
            const activeStage = await resetActiveStage(sessionStages);
            console.log("Active stage reset to stage at position 1: ", activeSessionStage);
            await loadStage(activeStage);
            return;
        }

        console.log("Loading previously active stage: ", activeSessionStage);
        await loadStage(null, activeSessionStage.stage_id);
    }, [getStages, createStage, attachStageToSession, setActiveStage, reorderStages, resetActiveStage, loadStage]);

    // Load active stage or create a new one if none exist
    useEffect(() => {
        //Guard in case useEffect is run multiple times
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        checkActiveLoadStage();

    }, [stageId, checkActiveLoadStage]);

    if (!state) return <p>No session data found.</p>;

    // const handleSave = async () => {
    //     const { error } = await supabase
    //         .from("sessions")
    //         .update({ title, description })
    //         .eq("session_id", session_id);

    //     if (error) {
    //         alert("Error saving session: " + error.message);
    //     } else {
    //         alert("Session saved!");
    //         setIsEditing(false);
    //     }
    // };

    // const handleDelete = async () => {
    //     if (!window.confirm("Are you sure you want to delete this session?")) return;

    //     const { error } = await supabase
    //         .from("sessions")
    //         .delete()
    //         .eq("session_id", session_id);

    //     if (error) {
    //         console.log("Delete error:", error);
    //         alert("Error deleting world: " + error.message);
    //     } else {
    //         alert("Session deleted!");
    //         navigate("/");
    //     }
    // };

    async function handleDeleteStage(stage) {

        const { error: sessionStageDeleteError } = await supabase
            .from('session_stages')
            .delete()
            .eq('stage_id', stage.stage_id)

        if (sessionStageDeleteError) {
            console.error(sessionStageDeleteError);
            return
        }

        const { error: stageDeleteError } = await supabase
            .from('stages')
            .delete()
            .eq('stage_id', stage.stage_id)

        if (stageDeleteError) {
            console.error(stageDeleteError);
            return;
        }

        // Reorder Stages
        let sessionStages = await getStages();
        sessionStages = await reorderStages(sessionStages);

        //If there is no longer an active stage then set it to position 1
        let activeSessionStage = sessionStages.find(s => s.is_active);
        console.log("If null then reset active stage: ", activeSessionStage)
        if (activeSessionStage == null || activeSessionStage?.length === 0) {
            const activeStage = await resetActiveStage(sessionStages);
            await loadStage(activeStage);
        }
        getStages();
    }

    async function handleSendChat() {
        if (!chatInput.trim()) {
            setMessages((prev) => [
                ...prev,
                {sender: "test", text: "Testing Chat."}
            ])
        } else {
            setMessages((prev) => [
                ...prev,
                { sender: username, text: chatInput },])
        }
        setChatInput("")
    };

    const scrollToBottom = () => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const layers = [
        {
            icon: "book", 
            onClick: (s) => setInteractionState({
                ...s,
                activeLayer: "map",
                selected: null,
                mode: "idle",
            }), 
            tooltip: "Map Layer",
            layer: "map",
        }, {
            icon: "pencil", 
            onClick: (s) => setInteractionState({
                ...s,
                activeLayer: "token",
                selected: null,
                mode: "idle",
            }),  
            tooltip: "Token Layer",
            layer: "token",
        }, 
        // {
        //     icon: "connect", 
        //     onClick: (s) => setInteractionState({
        //         ...s,
        //         activeLayer: "gm",
        //         selected: null,
        //         mode: "idle",
        //     }), 
        //     tooltip: "GM Layer",
        //     layer: "gm",
        // },
    ]

    const toolbar = [
        // {icon: "info", onClick: () => console.log("Info"), tooltip: "Info"}, 
        // {icon: "pointer-finger", onClick: () => console.log("pointer"), tooltip: "Ping me now!"},
        {icon: "reset", onClick: () => setCamera({x: 50, y: 50, zoom: 1}), tooltip: "Return to Map"}, 
    ]

    const bottomMenu = [
        {icon: "chat", onClick: () => setActiveTabBM("chat"), tooltip: "Chat"},
        {icon: "binoculars", onClick: () => setActiveTabBM("maps"), tooltip: "Maps"},
        {icon: "connect", onClick: () => setActiveTabBM("stages"), tooltip: "Stages"},
        // {icon: "book", onClick: () => setActiveTabBM("articles"), tooltip: "Articles"},
        {icon: "settings", onClick: () => setActiveTabBM("settings"), tooltip: "Session Settings"},
        {icon: "home", onClick: () => navigate("/"), tooltip: "Return to Dashboard"},
    ]

    return (
        <div className={wholeScreen}>
            {/* Floating Tool Buttons - TODO: Add button to collapse and/or complete toolbar with other options*/}
            <div className="absolute right-5 top-5 z-20 flex flex-col gap-[15px] transform transform-origin">
                {toolbar.map((tool, index) =>  (
                    <Tooltip content={tool.tooltip} side="left" key={index}>
                        <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-erie hover:opacity-80 transition group ">
                            <RK_Icon icon={tool.icon} onClick={tool.onClick} ></RK_Icon>
                        </div>
                    </Tooltip>
                ))}
            </div>
            
            {/* Floating Layer Buttons - TODO: Add button to collapse and/or complete toolbar with other options like custom and lighting*/}
            <div className="absolute left-5 top-5 z-20 flex flex-col gap-[15px] transform transform-origin">
                {layers.map((option, index) =>  (
                    <Tooltip content={option.tooltip} side="right" key={index}>
                        <div className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-erie hover:opacity-80 transition group 
                            ${interactionState.activeLayer === option.layer ? "outline outline-pearl-river" : ""}`}
                        >
                            <RK_Icon icon={option.icon} onClick={option.onClick} ></RK_Icon>
                        </div>
                    </Tooltip>
                ))}
            </div>

            {/* Drop Down Button For Menu */}
            {/* <div className="absolute top-0 z-20 h-6 w-18 bg-erie flex items-center p-1 pt-0 rounded-b-lg text-steel inset-0 mx-auto hover:opacity-80 cursor-pointer" 
            onClick={() => {}}>
                <div className="relative w-fit mx-auto">
                <Tooltip content="Open Top Menu" side="bottom">
                    <div className="flex items-center gap-1">
                        <RK_Icon icon="hamburger"></RK_Icon>
                        <p>Menu</p>
                    </div>
                </Tooltip>
                </div>
            </div> */}

            {/* Main Section */}
            <div className={"m-0 p-0 relative flex-1 overflow-y-auto"}>
                <div className="flex flex-col h-full">
                    {/* <div className="flex flex-row p-0 flex-none">
                    </div> */}
                    {/* Session Area */}
                    <div className="w-full h-full bg-dusky-blue">
                        {/* Viewport */}
                        <div className="flex-1 relative overflow-hidden w-full h-full">
                            <MapViewport camera={camera} setCamera={setCamera}
                                worldX={worldX} worldY={worldY} gridSize={gridSize} setWorldX={setWorldX} setWorldY={setWorldY} setGridSize={setGridSize} 
                                maps={maps} setMaps={setMaps} tokens={tokens} setTokens={setTokens}
                                interactionState={interactionState} setInteractionState={setInteractionState}
                                stageId={stageId} setStageId={setStageId} sessionId={session_id}
                                loadStage={loadStage}
                                // activeLayer={activeLayer} selectedId={selectedId} setSelectedId={setSelectedId} 
                            />

                            {/* Map Modal */}
                            {showMapModal && (
                                <AddMapImageModal
                                userId={user_id}
                                onClose={() => setShowMapModal(false)}
                                onAddImage={(image) => {
                                    setMaps((prev) => [...prev, image]);
                                    setShowMapModal(false);
                                }}
                                />
                            )}

                            {/* Token Modal */}
                            {showTokenModal && (
                                <AddTokenModal
                                userId={user_id}
                                onClose={() => setShowTokenModal(false)}
                                onAddToken={(token) => {
                                    setTokens((prev) => [...prev, token]);
                                    setShowTokenModal(false);
                                }}
                                />
                            )}

                            {/* <img src="/src/assets/Snowy Mountain.jpg"
                                    alt="Realm Keeper Logo"
                                    className="m-0 p-0 h-full w-full" //  object-cover for no distortion
                            /> */}
                        </div>
                        {/* Bottom Menu */}
                        {isBottomMenuOpen && (<div className="flex flex-1 bg-abbey">
                            <div
                                ref={panelRef}
                                style={{ height }}
                                className={`fixed bottom-0 bg-[#1f2933] text-white shadow-lg flex flex-col w-screen left-0`} //${isSmallScreen || isFullScreen ? "w-screen left-0" : "left-25 w-[calc(100vw-6.25rem)]"}
                                >
                                {/* Drag handle */}
                                <div
                                    onMouseDown={() => setIsDragging(true)}
                                    className="h-2 cursor-row-resize bg-gray-600 hover:bg-gray-500 shrink-0"
                                />

                                <div className="flex flex-row w-full h-full">
                                    {/* Section Menu */}
                                    <div className="flex flex-col gap-1 p-2 border-r border-gray-700">
                                        {bottomMenu.map((option, index) =>  (
                                            <div key={index}
                                            className="relative w-10 h-10 flex items-start justify-start rounded-full bg-erie hover:opacity-80 transition group">
                                                <Tooltip content={option.tooltip} side="right">
                                                    <RK_Icon icon={option.icon} onClick={option.onClick} ></RK_Icon>
                                                </Tooltip>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chat content */}
                                    {activeTabBM === "chat" && <div className="flex flex-col w-full h-full">
                                        <div className="flex-1 overflow-y-auto">
                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-gray-600 bg-[#2E3A40] h-full">
                                                {messages.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-2 rounded text-left ${
                                                            msg.sender == username ? "bg-abbey" : "bg-steel"
                                                        }`}
                                                    >
                                                        <span className="font-bold">{msg.sender}: </span>{msg.text}
                                                    </div>  
                                                ))}
                                                {/* {loading && <div className="text-center italic text-gray-400">AI is thinking...</div>*/}
                                                <div ref={chatBottomRef} />
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <div className="flex items-center gap-2 border-t border-gray-700 p-2">
                                            {/* <div className="flex flex-1"> */}
                                                <input
                                                type="text"
                                                value={chatInput}
                                                className="flex-1 bg-gray-800 text-white p-2 rounded outline-none"
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyDown={(e) =>  e.key == "Enter" ? handleSendChat() : null}
                                                placeholder="Type a message..."
                                                />
                                            {/* </div> */}
                                            {/* <div className="w-45"> */}
                                                <RK_Button className="shrink-0" onClick={() => handleSendChat()}>Send</RK_Button>
                                            {/* </div> */}
                                        </div>
                                    </div>}

                                    {/* Maps - TODO: Hook up to supabase storage and add a modal for user storage (uploading/selecting maps/image/tokens).*/}
                                    {activeTabBM === "maps" && <div className="m-3 flex gap-4 h-24">
                                        <RK_Button className="m-3" onClick={() => setShowMapModal(true)}>Select Map</RK_Button>
                                        <RK_Button className="m-3" onClick={() => setShowTokenModal(true)}>Select Token</RK_Button>
                                    </div>}

                                    {/* Stages */}
                                    {activeTabBM === "stages" && <div className="m-3 flex flex-row gap-4 h-28">
                                        {/* <div className=""> */}
                                            <RK_Button size="md"
                                            onClick={async () => {
                                                const newStage = await createStage();
                                                attachStageToSession(newStage);
                                                console.log("New Stage: ", newStage);
                                                setStages(prev => [
                                                    ...prev
                                                    ,newStage
                                                ])
                                                // getStages();
                                            }}>
                                                New Stage
                                            </RK_Button>
                                        {/* </div> */}
                                        {stages.map(( stage ) => ( 
                                            // <div key={stage.stage_id} className="bg-erie" >{stage.title}</div>
                                            <div key={stage.stage_id} className="outline h-28 min-w-34 p-2 rounded-2xl relative flex flex-col gap-1">
                                                <div className="absolute top-0 right-1" >{stage.position}</div>
                                                <div>
                                                {stage.stage_id == editingStageId ? (
                                                    <input 
                                                        type="text" 
                                                        autoFocus
                                                        placeholder={stage.title} 
                                                        className="w-28"
                                                        value={stageTitle}
                                                        onChange={(e) => setStageTitle(e.target.value)}
                                                        onKeyDown={async e => {if (e.key == "Enter") {
                                                            if (stageTitle == "") {
                                                                setEditingStageId(null);
                                                                return;
                                                            }

                                                            const {error} = await supabase
                                                                .from('stages')
                                                                .update({title: stageTitle})
                                                                .eq('stage_id', stage.stage_id);
                                                            
                                                            if (error) {
                                                                console.error(error)
                                                            } else {
                                                                console.log("Title updated for stage ", stage.stage_id);
                                                                console.log("Title: ", stageTitle);
                                                            }
                                                            setEditingStageId(null);
                                                            setStageTitle("");
                                                            getStages();
                                                        } else if (e.key == "Esc") {
                                                            setEditingStageId(null);
                                                        }}}
                                                    ></input>
                                                ) : (
                                                <strong onClick={() => {setEditingStageId(stage.stage_id)}}>{stage.title}</strong>
                                                )}
                                                <div>
                                                    {stage.world_width} x {stage.world_height}
                                                </div>
                                                </div>

                                                <div className="flex items-center">
                                                    {editingStageId == stage.stage_id ? (
                                                        <RK_Button
                                                            type="danger"
                                                            onClick={() => handleDeleteStage(stage)}
                                                        >
                                                            Delete
                                                        </RK_Button>
                                                    ) : (
                                                        stage.stage_id == stageId ? (
                                                        <RK_Button type="accent" >Active</RK_Button>
                                                        ) : (
                                                        <RK_Button
                                                            onClick={async () => {
                                                                await setActiveStage(stage);
                                                                // onStageChanged();
                                                                // onClose();
                                                            }}
                                                        >
                                                            Switch
                                                        </RK_Button>
                                                        )
                                                    )}
                                                    <div className="w-8 h-8">
                                                        <RK_Icon icon="pencil" onClick={async () => {
                                                            if (stageTitle !== "") {
                                                                const {error} = await supabase
                                                                    .from('stages')
                                                                    .update({title: stageTitle})
                                                                    .eq('stage_id', stage.stage_id);
                                                                
                                                                if (error) {
                                                                    console.error(error)
                                                                } else {
                                                                    console.log("Title updated for stage ", stage.stage_id);
                                                                    console.log("Title: ", stageTitle);
                                                                }
                                                                setEditingStageId(null);
                                                                setStageTitle("");
                                                                getStages();
                                                            } else {
                                                                setEditingStageId(editingStageId == stage.stage_id ? null : stage.stage_id)
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}

                                    {/* Articles - TODO: 2 tabs, 1 for all articles and 1 for session articles. Add Folder Structure and draggable article modals.*/}
                                    {/* {activeTabBM === "articles" && <div className="m-3">
                                        <RK_Button className="m-3 ">Select Article</RK_Button>
                                    </div>} */}

                                    {/* Settings */}
                                    {activeTabBM === "settings" && <div className="p-3">
                                        <h4 className="p-2">Grid Size</h4>
                                        <div className="p-2 flex gap-2 items-center">
                                            <p>X</p>
                                            <input ref={gridXRef} placeholder={worldX / gridSize} type="number" max={100} min={0} 
                                            className="border border-steel"></input> 
                                            <p>Y</p>
                                            <input ref={gridYRef} placeholder={worldY / gridSize} type="number" max={100} min={0} 
                                            className="border border-steel"></input> 
                                            <RK_Button onClick={async () => {
                                                // console.log("New Grid Size: ", gridXRef.current.value, " x ", gridYRef.current.value);
                                                // console.log("New World Size: ", gridXRef.current.value * gridSize, " x ", gridYRef.current.value * gridSize);
                                                if (gridXRef.current.value !== null && gridXRef.current.value != 0) {
                                                    setWorldX(gridXRef.current.value * gridSize);
                                                    const { error } = await supabase
                                                        .from('stages')
                                                        .update({world_width: gridXRef.current.value * gridSize})
                                                        .eq('stage_id', stageId)

                                                    if (error) {
                                                        console.error(error);
                                                    } else {
                                                        console.log("Updated X to: ", gridXRef.current.value * gridSize)
                                                    }
                                                } 
                                                if (gridYRef.current.value !== null && gridYRef.current.value != 0) {
                                                    setWorldY(gridYRef.current.value * gridSize);
                                                    const { error } = await supabase
                                                        .from('stages')
                                                        .update({world_height: gridYRef.current.value * gridSize})
                                                        .eq('stage_id', stageId)

                                                    if (error) {
                                                        console.error(error);
                                                    } else {
                                                        console.log("Updated Y to: ", gridYRef.current.value * gridSize)
                                                    }
                                                }
                                                getStages();
                                            }}>Set World Size</RK_Button>
                                        </div>
                                    </div>}

                                    {/* Button for Chat Dropdown */}
                                    <div className="absolute -top-4 z-20 h-6 w-10 bg-erie flex items-center p-1 pb-0 rounded-t-lg text-steel inset-0 mx-auto hover:opacity-80 cursor-pointer" 
                                    onClick={() => setIsBottomMenuOpen(false)}>
                                        <Tooltip content="Close Bottom Menu" side="top">
                                            <RK_Icon icon="hamburger"></RK_Icon>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
                        
            {!isBottomMenuOpen && <div className="absolute bottom-0 z-20 h-6 w-10 bg-erie flex justify-center items-center p-1 pb-0 rounded-t-lg text-steel inset-x-0 mx-auto hover:opacity-80 cursor-pointer" 
            onClick={() => setIsBottomMenuOpen(true)}>
                <Tooltip content="Open Bottom Menu" side="top">
                    <RK_Icon icon="hamburger"></RK_Icon>
                </Tooltip>
            </div>}
        </div>
    );
};

export default SessionScreen;