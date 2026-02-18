export default function screenToWorld(e, camera) {
  return {
    x: (e.clientX - camera.x) / camera.zoom,
    y: (e.clientY - camera.y) / camera.zoom,
  };
};
