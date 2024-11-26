import { create } from "zustand";

import { DashboardSection } from "@/types/base";
import { getFinalSql } from "@/utils/variable-utils";
import { executeQuery as executeQueryAction } from "@/lib/datasource-action";
import { views } from "@/components/dashboard/dashboard-factory";
import { useCallback, useMemo } from "react";

interface DashboardStore {
  sections: DashboardSection[];
  addSection: (section: DashboardSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, section: Partial<DashboardSection>) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
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
}));

export const useDashboardSection = (section: DashboardSection) => {
  const processedData = useMemo(async () => {
    const { sqlContent, sqlVariables, databaseId } = section;
    const finalSql = getFinalSql(sqlContent, sqlVariables);
    const result = await executeQueryAction(databaseId, finalSql);
    if (!result.success) {
      return null;
    }

    const view = views.get(section.viewMode);
    if (!view) {
      return null;
    }

    // Use the view's processor to transform the data
    if (!view.processor.processData) {
      return null;
    }
    const processedResult = view.processor.processData
      ? await view.processor.processData(result.data)
      : { isValid: true, data: result.data };
    if (!processedResult.isValid) {
      return null;
    }
    return processedResult.data;
  }, [
    section.sqlContent,
    section.sqlVariables,
    section.databaseId,
    section.viewMode,
  ]);

  const ViewComponent = useMemo(() => {
    console.log(section.viewMode);
    return views.get(section.viewMode);
  }, [section.viewMode]);

  return {
    processedData,
    ViewComponent,
  };
};

export const useDashboardOperations = () => {
  const { sections, addSection, removeSection, updateSection } =
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
