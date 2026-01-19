import { create } from 'zustand';

export const useCameraStore = create(set => ({
  x: 0,
  y: 0,
  zoom: 1,

  pan: (dx, dy) =>
    set(state => ({ x: state.x + dx, y: state.y + dy })),

  setZoom: (zoom, center) =>
    set(state => ({ zoom })),
}));
