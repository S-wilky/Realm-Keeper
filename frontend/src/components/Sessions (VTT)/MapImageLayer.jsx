import { useRef } from "react";
import MapImage from "./MapImage";

export default function MapImageLayer({ 
  maps, setMaps, gridSize,
  interactionState, setInteractionState
  // activeLayer, selectedId, setSelectedId, 
  }) {

  const dragging = useRef(null);
  const last = useRef({ x: 0, y: 0 });
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
      e.stopPropagation();

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      if (resizing.current) {
          setMaps((imgs) =>
          imgs.map((img) =>
              img.id === resizing.current
              ? {
                  ...img,
                  width: Math.max(gridSize, img.width + dx),
                  height: Math.max(gridSize, img.height + dy),
              }
              : img
          )
          );

          // last.current = { x: e.clientX, y: e.clientY };
          // return;
      }

      if (dragging.current) {
          setMaps((imgs) =>
          imgs.map((img) =>
              img.id === dragging.current
              ? { 
                ...img, 
                x: img.x + dx, 
                y: img.y + dy 
              }
              : img
          )
      )}

      last.current = { x: e.clientX, y: e.clientY };
    }
  }

  function onMouseUp() {
    if (dragging.current) {
      const draggedId = dragging.current;

      setMaps((imgs) =>
        imgs.map((img) => {
          if (img.id !== draggedId) return img;
          if (!img.snapToGrid) return {
            ...img,
            x: img.x,
            y: img.y,
          }

          return {
            ...img,
            x: snapToGrid(img.x),
            y: snapToGrid(img.y),
          };
        })
      );
    }

    

    if (resizing.current) {
      const resizedId = resizing.current;

      setMaps((imgs) =>
        imgs.map((img) => {
          if (img.id !== resizedId) return img;
          if (!img.snapToGrid) return {
            ...img,
            width: Math.max(gridSize, img.width),
            height: Math.max(gridSize, img.height),
          }

          return {
            ...img,
            width: Math.max(gridSize, snapToGrid(img.width)),
            height: Math.max(gridSize, snapToGrid(img.height)),
          };
        })
      );
    }

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
        {maps.map((img) => (
          <MapImage
            key={img.id}
            img={img}
            interactionState={interactionState}
            setInteractionState={setInteractionState}
            // activeLayer={activeLaye selectedId={selectedId} setSelectedId={setSelectedId}
            dragging={dragging}
            resizing={resizing}
            last={last}
          />
        ))}
    </div>
  );
}
