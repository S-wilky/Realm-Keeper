import screenToWorld from "../../utils/screenToWorld.js";
import { useState } from "react";
import ContextMenuContent from "../Sessions (VTT)/ContextMenuContent.jsx";

export default function Token({
  token, 
//   last,
  dragging, resizing,
  interactionState, setInteractionState,
  camera,
  setAssets,
  // activeLayer, selectedId, setSelectedId,
}) {

    const [contextMenu, setContextMenu] = useState(null);
    const isSelectable = (token.layer === interactionState.activeLayer);
    const isSelected = token.id === interactionState.selected?.id;

    function selectDrag(e) {
        if (!isSelectable) return;
        setInteractionState((s) => ({
            ...s,
            selected: {layer: "token", id: token.id},
            mode: "drag",
        }));

        const pos = screenToWorld(e, camera);

        dragging.current = {
            id: token.id,
            startX: pos.x,
            startY: pos.y,
            origX: token.x,
            origY: token.y,
        };

        e.stopPropagation();
    };

    function startResize(e) {

        const pos = screenToWorld(e, camera);

        resizing.current = {
            id: token.id,
            startX: pos.x,
            startY: pos.y,
            origWidth: token.width,
            origHeight: token.height,
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
        assetId: token.id,
        snapToGrid: token.snapToGrid,
        layer: token.layer,
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
        </div>
    )
}