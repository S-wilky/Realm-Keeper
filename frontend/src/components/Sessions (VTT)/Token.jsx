

export default function Token({
  token, last,
  dragging, resizing,
  interactionState, setInteractionState
  // activeLayer, selectedId, setSelectedId,
}) {
    const isSelectable = (token.layer === interactionState.activeLayer);
    const isSelected = token.id === interactionState.selected?.id;

    function selectDrag(e) {
        if (!isSelectable) return;
        setInteractionState((s) => ({
            ...s,
            selected: {layer: "token", id: token.id},
            mode: "drag",
        }));
        dragging.current = token.id;
        last.current = { x: e.clientX, y: e.clientY };
        e.stopPropagation();
    }

    function startResize(e) {
        resizing.current = token.id; //{id: token.id }
        last.current = { x: e.clientX, y: e.clientY };
        e.stopPropagation();
    }

    // function onKeyPress(e) {
    //     // if (interactionState.selected)
    //     console.log(interactionState.selected);
    //     console.log(token.id)
    //     console.log(e.key);
    // }

    return (
        <div
          className="group"
          onMouseDown={e => selectDrag(e)}
        //   onKeyDown={e => console.log(e)} //onKeyPress(e)
          style={{
            position: "absolute",
            left: token.x,
            top: token.y,
            width: token.width,
            height: token.height,
            outline: isSelected ? "2px solid #6366f1" : "none",
            cursor: interactionState.activeLayer === "token" ? "grab" : "default",
          }}
        >
            <img
                src={token.src}
                draggable={false}
                style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                }}
            />
            {/* Resize handle */}
            {isSelectable && <div
                onMouseDown={(e) => startResize(e)}
                className="absolute rounded-full opacity-0 group-hover:opacity-100 -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-200 cursor-se-resize"
            />}
        </div>
    )
}