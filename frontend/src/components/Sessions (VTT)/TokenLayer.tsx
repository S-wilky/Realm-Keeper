import React, { useRef } from "react";
import Asset from "./Asset";
import screenToWorld from "../../utils/screenToWorld";

interface AssetType {
    id: string;
    layer: "map" | "token";
    x: number;
    y: number;
    width: number;
    height: number;
    snapToGrid: boolean;
}

interface InteractionState {
    activeLayer: "map" | "token";
    selected: {
        id: string;
        layer: "map" | "token";
    } | null;
    mode: string;
}

interface Camera {
    x: number;
    y: number;
    zoom: number;
}

interface ContextMenu {
    x: number;
    y: number;
    assetId: string;
    snapToGrid: boolean;
    layer: "map" | "token";
}

interface DragState {
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
}

interface ResizeState {
    id: string;
    startX: number;
    startY: number;
    origWidth: number;
    origHeight: number;
    origX: number;
    origY: number;
    vertical: string;
    horizontal: string;
}

interface TokenLayerProps {
    assets: AssetType[];
    setAssets: React.Dispatch<React.SetStateAction<AssetType[]>>;
    interactionState: InteractionState;
    setInteractionState: React.Dispatch<React.SetStateAction<InteractionState>>;
    camera: Camera;
    gridSize: number;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenu | null>>;
}

export default function TokenLayer({
    assets,
    setAssets,
    interactionState,
    setInteractionState,
    camera,
    gridSize,
    setContextMenu,
}: TokenLayerProps) {
    const dragging = useRef<DragState | null>(null);
    const resizing = useRef<ResizeState | null>(null);
    const last = useRef({ x: 0, y: 0 });

    function snapToGrid(value: number): number {
        return Math.round(value / gridSize) * gridSize;
    }

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (dragging.current || resizing.current) {
            e.stopPropagation();

            const pos = screenToWorld(e, camera);

            if (resizing.current) {
                const r = resizing.current;
                let newWidth = 0;
                let newHeight = 0;
                let newX = 0;
                let newY = 0;

                if (r.horizontal === "l") {
                    newWidth = Math.max(50, r.origWidth - (pos.x - r.startX));
                    newX = Math.min(r.origX, r.origX + (pos.x - r.startX));
                }
                if (r.horizontal === "r") {
                    newWidth = Math.max(50, r.origWidth + (pos.x - r.startX));
                }
                if (r.vertical === "t") {
                    newHeight = Math.max(50, r.origHeight - (pos.y - r.startY));
                    newY = Math.min(r.origY, r.origY + (pos.y - r.startY));
                }
                if (r.vertical === "b") {
                    newHeight = Math.max(50, r.origHeight + (pos.y - r.startY));
                }

                setAssets((assets) =>
                    assets.map((asset) =>
                        asset.id === r.id
                            ? {
                                ...asset,
                                width: newWidth,
                                height: newHeight,
                                x: newX === 0 ? asset.x : newX,
                                y: newY === 0 ? asset.y : newY,
                            }
                            : asset
                        )
                    );
                }

                if (dragging.current) {
                    const d = dragging.current;
                    const newX = d.origX + (pos.x - d.startX);
                    const newY = d.origY + (pos.y - d.startY);

                    setAssets((assets) =>
                        assets.map((asset) =>
                            asset.id === d.id
                                ? {
                                    ...asset,
                                    x: newX,
                                    y: newY,
                                }
                                : asset
                            )
                        );
                    }
        }
    }

    function onMouseUp() {
        if (dragging.current) {
            const draggedId = dragging.current.id;

            setAssets((assets) =>
                assets.map((asset) => {
                    if (asset.id !== draggedId) return asset;
                    if (!asset.snapToGrid) return asset;
                
                    return {
                        ...asset,
                        x: snapToGrid(asset.x),
                        y: snapToGrid(asset.y),
                    };
                })
            );
        }

        if (resizing.current) {
            const resizedId = resizing.current.id;

            setAssets((assets) =>
                assets.map((asset) => {
                    if (asset.id !== resizedId) return asset;
                    if (!asset.snapToGrid) return asset;

                    return {
                        ...asset,
                        width: Math.max(gridSize, snapToGrid(asset.width)),
                        height: Math.max(gridSize, snapToGrid(asset.height)),
                    };
                })
            );
        }

        dragging.current = null;
        resizing.current = null;
    }

    function onBackgroundMouseDown() {
        setInteractionState((s) => ({
            ...s,
            selected: null,
            mode: "idle",
        }));
    }

    return (
        <div
            className={`absolute inset-0 ${
                interactionState.activeLayer === "token"
                    ? "pointer-events-auto"
                    : "pointer-events-none"
            }`}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseDown={onBackgroundMouseDown}
        >
            {assets.map(
                (asset) =>
                    asset.layer === "token" && (
                        <Asset
                            key={asset.id}
                            asset={asset}
                            interactionState={interactionState}
                            setInteractionState={setInteractionState}
                            dragging={dragging}
                            resizing={resizing}
                            camera={camera}
                            setContextMenu={setContextMenu}
                        />
                    )
            )}
        </div>
    );
}