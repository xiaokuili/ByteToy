import { create } from 'zustand';

interface VisualizationStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  
}

export const useVisualization = create<VisualizationStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
 
}));