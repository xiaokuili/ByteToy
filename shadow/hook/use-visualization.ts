import { create } from "zustand";

import { Variable } from "@/types/base";
import { getVisualization } from "@/lib/visualization-actions";

interface VisualizationStore {
  viewMode: string;
  setViewMode: (mode: string) => void;
  datasourceId: string;
  setDatasourceId: (id: string) => void;
  sqlContent: string;
  setSqlContent: (sql: string) => void;
  sqlVariables: Variable[];
  setSqlVariables: (variables: Variable[]) => void;
  id: string | null;
  setId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  name: string;
  setName: (name: string) => void;

  // 加载可视化数据的方法
  loadVisualization: (id: string) => Promise<void>;
  // 重置所有状态
  reset: () => void;
}

const initialState = {
  viewMode: "table",
  datasourceId: "",
  sqlContent: "",
  sqlVariables: [],
  id: null,
  isLoading: false,
  name: "",
  error: null,
};
export const useVisualization = create<VisualizationStore>((set) => ({
  ...initialState,

  setViewMode: (mode) => set({ viewMode: mode }),
  setDatasourceId: (id) => set({ datasourceId: id }),
  setSqlContent: (sql) => set({ sqlContent: sql }),
  setSqlVariables: (variables) => set({ sqlVariables: variables }),
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  loadVisualization: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const visualization = await getVisualization(id);
      if (visualization) {
        set({
          id,
          viewMode: visualization.viewMode,
          datasourceId: visualization.datasourceId,
          sqlContent: visualization.sqlContent,
          sqlVariables: visualization.sqlVariables,
          name: visualization.name,
        });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set(initialState),
}));

interface VisualizationOpenStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useVisualizationOpen = create<VisualizationOpenStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
