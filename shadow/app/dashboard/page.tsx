"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { VisualizationSelector } from "@/components/dashboard/block-selector";
import { useState } from "react";
import { Variable, Visualization } from "@/types/base";
import { VariablesSection } from "@/components/query/workspace/header/variables-section";
import { Button } from "@/components/ui/button";

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
        <DashboardGrid blocks={selectedBlocks} />
      </div>
    </div>
  );
}
