import { create } from "zustand";

type CameraStore = {
    x: number;
    y: number;
    zoom: number;

    pan: (
        dx: number,
        dy: number
    ) => void;

    setZoom: (
        zoom: number,
        center?: unknown
    ) => void;
};

export const useCameraStore =
    create<CameraStore>((set) => ({
        x: 0,
        y: 0,
        zoom: 1,

        pan: (
            dx: number,
            dy: number
        ) =>
            set((state) => ({
                x: state.x + dx,
                y: state.y + dy,
            })),

        setZoom: (
            zoom: number,
            center?: unknown
        ) =>
            set(() => ({
                zoom,
            })),
    }));