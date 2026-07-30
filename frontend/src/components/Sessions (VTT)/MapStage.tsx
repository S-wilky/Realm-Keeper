import React, { useEffect, useCallback, useRef, useState } from "react";
import GridCanvas from "./GridCanvas";
import MapImageLayer from "./MapImageLayer";
import TokenLayer from "./TokenLayer";
import supabase from "../../services/supabase-client";
import ContextMenuContent from "./ContextMenuContent";

interface Camera {
    x: number;
    y: number;
    zoom: number;
}

interface Asset {
    id: string;
    layer: "map" | "token";
    snapToGrid: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface InteractionState {
    activeLayer: "map" | "token";
    selected: {
        id: string;
        layer: "map" | "token";
    } | null;
    mode: string;
}

interface ContextMenuState {
    x: number;
    y: number;
    assetId: string;
    snapToGrid: boolean;
    layer: "map" | "token";
}

interface MapStageProps {
    camera: Camera;
    stageId: string | null;
    worldX: number;
    worldY: number;
    gridSize: number;
    assets: Asset[];
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    interactionState: InteractionState;
    setInteractionState: React.Dispatch<
        React.SetStateAction<InteractionState>
    >;
}

export default function MapStage({
    camera,
    stageId,
    worldX,
    worldY,
    gridSize,
    assets,
    setAssets,
    interactionState,
    setInteractionState,
}: MapStageProps) {
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [contextMenu, setContextMenu] =
        useState<ContextMenuState | null>(null);
    
    const saveStageState = useCallback(
        (stageId: string) => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }

            saveTimeout.current = setTimeout(async () => {
                const { error } = await supabase
                    .from("stages")
                    .update({
                        state: { assets },
                        updated_at: new Date().toISOString(),
                    })
                    .eq("stage_id", stageId);

                if (error) {
                    console.error(error);
                } else {
                    console.log("Stage ", stageId, " updated.");
                }
            }, 500);
        },
        [assets]
    );

    const deleteAsset = useCallback(
        (objectId: string | null = null) => {
            let selectedId: string | null = null;

            if (objectId) {
                selectedId = objectId;
            } else {
                selectedId = interactionState.selected?.id ?? null;
            }

            if (!selectedId) return;

            setAssets((assets) => assets.filter((i) => i.id !== selectedId));

            setInteractionState((s) => ({ ...s, selected: null }));
        },
        [interactionState.selected, setInteractionState, setAssets]
    );

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== "Delete" && e.key !== "Backspace") return;

            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA"
            )
                return;

            deleteAsset();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [deleteAsset]);

    useEffect(() => {
        if (!stageId) return;
        saveStageState(stageId);
    }, [assets, stageId, saveStageState]);

    return (
        <div
            className="absolute top-0 left-0 origin-top-left select-none"
            style={{
                transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
                width: "4000px",
                height: "4000px",
            }}
        >
            <div
                className="bg-steel"
                style={{
                    width: worldX,
                    height: worldY,
                }}
            />

            <div
                className={`absolute inset-0 z-10 ${
                    interactionState.activeLayer === "map"
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
            >
                <MapImageLayer
                    gridSize={gridSize}
                    camera={camera}
                    assets={assets}
                    setAssets={setAssets}
                    interactionState={interactionState}
                    setInteractionState={setInteractionState}
                    setContextMenu={setContextMenu}
                />
            </div>

            <div className="absolute inset-0 z-20 pointer-events-none">
                <GridCanvas
                    WORLD_X={worldX}
                    WORLD_Y={worldY}
                    GRID_SIZE={gridSize}
                />
            </div>

            <div
                className={`absolute inset-0 z-30 ${
                    interactionState.activeLayer === "token"
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
            >
                <TokenLayer
                    gridSize={gridSize}
                    camera={camera}
                    assets={assets}
                    setAssets={setAssets}
                    interactionState={interactionState}
                    setInteractionState={setInteractionState}
                    setContextMenu={setContextMenu}
                />
            </div>

            {contextMenu && (
                <div
                    className="fixed inset-0 z-9999"
                    onClick={() => setContextMenu(null)}
                >
                    <div
                        className="absolute bg-dusky-blue text-white rounded-md shadow-lg w-48 py-1"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ContextMenuContent
                            assetId={contextMenu.assetId}
                            snapToGrid={contextMenu.snapToGrid}
                            layer={contextMenu.layer}
                            closeMenu={() => setContextMenu(null)}
                            setAssets={setAssets}
                            setInteractionState={setInteractionState}
                            deleteAsset={deleteAsset}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}