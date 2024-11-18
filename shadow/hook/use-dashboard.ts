import { create } from "zustand";

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
