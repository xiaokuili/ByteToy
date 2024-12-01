"use client";
import { useEffect } from "react";
import { DashboardCanvas } from "@/components/dashboard/dashboard-canvas";
import { VisualizationSetting } from "@/components/dashboard/dashboard-setting";
import { DashboardToolbar } from "@/components/dashboard/tool";
import { DashboardHeader } from "@/components/dashboard/dashboard-head";
import {
  useDashboardOperations,
  useDashboardActive,
} from "@/hook/use-dashboard";
import { useSidebar } from "@/hook/use-sidebar";

export default function DashboardPage({ params }: { params: { id: string } }) {
  const { sections, add, remove, update, load } = useDashboardOperations();
  const { activeId } = useDashboardActive();
  const { setIsCollapsed } = useSidebar();

  useEffect(() => {
    setIsCollapsed(true);
    return () => {
      setIsCollapsed(false);
    };
  }, [setIsCollapsed]);

  useEffect(() => {
    load(params.id);
  }, [params.id, load]);

  return (
    <div className='flex h-full w-full'>
      {/* Left Panel - Dashboard Report */}
      <div className='flex-1 flex flex-col'>
        {/* Top Section */}
        <DashboardHeader dashboardId={params.id} />

        {/* Bottom Section - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='bg-gray-50 rounded-lg min-h-full'>
            <DashboardCanvas
              dashboardSections={sections}
              removeSection={remove}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Block Settings */}
      {activeId && (
        <div className='w-96 border-l'>
          <VisualizationSetting onUpdateSection={update} />
        </div>
      )}

      {/* Toolbar */}
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2 border'>
        <DashboardToolbar
          onAddBlock={add}
          onAddVariable={() => {}}
          onAddHeader={() => {}}
          onAddText={() => {}}
        />
      </div>
    </div>
  );
}
