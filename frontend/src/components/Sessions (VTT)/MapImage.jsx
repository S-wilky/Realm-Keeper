// import { useRef } from "react";
import Tooltip from "../Tooltip";

export default function MapImage({
  img, last,
  dragging, resizing,
  interactionState, setInteractionState
  // activeLayer, selectedId, setSelectedId,
}) {
  const isSelectable = (img.layer === interactionState.activeLayer);
  const isSelected = img.id === interactionState.selected?.id;

  function selectDrag(e) {
    if (!isSelectable) return;
    // console.log(img.id)
    // console.log(isSelected)
    setInteractionState((s) => ({
      ...s,
      selected: {layer: "map", id: img.id},
      mode: "drag",
    }));
    dragging.current = img.id;
    last.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  }

  function startResize(e) {
      resizing.current = img.id; //{id: img.id }
      last.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
  }

  return (
    
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
  );
}
