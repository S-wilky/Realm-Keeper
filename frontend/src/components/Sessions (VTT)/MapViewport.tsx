import React, { useRef } from "react";
import MapStage from "./MapStage";

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

interface MapViewportProps {
    worldX: number;
    setWorldX: React.Dispatch<React.SetStateAction<number>>;
    worldY: number;
    setWorldY: React.Dispatch<React.SetStateAction<number>>;
    gridSize: number;
    setGridSize: React.Dispatch<React.SetStateAction<number>>;
    camera: Camera;
    setCamera: React.Dispatch<React.SetStateAction<Camera>>;
    assets: Asset[];
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    interactionState: InteractionState;
    setInteractionState: React.Dispatch<React.SetStateAction<InteractionState>>;
    stageId: string | null;
    setStageId: React.Dispatch<React.SetStateAction<string | null>>;
    sessionId: string | null;
}

export default function MapViewport({
    worldX,
    setWorldX,
    worldY,
    setWorldY,
    gridSize,
    setGridSize,
    camera,
    setCamera,
    assets,
    setAssets,
    interactionState,
    setInteractionState,
    stageId,
    setStageId,
    sessionId,
}: MapViewportProps) {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const isPanning = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        isPanning.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!isPanning.current) return;

        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;

        setCamera((c) => ({
            ...c,
            x: c.x + dx,
            y: c.y + dy,
        }));

        last.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
        isPanning.current = false;
    }

    function onWheel(e: React.WheelEvent<HTMLDivElement>) {
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(4, Math.max(0.25, camera.zoom * zoomFactor));

        if (!viewportRef.current) return;

        const rect = viewportRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldMouseX  = (mouseX - camera.x) / camera.zoom;
        const worldMouseY = (mouseY - camera.y) / camera.zoom;

        const newX = mouseX - worldMouseX * newZoom;
        const newY = mouseY - worldMouseY * newZoom;

        setCamera({ x: newX, y: newY, zoom: newZoom });
    }

    return (
        <div
            ref={viewportRef}
            className="absolute inset-0 bg-abbey"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
        >
            <MapStage
                camera={camera}
                worldX={worldX}
                worldY={worldY}
                gridSize={gridSize}
                assets={assets}
                setAssets={setAssets}
                interactionState={interactionState}
                setInteractionState={setInteractionState}
                stageId={stageId}
            />
        </div>
    );
}