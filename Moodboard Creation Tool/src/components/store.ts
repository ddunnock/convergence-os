import { create } from "zustand";

interface PlacedImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MoodboardStore {
  placedImages: PlacedImage[];
  customImages: string[];
  addPlacedImage: (image: PlacedImage) => void;
  updatePlacedImage: (id: string, updates: Partial<PlacedImage>) => void;
  removePlacedImage: (id: string) => void;
  addCustomImage: (url: string) => void;
}

export const useMoodboardStore = create<MoodboardStore>((set) => ({
  placedImages: [],
  customImages: [],
  addPlacedImage: (image) =>
    set((state) => ({ placedImages: [...state.placedImages, image] })),
  updatePlacedImage: (id, updates) =>
    set((state) => ({
      placedImages: state.placedImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),
  removePlacedImage: (id) =>
    set((state) => ({
      placedImages: state.placedImages.filter((img) => img.id !== id),
    })),
  addCustomImage: (url) =>
    set((state) => ({ customImages: [...state.customImages, url] })),
}));
