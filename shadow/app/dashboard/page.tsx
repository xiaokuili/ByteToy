"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { VisualizationSelector } from "@/components/dashboard/dashboard-selector";
import { useState } from "react";
import { Visualization } from "@/types/base";

import { DashboardHeader } from "@/components/dashboard/dashboard-head";

export default function DashboardPage() {
  const [selectedVisualizations, setSelectedVisualizations] = useState<
    Visualization[]
  >([]);
  const handleVisualizationSelect = (visualization: Visualization) => {
    setSelectedVisualizations([...selectedVisualizations, visualization]);
  };
  return (
    <div className='flex h-full w-full '>
      {/* Left Panel */}
      <div className='w-64 border-r border-gray-200 p-4'>
        <div className='h-full'>
          <VisualizationSelector
            onVisualizationSelect={handleVisualizationSelect}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 flex flex-col '>
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
    </div>
  );
}
