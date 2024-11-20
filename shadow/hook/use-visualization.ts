import { create } from "zustand";

import { Variable } from "@/types/base";
import { getVisualization } from "@/lib/visualization-actions";
import { useCallback } from "react";

interface QueryState {
  sqlContent: string;
  variables: Variable[];
  databaseId: string;
  isExecuting: boolean;
  id: string;
}

interface ViewState {
  viewMode: string;
  id: string;
}

const useQueryState = create<QueryState>((set) => ({
  sqlContent: "",
  variables: [],
  databaseId: "",
  isExecuting: false,
  id: "",
  setSqlContent: (sql: string) => set({ sqlContent: sql }),
  setVariables: (variables: Variable[]) => set({ variables }),
  setDatabaseId: (id: string) => set({ databaseId: id }),
  setIsExecuting: (isExecuting: boolean) => set({ isExecuting }),
  setId: (id: string) => set({ id }),
  reset: () =>
    set({
      sqlContent: "",
      variables: [],
      databaseId: "",
      isExecuting: false,
      id: "",
    }),
}));

const useViewState = create<ViewState>((set) => ({
  viewMode: "table",
  id: "",
  setViewMode: (mode: string) => set({ viewMode: mode }),
  setId: (id: string) => set({ id }),
  reset: () => set({ viewMode: "table", id: "" }),
}));

// 包装函数统一管理两个状态
export function useQueryAndViewState() {
  const queryState = useQueryState();
  const viewState = useViewState();

  return {
    // Query state
    sqlContent: queryState.sqlContent,
    variables: queryState.variables,
    databaseId: queryState.databaseId,
    isExecuting: queryState.isExecuting,
    setSqlContent: queryState.setSqlContent,
    setVariables: queryState.setVariables,
    setDatabaseId: queryState.setDatabaseId,
    setIsExecuting: queryState.setIsExecuting,

    // View state
    viewMode: viewState.viewMode,
    id: queryState.id,
    setViewMode: viewState.setViewMode,
    setId: useCallback((id: string) => {
      queryState.setId(id);
      viewState.setId(id);
    }, []),

    // Reset both states
    reset: () => {
      queryState.reset();
      viewState.reset();
    },

    // Load visualization data
    loadVisualization: useCallback(async (id: string) => {
      try {
        const visualization = await getVisualization(id);
        if (visualization) {
          queryState.setSqlContent(visualization.sqlContent);
          queryState.setVariables(visualization.sqlVariables);
          queryState.setDatabaseId(visualization.datasourceId);
          viewState.setViewMode(visualization.viewMode);
          queryState.setIsExecuting(true);
          queryState.setId(id);
          viewState.setId(id);
        }
      } catch (error) {
        console.error("Failed to load visualization:", error);
      }
    }, []),
  };
}

interface VisualizationOpenStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useVisualizationOpen = create<VisualizationOpenStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
