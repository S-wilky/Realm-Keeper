import MapStage from "./MapStage.jsx"
import { useRef } from "react";

export default function MapViewport({ 
  worldX, setWorldX, worldY, setWorldY, gridSize, setGridSize,
  camera, setCamera, 
  // maps, setMaps, tokens, setTokens,
  assets, setAssets,
  interactionState, setInteractionState,
  stageId, setStageId, sessionId,
  // setContextMenu,
  // activeLayer, selectedId, setSelectedId, 
  }) {
  const viewportRef = useRef(null);
  
  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function onMouseDown(e) {
    isPanning.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  function onMouseMove(e) {
    if (!isPanning.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setCamera(c => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy
    }))

    last.current = { x: e.clientX, y: e.clientY };
  };

  function onMouseUp() {
    isPanning.current = false;
  };

  function onWheel(e) {
    // e.preventDefault();

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(4, Math.max(0.25, camera.zoom * zoomFactor));

    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - camera.x) / camera.zoom;
    const worldY = (mouseY - camera.y) / camera.zoom;

    const newX = mouseX - worldX * newZoom;
    const newY = mouseY - worldY * newZoom;

    setCamera({ x: newX, y: newY, zoom: newZoom });
  };


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
      <MapStage camera={camera} 
        worldX={worldX} setWorldX={setWorldX} worldY={worldY} setWorldY={setWorldY} gridSize={gridSize} setGridSize={setGridSize}
        // maps={maps} setMaps={setMaps} tokens={tokens} setTokens={setTokens}
        assets={assets} setAssets={setAssets}
        interactionState={interactionState} setInteractionState={setInteractionState} 
        stageId={stageId} setStageId={setStageId} sessionId={sessionId}
        // setContextMenu={setContextMenu}
        // activeLayer={activeLayer} selectedId={selectedId} setSelectedId={setSelectedId}
      />
    </div>
  );
}
