import { create } from "zustand";

import { DashboardSection } from "@/types/base";

interface DashboardViewStore {
  views: {
    id: string;
    visualization?: Visualization;
    llmConfig?: {
      llmType: "imitate" | "generate";
      prompt: string;
    };
    type: SectionType;
    content?: string;
  }[];
  addView: (section: DashboardSection) => void;
  removeView: (id: string) => void;
  updateView: (id: string, view: Partial<DashboardSection>) => void;
}

interface DashboardNameStore {
  names: {
    id: string;
    name: string;
  }[];
  addName: (section: DashboardSection) => void;
  removeName: (id: string) => void;
  updateName: (id: string, name: string) => void;
}

// 统一操作接口
interface DashboardOperation {
  sections: DashboardSection[]; // Add sections getter
  add: (section: DashboardSection) => void;
  remove: (id: string) => void;
  update: (id: string, section: Partial<DashboardSection>) => void;
}

export const useDashboardView = create<DashboardViewStore>((set) => ({
  views: [],
  addView: (section) =>
    set((state) => ({
      views: [
        ...state.views,
        {
          id: section.id,
          visualization: section.visualization,
          llmConfig: section.llmConfig,
          type: section.type,
          content: section.content,
        },
      ],
    })),
  removeView: (id) =>
    set((state) => ({
      views: state.views.filter((v) => v.id !== id),
    })),
  updateView: (id, section) =>
    set((state) => ({
      views: state.views.map((v) => (v.id === id ? { ...v, ...section } : v)),
    })),
}));

export const useDashboardName = create<DashboardNameStore>((set) => ({
  names: [],
  addName: (section) =>
    set((state) => ({
      names: [
        ...state.names,
        {
          id: section.id,
          name: section.name,
        },
      ],
    })),
  removeName: (id) =>
    set((state) => ({
      names: state.names.filter((n) => n.id !== id),
    })),
  updateName: (id, name) =>
    set((state) => ({
      names: state.names.map((n) => (n.id === id ? { ...n, name } : n)),
    })),
}));

export const createDashboardSection = (
  overrides?: Partial<DashboardSection>
): DashboardSection => {
  const defaultSection: DashboardSection = {
    id: crypto.randomUUID(),
    type: "chart",
    name: "New Section",
    // ... 其他默认值
  };

  return {
    ...defaultSection,
    ...overrides,
  };
};

// 统一操作函数
export const useDashboardOperations = (): DashboardOperation => {
  const { views, addView, removeView, updateView } = useDashboardView();
  const { names, addName, removeName, updateName } = useDashboardName();

  return {
    sections: views.map((view) => {
      const nameObj = names.find((n) => n.id === view.id);
      return {
        ...view,
        name: nameObj?.name || "",
      } as DashboardSection;
    }),
    add: (section: DashboardSection) => {
      // 如果包含visualization或llmConfig，需要添加到views
      if (section.visualization || section.llmConfig) {
        addView(section);
      }
      // 所有section都需要添加name
      addName(section);
    },
    remove: (id: string) => {
      // 检查是否存在于views中
      const existInViews = views.some(v => v.id === id);
      if (existInViews) {
        removeView(id);
      }
      // 所有section都需要移除name
      removeName(id);
    },
    update: (id: string, section: Partial<DashboardSection>) => {
      // 检查是否存在于views中
      const existInViews = views.some(v => v.id === id);
      if (existInViews) {
        // 如果section在views中存在，则更新view
        updateView(id, section);
      }
      // 如果更新包含name，则更新name
      if (section.name) {
        updateName(id, section.name);
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
