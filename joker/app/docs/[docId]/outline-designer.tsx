"use client"

import { ListTree, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OutlineItem } from "@/server/generateOutline";
import { useOutlineGenerator } from "@/hook/useOutlineGenerator";





function OutlineNode({ item, depth = 0 }: { item: OutlineItem; depth?: number }) {
    
    
    return (
      <div className="space-y-2">
        <Card className="border border-border/50">
          <CardContent className="p-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 flex-1"
                style={{ paddingLeft: `${depth * 12}px` }}
              >
                <ListTree className="h-4 w-4 text-muted-foreground" />
                <span>{item.title}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {item.children?.map(child => (
          <OutlineNode 
            key={child.id} 
            item={child} 
            depth={depth + 1} 
          />
        ))}
      </div>
    )
  }
  
  




export default function OutlineDesigner() {
    const { outline } = useOutlineGenerator()
    
    return (
      <div className="space-y-2 p-4">
        {outline.map(item => (
          <OutlineNode key={item.id} item={item} />
        ))}
      </div>
    )
  }