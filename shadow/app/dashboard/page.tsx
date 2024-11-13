"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { VisualizationSelector } from "@/components/dashboard/block-selector";
import { useState } from "react";
import { Visualization } from "@/types/base";

import { DashboardHeader } from "@/components/dashboard/dashboard-head";

export default function DashboardPage() {
  const [selectedBlocks, setSelectedBlocks] = useState<Visualization[]>([]);
  const handleVisualizationSelect = (visualization: Visualization) => {
    setSelectedBlocks([...selectedBlocks, visualization]);
  };

  return (
    <div className='flex'>
      <div className='fixed h-screen overflow-y-auto'>
        <VisualizationSelector onVisualizationSelect={handleVisualizationSelect} />
      </div>
      <div className='ml-64 flex-1'>
        <div className="flex flex-col h-screen">
          <div className="sticky top-0 z-10 bg-background">
            <DashboardHeader />
          </div>
          <div className="flex-1 overflow-auto">
            <DashboardGrid blocks={selectedBlocks} />
          </div>
        </div>
      </div>
    </div>
  );
}
