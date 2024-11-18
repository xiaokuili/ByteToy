"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { VisualizationSelector } from "@/components/dashboard/dashboard-selector";
import { useState } from "react";
import { Visualization } from "@/types/base";
import { DashboardToolbar } from "@/components/dashboard/tool";
import { DashboardHeader } from "@/components/dashboard/dashboard-head";

export default function DashboardPage() {
  const [selectedVisualizations, setSelectedVisualizations] = useState<
    Visualization[]
  >([]);
  const handleVisualizationSelect = (visualization: Visualization) => {
    setSelectedVisualizations([...selectedVisualizations, visualization]);
  };
  return (
    <div className='flex h-full w-full'>
      {/* Left Panel */}
      <div className='w-64  p-4'>
        <div className='h-full'>
          <VisualizationSelector
            onVisualizationSelect={handleVisualizationSelect}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 flex flex-col'>
        {/* Top Section */}
        <DashboardHeader />

        {/* Bottom Section - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4'>
          {/* Example content to demonstrate scroll */}
          <DashboardGrid
            visualizations={selectedVisualizations}
            setSelectedVisualizations={setSelectedVisualizations}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2 border'>
        <DashboardToolbar
          onAddBlock={() => {}}
          onAddVariable={() => {}}
          onAddHeader={() => {}}
          onAddText={() => {}}
        />
      </div>
    </div>
  );
}
