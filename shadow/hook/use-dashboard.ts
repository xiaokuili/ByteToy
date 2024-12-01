"use client";

import { create } from "zustand";

import { DashboardSection,Layout } from "@/types/base";
import { getFinalSql } from "@/utils/variable-utils";
import { executeQuery as executeQueryAction } from "@/lib/datasource-action";
import { views } from "@/components/dashboard/dashboard-factory";
import { useCallback, useMemo, useState, useEffect } from "react";
import { saveDashboard, getDashboard, deleteDashboardSection } from "@/lib/dashboard-action";

interface DashboardStore {
  sections: DashboardSection[];
  addSection: (section: DashboardSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, section: Partial<DashboardSection>) => void;
  saveSections: (sections: DashboardSection[]) => Promise<void>;
  loadSections: (id: string) => Promise<DashboardSection[]>;
  
  layouts: Layout[];
  setLayouts: (layouts: Layout[]) => void;

  save: (id: string) => Promise<void>;
  load: (id: string) => Promise<DashboardSection[]>;
}
// Database functions
const saveSectionsToDatabase = async (dashboardId: string, sections: DashboardSection[], layouts: Layout[]) => {
  try {
    // Save each section as a dashboard record
    await saveDashboard(dashboardId, sections, layouts);
  } catch (error) {
    console.error('Error saving dashboard sections:', error);
    throw error;
  }
};



export const useDashboardStore = create<DashboardStore>((set, get) => ({
  sections: [],
  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    })),
  updateSection: (id, section) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...section } : s
      ),
    })),
  save: async (id: string) => {
    const currentSections = get().sections;
    const currentLayouts = get().layouts;
    await saveSectionsToDatabase(id, currentSections, currentLayouts);
  },
  load: async (id: string) => {
    const response = await getDashboard(id);
    // 确保返回的数据是数组，如果不是则使用空数组
    const sections = Array.isArray(response?.data?.sections) ? response.data.sections : [];
    const layouts = Array.isArray(response?.data?.layouts) ? response.data.layouts : [];
    set({ 
      sections: sections,
      layouts: layouts 
    });
    return { sections, layouts };
  },
  layouts: [],
  setLayouts: (layouts) => set({ layouts }),
}));

export const useDashboardSection = (section: DashboardSection) => {
  const [status, setStatus] = useState<'empty' | 'executing' | 'complete'>('empty');
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      if (!section.sqlContent || !section.databaseId) {
        setStatus('empty');
        return;
      }

      setStatus('executing');
      try {
        const { sqlContent, sqlVariables, databaseId } = section;
        const finalSql = getFinalSql(sqlContent, sqlVariables);
        const result = await executeQueryAction(databaseId, finalSql);
        if (!mounted) return;

        if (!result.success) {
          setStatus('empty'); 
          setData(null);
          return;
        }
        const view = views.get(section.viewMode);
        if (!view || !view.processor.processData) {
          setStatus('empty');
          setData(null);
          return;
        }
        const processed = view.processor.processData(result.data);
        const processedResult = processed instanceof Promise 
          ? await processed
          : processed;
        console.log(processedResult, processedResult.isValid);
        if (!mounted) return;

        if (!processedResult || !processedResult.isValid || 
            (view.processor.validateData && !view.processor.validateData(processedResult.data).isValid)) {
          setStatus('empty');
          setData(null);
          return;
        }
        setStatus('complete');
        setData(processedResult.data);
      } catch (error) {
        if (!mounted) return;
        console.error('Error processing data:', error);
        setStatus('empty');
        setData(null);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [section.sqlContent, section.sqlVariables, section.databaseId, section.viewMode]);

  

  const ViewComponent = useMemo(() => {
    return views.get(section.viewMode);
  }, [section.viewMode]);


  return {
    processedData: data,
    ViewComponent,
    status
  };
};

export const useDashboardOperations = () => {
  const { sections, addSection, removeSection, updateSection , save, load, layouts, setLayouts} =
    useDashboardStore();
// 添加新的 section 时自动创建默认 layout
const add = useCallback(
  (section: DashboardSection) => {
    addSection(section);
    // 为新 section 创建默认 layout
    const currentLayouts = useDashboardStore.getState().layouts;
    const defaultLayout = {
      i: section.id,
      x: (layouts.length * 2) % 12, // 每次右移2格，现在是正确的！
      y: Math.floor(layouts.length / 6), // 每6个换一行
      w: 4, // 改为2格宽（而不是之前的6格宽）
      h: 4, // 高度保持不变
      minW: 4, // 最小宽度也相应调整
      minH: 4,
    };
    setLayouts([...currentLayouts, defaultLayout]);
  },
  [addSection, setLayouts]
);

  // 删除 section 时同时删除对应的 layout
  const remove = useCallback(
    (id: string) => {
      removeSection(id);
      const currentLayouts = useDashboardStore.getState().layouts;
      setLayouts(currentLayouts.filter(layout => layout.i !== id));
    },
    [removeSection, setLayouts]
  );
  // 处理拖拽更新
  const updateLayouts = useCallback(
      (newLayouts: Layout[]) => {
        setLayouts(newLayouts);
      },
      [setLayouts]
  );
  const update = useCallback(
    (id: string, section: Partial<DashboardSection>) => {
      updateSection(id, section);
    },
    [updateSection]
  );


  return {
    sections,
    add,
    remove,
    update,
    save,
    load,
    layouts,
    updateLayouts,
  };
};

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

interface DashboardActiveStore {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const useDashboardActive = create<DashboardActiveStore>((set) => ({
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
}));
