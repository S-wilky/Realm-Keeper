import { useState } from "react";
import Tooltip from "../Tooltip.jsx";
import screenToWorld from "../../utils/screenToWorld.js";
import ContextMenuContent from "../Sessions (VTT)/ContextMenuContent.jsx";

export default function MapImage({
  img, 
  // last,
  dragging, resizing,
  interactionState, setInteractionState,
  camera,
  // toggleSnapToGrid, 
  // setMaps
  setAssets
  // setContextMenu,
  // activeLayer, selectedId, setSelectedId,
}) {

  const [contextMenu, setContextMenu] = useState(null);
  const isSelectable = (img.layer === interactionState.activeLayer);
  const isSelected = img.id === interactionState.selected?.id;

  function selectDrag(e) {
    e.preventDefault();
    if (!isSelectable) return;
    // console.log(img.id)
    // console.log(isSelected)
    setInteractionState((s) => ({
      ...s,
      selected: {layer: "map", id: img.id},
      mode: "drag",
    }));

    const pos = screenToWorld(e, camera);

    dragging.current = {
      id: img.id,
      startX: pos.x,
      startY: pos.y,
      origX: img.x,
      origY: img.y,
    };

    e.stopPropagation();
  };

  function startResize(e) {
      e.preventDefault();

      // console.log(e);

      const pos = screenToWorld(e, camera);

      resizing.current = {
        id: img.id,
        startX: pos.x,
        startY: pos.y,
        origWidth: img.width,
        origHeight: img.height,
      };

      e.stopPropagation();
  };

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    // const pos = screenToWorld(e, camera);

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      assetId: img.id,
      snapToGrid: img.snapToGrid,
      layer: img.layer,
    });
    // console.log("Hello!");
  };

  return (
    
    <div>
      <div
        className="group"
        style={{
            position: "absolute",
            width: img.width,
            height: img.height,
            left: img.x,
            top: img.y,
            transform: "translateZ(0)",
            outline: isSelected ? "2px solid #6366f1" : "none",
            pointerEvents: isSelectable ? "auto" : "none",
            // transform: `translate(${img.x}px, ${img.y}px) translateZ(0)`,
        }}
      >
        {/* <Tooltip content="test" side="top"> */}
          <img
              src={img.src}
              draggable={false}
              onMouseDown={(e) => selectDrag(e)}
              onContextMenu={(e) => handleContextMenu(e)}  //Override right click menu
              style={{
                  width: "100%",
                  height: "100%",
                  cursor: isSelectable ? "move" : "default",
                  willChange: "transform",
                  transform: "translateZ(0)"
                  // transform: `translate(${img.x}px, ${img.y}px) translateZ(0)`,
              }}
          />
        {/* </Tooltip> */}
        {/* Resize handle */}
        {isSelectable && <div
            onMouseDown={(e) => startResize(e)}
            className="absolute rounded-full opacity-0 group-hover:opacity-100 -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-200 cursor-se-resize"
        />}
      </div>
      {contextMenu && (
          <div
          className="fixed inset-0 z-50"
          onClick={() => setContextMenu(null)}
          >
            <div
                className="absolute bg-dusky-blue text-white rounded-md shadow-lg w-48 py-1"
                style={{ top: contextMenu?.y, left: contextMenu?.x }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Context Menu Content */}
                <ContextMenuContent
                  assetId={contextMenu?.assetId}
                  snapToGrid={contextMenu?.snapToGrid}
                  layer={contextMenu?.layer}
                  closeMenu={() => setContextMenu(null)}
                  // toggleSnapToGrid={toggleSnapToGrid}
                  // setMaps={setMaps}
                  setAssets={setAssets}
                  setInteractionState={setInteractionState}
                  // className="h-50"
                />
            </div>
          </div>
      )}
      {/* Anything else? */}
    </div>
  );
}
