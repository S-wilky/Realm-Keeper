import GridCanvas from "./GridCanvas";
import MapImageLayer from "./MapImageLayer";
import TokenLayer from "./TokenLayer";
import { useEffect, useCallback, useRef} from "react";
import supabase from "../../services/supabase-client";

export default function MapStage({ 
  camera, stageId, 
  // setStageId, sessionId,
  worldX, worldY, gridSize, 
  // setWorldX, setWorldY, setGridSize,
  maps, setMaps, tokens, setTokens,
  interactionState, setInteractionState,
  // loadStage,
  // activeLayer, selectedId, setSelectedId, 
  }) {
  const saveTimeout = useRef(null);

  const saveStageState = useCallback((stageId) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      const { error } = await supabase
        .from("stages")
        .update({
          state: { maps, tokens },
          updated_at: new Date().toISOString(),
        })
        .eq("stage_id", stageId);

      if (error) {
        console.error(error);
      } else {
        console.log("Stage ", stageId, " updated.");
      }

    }, 500); // 300–700ms is a good range
  }, [maps, tokens]);


  const deleteSelectedObject = useCallback(() => {
    const selected = interactionState.selected;
    if (!selected) return;

    if (selected.layer === "map") {
      setMaps((imgs) => imgs.filter(i => i.id !== selected.id));
    }

    if (selected.layer === "token") {
      setTokens((tokens) => tokens.filter(t => t.id !== selected.id));
    }

    setInteractionState((s) => ({ ...s, selected: null }));
  }, [interactionState.selected, setInteractionState, setMaps, setTokens]);


  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== "Delete" && e.key !== "Backspace") return;

      // Prevent deleting while typing
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) return;

      deleteSelectedObject();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelectedObject]);

  useEffect(() => {
    if (!stageId) return;
    saveStageState(stageId);
  }, [maps, tokens, stageId, saveStageState]);


  return (
    <div
      className="absolute top-0 left-0 origin-top-left"
      style={{
        transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
        width: "5000px",
        height: "5000px"
      }}
    >
      {/* World Background */}
      <div className="bg-steel" 
      style={{
        width: worldX,
        height: worldY,
      }} ></div>
      <div className={`absolute inset-0 z-10 ${interactionState.activeLayer === "map" ? "pointer-events-auto" : "pointer-events-none"}`}>
        <MapImageLayer maps={maps} setMaps={setMaps} gridSize={gridSize} 
          interactionState={interactionState} setInteractionState={setInteractionState}
          // activeLayer={activeLayer} selectedId={selectedId} setSelectedId={setSelectedId} 
        />
      </div>
      <div className="absolute inset-0 z-20 pointer-events-none">
        <GridCanvas WORLD_X={worldX} WORLD_Y={worldY} GRID_SIZE={gridSize} />
      </div>
      <div className={`absolute inset-0 z-20 ${interactionState.activeLayer === "token" ? "pointer-events-auto" : "pointer-events-none"}`}>
        <TokenLayer tokens={tokens} setTokens={setTokens} gridSize={gridSize} 
          interactionState={interactionState} setInteractionState={setInteractionState}
          // activeLayer={activeLayer} selectedId={selectedId} setSelectedId={setSelectedId} 
        />
      </div>
    </div>
  );
}
