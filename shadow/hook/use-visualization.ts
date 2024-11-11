import { create } from "zustand";

interface VisualizationStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  // 添加 AI 视图的参数
  aiParams: {
    type: "imitate" | "generate";
    input: string;
  };
  setAiParams: (params: {
    type: "imitate" | "generate";
    input: string;
  }) => void;
}

export const useVisualization = create<VisualizationStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  viewMode: "table",
  setViewMode: (mode) => set({ viewMode: mode }),
  aiParams: {
    type: "imitate",
    input: "",
  },
  setAiParams: (params) => set({ aiParams: params }),
}));
