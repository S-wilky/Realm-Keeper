import { useRef } from "react";
import Asset from "./Asset";
import screenToWorld from "../../utils/screenToWorld.js";

export default function TokenLayer({
  assets, setAssets,
  interactionState, setInteractionState,
  camera, gridSize,
  setContextMenu,
}) {
  const dragging = useRef(null);
  const resizing = useRef(null);
  const last = useRef({ x: 0, y: 0 });

  function snapToGrid(value) {
    return Math.round(value / gridSize) * gridSize;
  }

  function onMouseMove(e) {
    if (dragging.current || resizing.current) {
        e.stopPropagation()

        const pos = screenToWorld(e, camera);

        if (resizing.current) {

            const r = resizing.current;
            let newWidth = 0;
            let newHeight = 0;
            let newX = 0;
            let newY = 0;

            if (r.horizontal == "l") {
              newWidth = Math.max(50, r.origWidth - (pos.x - r.startX));
              newX = Math.min(r.origX, r.origX + (pos.x - r.startX));
            }
            if (r.horizontal == "r") {
              newWidth = Math.max(50, r.origWidth + (pos.x - r.startX));
            }
            if (r.vertical == "t") {
              newHeight = Math.max(50, r.origHeight - (pos.y - r.startY));
              newY = Math.min(r.origY, r.origY + (pos.y - r.startY));
            }
            if (r.vertical == "b") {
              newHeight = Math.max(50, r.origHeight + (pos.y - r.startY));
            }

            setAssets(assets =>
            assets.map(asset =>
                asset?.id === resizing.current?.id
                ? { 
                    ...asset, 
                    width: newWidth,
                    height: newHeight,
                    x: newX == 0 ? asset.x : newX,
                    y: newY == 0 ? asset.y : newY,
                }
                : asset
                )
            )
        };

        if (dragging.current) {

            const d = dragging.current;
            const newX = d.origX + (pos.x - d.startX);
            const newY = d.origY + (pos.y - d.startY);

            setAssets(assets =>
                assets.map(asset =>
                    asset.id === d.id
                    ? { 
                        ...asset, 
                        x: newX, 
                        y: newY, 
                    }
                    : asset
                )
            )
        };
    };
  };

  function onMouseUp() {
    if (dragging.current) {
      const draggedId = dragging.current.id;

      setAssets(assets =>
        assets.map(asset => {
          if (asset.id !== draggedId) return asset;
          if (!asset.snapToGrid) return asset;

          return {
            ...asset,
            x: snapToGrid(asset.x),
            y: snapToGrid(asset.y),
          }
        })
      )
    };

    if (resizing.current) {
      const resizedId = resizing.current.id;

      setAssets(assets =>
        assets.map(asset => {
          if (asset.id !== resizedId) return asset;
          if (!asset.snapToGrid) return asset;

          return {
            ...asset,
            width: Math.max(gridSize, snapToGrid(asset.width)),
            height: Math.max(gridSize, snapToGrid(asset.height)),
          }
        })
      )
    };

    dragging.current = null;
    resizing.current = null;
  }

  function onBackgroundMouseDown() {
    setInteractionState((s) => ({
        ...s,
        selected: null,
        mode: "idle",
    }))
  };

  return (
    <div
      className={`absolute inset-0 ${interactionState.activeLayer === "token" ? "pointer-events-auto" : "pointer-events-none"}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseDown={onBackgroundMouseDown}
    >
      {assets.map(asset => (
        asset.layer === "token" && <Asset 
            key={asset.id}
            asset={asset} 
            interactionState={interactionState}
            setInteractionState={setInteractionState}
            dragging={dragging}
            resizing={resizing}
            last={last}
            camera={camera}
            setAssets={setAssets}
            setContextMenu={setContextMenu}
        />
      ))}
    </div>
  );
}
