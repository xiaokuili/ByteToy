"use client";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { listVisualizations } from "@/lib/visualization-actions";
import { Visualization } from "@/types/base";

interface VisualizationSelectorProps {
  onVisualizationSelect: (visualization: Visualization) => void;
}
export function VisualizationSelector({
  onVisualizationSelect,
}: VisualizationSelectorProps) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);

  useEffect(() => {
    const fetchVisualizations = async () => {
      const visualizationResult = await listVisualizations();
      setVisualizations(visualizationResult.data);
    };
    fetchVisualizations();
  }, []);

  return (
    <div className='w-64 bg-background h-screen flex flex-col'>
      <ScrollArea className='flex-1'>
        <div className='p-4 pt-0'>
          {visualizations.map((visualization) => (
            <Card
              key={visualization.id}
              className='cursor-pointer hover:bg-accent'
              onClick={() => onVisualizationSelect(visualization)}
            >
              <CardHeader>
                <CardTitle className='text-sm'>{visualization.name}</CardTitle>
                <div className='text-xs text-muted-foreground'>
                  {visualization.viewMode}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
