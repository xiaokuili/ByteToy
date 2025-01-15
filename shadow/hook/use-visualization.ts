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
  setSqlContent: (sql: string) => void;
  setVariables: (variables: Variable[]) => void;
  setDatabaseId: (id: string) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setId: (id: string) => void;
  reset: () => void;
}

interface ViewState {
  viewMode: string;
  id: string;
  setViewMode: (mode: string) => void;
  setId: (id: string) => void;
  reset: () => void;
}

interface CombinedState extends QueryState, ViewState {}

const useCombinedState = create<CombinedState>((set) => ({
  // 控制执行配置
  sqlContent: "",
  variables: [],
  databaseId: "",
  id: "",
  setSqlContent: (sql: string) => set({ sqlContent: sql }),
  setVariables: (variables: Variable[]) => set({ variables }),
  setDatabaseId: (id: string) => set({ databaseId: id }),
  setId: (id: string) => set({ id }),

  // 控制执行状态
  isExecuting: false,
  setIsExecuting: (isExecuting: boolean) => set({ isExecuting }),

  // 控制展示
  viewMode: "table",
  setViewMode: (mode: string) => set({ viewMode: mode }),

  // Combined reset
  reset: () =>
    set({
      sqlContent: "",
      variables: [],
      databaseId: "",
      isExecuting: false,
      id: "",
      viewMode: "table",
    }),
}));

// 包装函数统一管理两个状态
export function useQueryAndViewState() {
  const state = useCombinedState();

  return {
    // Query state
    sqlContent: state.sqlContent,
    variables: state.variables,
    databaseId: state.databaseId,
    isExecuting: state.isExecuting,
    setSqlContent: state.setSqlContent,
    setVariables: state.setVariables,
    setDatabaseId: state.setDatabaseId,
    setIsExecuting: state.setIsExecuting,

    // View state
    viewMode: state.viewMode,
    id: state.id,
    setViewMode: state.setViewMode,
    setId: useCallback((id: string) => {
      state.setId(id);
    }, []),

    // Reset both states
    reset: state.reset,

    // Load visualization data
    loadVisualization: useCallback(async (id: string) => {
      try {
        const visualization = await getVisualization(id);
        if (visualization) {
          state.setSqlContent(visualization.sqlContent);
          state.setVariables(visualization.sqlVariables);
          state.setDatabaseId(visualization.datasourceId);
          state.setViewMode(visualization.viewMode);
          state.setIsExecuting(true);
          state.setId(id);
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
