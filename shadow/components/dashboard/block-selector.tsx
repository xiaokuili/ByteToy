"use client";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { listVisualizations } from "@/lib/visualization-actions";
import { Visualization } from "@/types/base";

interface BlockSelectorProps {
  onSelectBlock: (block: Visualization) => void;
}

export function BlockSelector({ onSelectBlock }: BlockSelectorProps) {
  const [availableBlocks, setAvailableBlocks] = useState<Visualization[]>([]);

  useEffect(() => {
    const fetchVisualizations = async () => {
      const visualizationResult = await listVisualizations();
      setAvailableBlocks(visualizationResult.data);
    };
    fetchVisualizations();
  }, []);

  return (
    <div className='w-64 border-r bg-background'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold mb-4'>可用模块</h2>
        <ScrollArea className='h-[calc(100vh-8rem)]'>
          {availableBlocks.map((block) => (
            <Card
              key={block.id}
              className='mb-2 cursor-pointer hover:bg-accent'
              onClick={() => onSelectBlock(block)}
            >
              <CardHeader>
                <CardTitle className='text-sm'>{block.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
