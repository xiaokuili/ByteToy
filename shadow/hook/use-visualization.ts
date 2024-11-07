import { create } from 'zustand';

interface VisualizationStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
 
  viewMode: 'table' | 'chart' ;
  setViewMode: (mode: 'table' | 'chart' ) => void;
}

export const useVisualization = create<VisualizationStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  viewMode: 'table',
  setViewMode: (mode) => set({ viewMode: mode }),
}));