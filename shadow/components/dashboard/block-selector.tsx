'use client'

import { Block } from '@/types/dashboard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface BlockSelectorProps {
  onSelectBlock: (block: Block) => void
}

export function BlockSelector({ onSelectBlock }: BlockSelectorProps) {
  // 示例块列表
  const availableBlocks: Block[] = [
    { id: '1', type: 'chart', title: '图表块' },
    { id: '2', type: 'table', title: '表格块' },
    // 添加更多块类型
  ]

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">可用模块</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {availableBlocks.map((block) => (
            <Card 
              key={block.id}
              className="mb-2 cursor-pointer hover:bg-accent"
              onClick={() => onSelectBlock(block)}
            >
              <CardHeader>
                <CardTitle className="text-sm">{block.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
} 