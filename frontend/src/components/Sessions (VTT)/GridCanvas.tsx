import { useEffect, useRef } from "react";

export default function GridCanvas({ WORLD_X, WORLD_Y, GRID_SIZE }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = WORLD_X;
    canvas.height = WORLD_Y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= WORLD_X; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD_Y);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= WORLD_Y; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD_X, y);
      ctx.stroke();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: `${WORLD_X}px`,
        height: `${WORLD_Y}px`,
      }}
    />
  );
}
