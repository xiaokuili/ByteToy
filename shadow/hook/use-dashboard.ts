import { create } from "zustand";

import { DashboardSection } from "@/types/base";
import { getFinalSql } from "@/utils/variable-utils";
import { executeQuery as executeQueryAction } from "@/lib/datasource-action";
import { views } from "@/components/dashboard/dashboard-factory";
import { useCallback, useMemo, useState, useEffect } from "react";

interface DashboardStore {
  sections: DashboardSection[];
  addSection: (section: DashboardSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, section: Partial<DashboardSection>) => void;
  saveSections: (sections: DashboardSection[]) => Promise<void>;
  loadSections: (id: string) => Promise<DashboardSection[]>;
}

// Mock database functions
const saveSectionsToDatabase = async (sections: DashboardSection[]) => {
  // TODO: Implement actual database save
  console.log('Saving sections to database:', sections);
};

const loadSectionsFromDatabase = async (id: string): Promise<DashboardSection[]> => {
  // TODO: Implement actual database load
  console.log('Loading sections from database:', id);
  return [];
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
  saveSections: async (sections) => {
    await saveSectionsToDatabase(sections);
  },
  loadSections: async (id: string) => {
    const sections = await loadSectionsFromDatabase(id);
    set({ sections });
    return sections;
  },
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
        
        if (!mounted) return;

        if (!processedResult || !processedResult.isValid || 
            (view.processor.validateData && !view.processor.validateData(processedResult.data).isValid)) {
          setStatus('empty');
          setData(null);
          return;
        }
        console.log(processedResult.data);
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
  const { sections, addSection, removeSection, updateSection , saveSections, loadSections} =
    useDashboardStore();

  const add = useCallback(
    (section: DashboardSection) => {
      addSection(section);
    },
    [addSection]
  );

  const remove = useCallback(
    (id: string) => {
      removeSection(id);
    },
    [removeSection]
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
    saveSections,
    loadSections,
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
