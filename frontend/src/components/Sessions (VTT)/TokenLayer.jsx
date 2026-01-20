import { useRef } from "react";
import Token from "./Token";

export default function TokenLayer({
  tokens, setTokens, gridSize,
  interactionState, setInteractionState
//   activeLayer, selectedId, setSelectedId,
}) {
  const dragging = useRef(null);
  const resizing = useRef(null);
  const last = useRef({ x: 0, y: 0 });

  function snapToGrid(value) {
    return Math.round(value / gridSize) * gridSize;
  }

//   function onMouseDown() {
    // if (interactionState.activeLayer !== "token") return;

    // dragging.current = id;
    // last.current = { x: e.clientX, y: e.clientY };

    // setInteractionState((s) => ({
    //     ...s,
    //     selected: { layer: "map", id: id },
    //     mode: "drag",
    // }));

    // e.stopPropagation();
//   }

  function onMouseMove(e) {
    if (dragging.current || resizing.current) {
        e.stopPropagation()

        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;

        if (resizing.current) {
            setTokens(tokens =>
            tokens.map(token =>
                token.id === resizing.current
                ? { 
                    ...token, 
                    width: Math.max(gridSize, token.width + dx), 
                    height: Math.max(gridSize, token.height + dy), 
                }
                : token
                )
            );

            // last.current = { x: e.clientX, y: e.clientY };
            // return
        }

        if (dragging.current) {
            setTokens(tokens =>
                tokens.map(token =>
                    token.id === dragging.current
                    ? { 
                        ...token, 
                        x: token.x + dx, 
                        y: token.y + dy 
                    }
                    : token
                )
            );

            // last.current = { x: e.clientX, y: e.clientY };
            // return
        }

        last.current = { x: e.clientX, y: e.clientY };
    }
  }

  function onMouseUp() {
    if (dragging.current) {
      const draggedId = dragging.current;

      setTokens(tokens =>
        tokens.map(token => {
          if (token.id !== draggedId) return token;
          if (!token.snapToGrid) return token;

          return {
            ...token,
            x: snapToGrid(token.x),
            y: snapToGrid(token.y),
          };
        })
      );
    }

    if (resizing.current) {
      const resizedId = resizing.current;

      setTokens(tokens =>
        tokens.map(token => {
          if (token.id !== resizedId) return token;
          if (!token.snapToGrid) return token;

          return {
            ...token,
            width: Math.max(gridSize, snapToGrid(token.width)),
            height: Math.max(gridSize, snapToGrid(token.height)),
          };
        })
      );
    }

    dragging.current = null;
    resizing.current = null;
  }

  function onBackgroundMouseDown() {
    setInteractionState((s) => ({
        ...s,
        selected: null,
        mode: "idle",
    }));
  }

  return (
    <div
      className={`absolute inset-0 ${interactionState.activeLayer === "token" ? "pointer-events-auto" : "pointer-events-none"}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseDown={onBackgroundMouseDown}
    >
      {tokens.map(token => (
        <Token 
            key={token.id}
            token={token} 
            interactionState={interactionState}
            setInteractionState={setInteractionState}
            // activeLayer={activeLaye selectedId={selectedId} setSelectedId={setSelectedId}
            dragging={dragging}
            resizing={resizing}
            last={last}
        />
        // <div
        //   key={token.id}
        //   onMouseDown={e => onMouseDown(e, token.id)}
        //   style={{
        //     position: "absolute",
        //     left: token.x,
        //     top: token.y,
        //     width: token.width,
        //     height: token.height,
        //     cursor: interactionState.activeLayer === "token" ? "grab" : "default",
        //     outline:
        //       interactionState.selectedId === token.id
        //         ? "2px solid #60a5fa"
        //         : "none",
        //   }}
        // >
        //   <img
        //     src={token.src}
        //     draggable={false}
        //     style={{
        //       width: "100%",
        //       height: "100%",
        //       pointerEvents: "none",
        //     }}
        //   />
        // </div>
      ))}
    </div>
  );
}
