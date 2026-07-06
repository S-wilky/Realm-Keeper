type Camera = {
    x: number;
    y: number;
    zoom: number;
};

type WorldPoint = {
    x: number;
    y: number;
};

export default function screenToWorld(
    e: MouseEvent,
    camera: Camera
): WorldPoint {
    return {
        x:
            (e.clientX - camera.x) /
            camera.zoom,
        y:
            (e.clientY - camera.y) /
            camera.zoom,
    };
}