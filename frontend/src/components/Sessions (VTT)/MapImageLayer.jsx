import { useRef } from "react";
import Asset from "./Asset";
import screenToWorld from "../../utils/screenToWorld.js";

export default function MapImageLayer({ 
  // maps, setMaps,
  assets, setAssets,
  interactionState, setInteractionState,
  camera, gridSize,
  setContextMenu,
  // toggleSnapToGrid,
  // activeLayer, selectedId, setSelectedId, 
  }) {

  const dragging = useRef(null);
  // const last = useRef({ x: 0, y: 0 });
  const resizing = useRef(null); /*{id, corner}*/

  function snapToGrid(value) {
    return Math.round(value / gridSize) * gridSize;
  }

  function onMouseDownBackground() {
    setInteractionState((s) => ({
        ...s,
        selected: null,
    }));

    // dragging.current = id;
    // last.current = { x: e.clientX, y: e.clientY };
    // e.stopPropagation();
  }

  function onMouseMove(e) {
    if (dragging.current || resizing.current) {
      e.stopPropagation()

      const pos = screenToWorld(e, camera);

      if (resizing.current) {

        const r = resizing.current;
        const newWidth  = Math.max(50, r.origWidth  + (pos.x - r.startX));
        const newHeight = Math.max(50, r.origHeight + (pos.y - r.startY));

          // setMaps((imgs) =>
          // imgs.map((img) =>
          //     img.id === resizing.current?.id
          //     ? {
          //         ...img,
          //         width: newWidth,
          //         height: newHeight,
          //     }
          //     : img
          // )
        // )

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
        )
      };

      if (dragging.current) {

        const d = dragging.current;
        const newX = d.origX + (pos.x - d.startX);
        const newY = d.origY + (pos.y - d.startY);

          // setMaps((imgs) =>
          // imgs.map((img) =>
          //     img.id === dragging.current?.id
          //     ? { 
          //       ...img, 
          //       x: newX,
          //       y: newY,
          //     }
          //     : img
          // )

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
        )
      };
    };
  };

  function onMouseUp() {
    if (dragging.current) {
      const draggedId = dragging.current.id;
      dragging.current = null;

      // setMaps((imgs) =>
      //   imgs.map((img) => {
      //     if (img.id !== draggedId) return img;
      //     if (!img.snapToGrid) return {
      //       ...img,
      //       x: img.x,
      //       y: img.y,
      //     }

      //     return {
      //       ...img,
      //       x: snapToGrid(img.x),
      //       y: snapToGrid(img.y),
      //     }
      //   })
      // )

      setAssets((assets) =>
        assets.map((asset) => {
          if (asset.id !== draggedId) return asset;
          if (!asset.snapToGrid) return {
            ...asset,
            x: asset.x,
            y: asset.y,
          }

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
      resizing.current = null;

      // setMaps((imgs) =>
      //   imgs.map((img) => {
      //     if (img.id !== resizedId) return img;
      //     if (!img.snapToGrid) return {
      //       ...img,
      //       width: Math.max(gridSize, img.width),
      //       height: Math.max(gridSize, img.height),
      //     }

      //     return {
      //       ...img,
      //       width: Math.max(gridSize, snapToGrid(img.width)),
      //       height: Math.max(gridSize, snapToGrid(img.height)),
      //     }
      //   })
      // )

      setAssets((assets) =>
        assets.map((asset) => {
          if (asset.id !== resizedId) return asset;
          if (!asset.snapToGrid) return {
            ...asset,
            width: Math.max(gridSize, asset.width),
            height: Math.max(gridSize, asset.height),
          }

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
        {assets.map((asset) => (
          asset.layer === "map" && <Asset
            key={asset.id}
            asset={asset}
            interactionState={interactionState}
            setInteractionState={setInteractionState}
            // activeLayer={activeLaye selectedId={selectedId} setSelectedId={setSelectedId}
            dragging={dragging}
            resizing={resizing}
            // last={last}
            camera={camera}
            // toggleSnapToGrid={toggleSnapToGrid}
            setAssets={setAssets}
            setContextMenu={setContextMenu}
          />
        ))}
    </div>
  );
}
