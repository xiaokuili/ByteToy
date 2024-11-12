'use client'

import { Block } from '@/types/dashboard'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardGridProps {
  blocks: Block[]
}

export function DashboardGrid({ blocks }: DashboardGridProps) {
  const layouts = {
    lg: blocks.map((block, index) => ({
      i: block.id,
      x: (index * 4) % 12,
      y: Math.floor(index / 3) * 4,
      w: 4,
      h: 4,
    })),
  }

  return (
    <div className="flex-1 p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
      >
        {blocks.map((block) => (
          <div key={block.id} className="bg-card border rounded-lg p-4">
            <h3 className="font-medium">{block.title}</h3>
            {/* 这里可以根据block.type渲染不同的内容 */}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
} 