import { create } from "zustand";

import { DashboardSection } from "@/types/base";
interface DashboardStore {
  views: DashboardSection[];
  names: Record<string, string>;
  addSection: (section: DashboardSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, section: Partial<DashboardSection>) => void;
  updateName: (id: string, name: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  views: [],
  names: {},
  addSection: (section) =>
    set((state) => ({
      views: [...state.views, section],
      names: { ...state.names, [section.id]: "" },
    })),
  removeSection: (id) =>
    set((state) => ({
      views: state.views.filter((view) => view.id !== id),
      names: Object.fromEntries(
        Object.entries(state.names).filter(([key]) => key !== id)
      ),
    })),
  updateSection: (id, section) =>
    set((state) => ({
      views: state.views.map((view) =>
        view.id === id ? { ...view, ...section } : view
      ),
    })),
  updateName: (id, name) =>
    set((state) => ({
      names: { ...state.names, [id]: name },
    })),
}));

export const createDashboardSection = (
  overrides?: Partial<DashboardSection>
): DashboardSection => {
  const defaultSection: DashboardSection = {
    id: crypto.randomUUID(),
    viewId: "",
    sqlContent: "",
    sqlVariables: [],
    databaseId: "",
    viewMode: "",
    isExecuting: true,
  };

  return {
    ...defaultSection,
    ...overrides,
  };
};

export const useDashboardOperations = (): DashboardOperation => {
  const { views, addSection, removeSection, updateSection, updateName } =
    useDashboardStore();

  return {
    sections: views,
    add: (section) => {
      addSection(section);
    },
    remove: (id) => {
      removeSection(id);
    },
    update: (id, section) => {
      if ("name" in section) {
        updateName(id, section.name as string);
      } else {
        updateSection(id, section);
      }
    },
  };
};

interface DashboardActiveStore {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const useDashboardActive = create<DashboardActiveStore>((set) => ({
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
}));
