import { create } from "zustand";

interface VisualizationStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  viewMode: "table" | "chart";
  setViewMode: (mode: "table" | "chart") => void;

  showTable: boolean;
  setShowTable: (show: boolean) => void;
}

export const useVisualization = create<VisualizationStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  viewMode: "table",
  setViewMode: (mode) => set({ viewMode: mode }),
  showTable: true,
  setShowTable: (show) => set({ showTable: show }),
}));
