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

interface MapImageLayerProps {
    assets: AssetType[];
    setAssets: React.Dispatch<React.SetStateAction<AssetType[]>>;
    interactionState: InteractionState;
    setInteractionState: React.Dispatch<
        React.SetStateAction<InteractionState>
    >;
    camera: Camera;
    gridSize: number;
    setContextMenu: React.Dispatch<
        React.SetStateAction<ContextMenu | null>
    >;
}

export default function MapImageLayer({
    assets,
    setAssets,
    interactionState,
    setInteractionState,
    camera,
    gridSize,
    setContextMenu,
}: MapImageLayerProps) {
    const dragging = useRef<DragState | null>(null);
    const resizing = useRef<ResizeState | null>(null);

    function snapToGrid(value: number): number {
        return Math.round(value / gridSize) * gridSize;
    }

    function onMouseDownBackground() {
        setInteractionState((s) => ({
            ...s,
            selected: null,
        }));
    }

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (dragging.current || resizing.current) {
            e.stopPropagation();

            const pos = screenToWorld(e, camera);

            if (resizing.current) {
                const r = resizing.current;
                const newWidth = Math.max(50, r.origWidth + (pos.x - r.startX));
                const newHeight = Math.max(50, r.origHeight + (pos.y - r.startY));

                setAssets((assets) =>
                    assets.map((asset) =>
                        asset.id === resizing.current?.id
                            ? {
                                ...asset,
                                width: newWidth,
                                height: newHeight,
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
                        asset.id === dragging.current?.id
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
            dragging.current = null;

            setAssets((assets) =>
                assets.map((asset) => {
                    if (asset.id !== draggedId) return asset;
                    if (!asset.snapToGrid)
                        return {
                            ...asset,
                            x: asset.x,
                            y: asset.y,
                        };

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
            resizing.current = null;

            setAssets((assets) =>
                assets.map((asset) => {
                    if (asset.id !== resizedId) return asset;
                    if (!asset.snapToGrid)
                        return {
                            ...asset,
                            width: Math.max(gridSize, asset.width),
                            height: Math.max(gridSize, asset.height),
                        };

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

        return (
            <div
                className="absolute inset-0"
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => {
                    // dragging.current = null;
                    // resizing.current = null;
                }}
                onMouseDown={onMouseDownBackground}
            >
                {assets.map(
                    (asset) =>
                        asset.layer === "map" && (
                            <Asset
                                key={asset.id}
                                asset={asset}
                                interactionState={interactionState}
                                setInteractionState={setInteractionState}
                                dragging={dragging}
                                resizing={resizing}
                                camera={camera}
                                // setAssets={setAssets}
                                setContextMenu={setContextMenu}
                            />
                        )
                    )}
            </div>
        );
}