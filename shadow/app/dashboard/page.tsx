"use client";

import { DashboardCanvas } from "@/components/dashboard/dashboard-canvas";
import { VisualizationSetting } from "@/components/dashboard/dashboard-setting";
import { useState } from "react";
import { Visualization } from "@/types/base";
import { DashboardToolbar } from "@/components/dashboard/tool";
import { DashboardHeader } from "@/components/dashboard/dashboard-head";
import { useDashboard, useDashboardActive } from "@/hook/use-dashboard";

export default function DashboardPage() {
  const { sections, addSection, removeSection, updateSection } = useDashboard();
  const { activeId } = useDashboardActive();

  const handleAddSection = (section: DashboardSection) => {
    addSection(section);
  };
  return (
    <div className='flex h-full w-full'>
      {/* Left Panel - Dashboard Report */}
      <div className='flex-1 flex flex-col'>
        {/* Top Section */}
        <DashboardHeader />

        {/* Bottom Section - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='bg-gray-50 rounded-lg min-h-full'>
            <DashboardCanvas
              dashboardSections={sections}
              removeSection={removeSection}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Block Settings */}
      {activeId && (
        <div className='w-96 border-l'>
          <VisualizationSetting onUpdateSection={updateSection} />
        </div>
      )}

      {/* Toolbar */}
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2 border'>
        <DashboardToolbar
          onAddBlock={addSection}
          onAddVariable={() => {}}
          onAddHeader={() => {}}
          onAddText={() => {}}
        />
      </div>
    </div>
  );
}
