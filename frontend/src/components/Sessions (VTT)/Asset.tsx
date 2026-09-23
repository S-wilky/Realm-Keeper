import screenToWorld from "../../utils/screenToWorld.js";

export default function Asset({
  asset, 
  dragging, resizing,
  interactionState, setInteractionState,
  camera,
  setContextMenu,
//   setAssets,
}) {

    const isSelectable = (asset.layer === interactionState.activeLayer);
    const isSelected = (asset.id === interactionState.selected?.id);

    function selectDrag(e) {
        if (!isSelectable) return;
        setInteractionState((s) => ({
            ...s,
            selected: {layer: asset.layer, id: asset.id},
            mode: "drag",
        }));

        const pos = screenToWorld(e, camera);

        dragging.current = {
            id: asset.id,
            startX: pos.x,
            startY: pos.y,
            origX: asset.x,
            origY: asset.y,
        };

        e.stopPropagation();
    };

    function startResize(e, vertical, horizontal) {

        const pos = screenToWorld(e, camera);

        resizing.current = {
            id: asset.id,
            startX: pos.x,
            startY: pos.y,
            origWidth: asset.width,
            origHeight: asset.height,
            origX: asset.x,
            origY: asset.y,
            vertical: vertical,
            horizontal: horizontal,
        };

        e.stopPropagation();
    };
    
    function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    const pos = screenToWorld(e, camera);

    setContextMenu({
        x: pos.x,
        y: pos.y,
        assetId: asset.id,
        snapToGrid: asset.snapToGrid,
        layer: asset.layer,
    });
    // console.log("Hello!");
    };

    // function onKeyPress(e) {
    //     // if (interactionState.selected)
    //     console.log(interactionState.selected);
    //     console.log(token.id)
    //     console.log(e.key);
    // }

    return (
        <div>
            <div
            className="group"
            onMouseDown={e => selectDrag(e)}
                    onContextMenu={(e) => handleContextMenu(e)}  //Override right click menu
            //   onKeyDown={e => console.log(e)} //onKeyPress(e)
            style={{
                position: "absolute",
                left: asset.x,
                top: asset.y,
                width: asset.width,
                height: asset.height,
                outline: isSelected ? "2px solid #6366f1" : "none",
                cursor: interactionState.activeLayer === asset.layer ? "grab" : "default",
                // transform: "translateZ(0)",
                pointerEvents: isSelectable ? "auto" : "none",
            }}
            >
                <img
                    src={asset.src}
                    draggable={false}
                    className="pointer-events-none w-full h-full"
                    // style={{
                    // width: "100%",
                    // height: "100%",
                    // pointerEvents: "none",
                    // }}
                />
                {/* Resize handle */}
                {isSelectable && <div
                    onMouseDown={(e) => startResize(e, "t", "l")}
                    className="absolute rounded-full opacity-0 group-hover:opacity-100 -left-1 -top-1 w-2 h-2 bg-blue-400 cursor-se-resize"
                />}
                {isSelectable && <div
                    onMouseDown={(e) => startResize(e, "t", "r")}
                    className="absolute rounded-full opacity-0 group-hover:opacity-100 -right-1 -top-1 w-2 h-2 bg-blue-400 cursor-se-resize"
                />}
                {isSelectable && <div
                    onMouseDown={(e) => startResize(e, "b", "l")}
                    className="absolute rounded-full opacity-0 group-hover:opacity-100 -left-1 -bottom-1 w-2 h-2 bg-blue-400 cursor-se-resize"
                />}
                {isSelectable && <div
                    onMouseDown={(e) => startResize(e, "b", "r")}
                    className="absolute rounded-full opacity-0 group-hover:opacity-100 -right-1 -bottom-1 w-2 h-2 bg-blue-400 cursor-se-resize"
                />}
            </div>
        </div>
    )
}