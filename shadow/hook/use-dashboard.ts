import { create } from "zustand";

import { DashboardSection } from "@/types/base";
interface DashboardStore {
  sections: DashboardSection[];
  initSection: () => DashboardSection;
  addSection: (section: DashboardSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, section: Partial<DashboardSection>) => void;
}

interface DashboardActiveStore {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const useDashboardActive = create<DashboardActiveStore>((set) => ({
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
}));

export const useDashboard = create<DashboardStore>((set) => ({
  sections: [],
  initSection: () => ({
    id: crypto.randomUUID(),
    name: "新建内容",
    type: "other",
    content: "通过数据源生成内容",
    llmConfig: {
      llmType: "imitate",
      prompt: "",
    },
  }),
  addSection: (section) =>
    set((state) => ({ sections: [...state.sections, section] })),
  removeSection: (id) =>
    set((state) => ({ sections: state.sections.filter((s) => s.id !== id) })),
  updateSection: (id, updatedSection) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, ...updatedSection } : section
      ),
    })),
}));

interface DashboardSettingStore {
  isSettingOpen: boolean;
  blockId: string | null;
  setSettingOpen: (open: boolean, blockId?: string | null) => void;
}

export const useDashboardSetting = create<DashboardSettingStore>((set) => ({
  isSettingOpen: false,
  blockId: null,
  setSettingOpen: (open: boolean, blockId: string | null = null) =>
    set({
      isSettingOpen: open,
      blockId: open ? blockId : null, // When closing, clear the blockId
    }),
}));
