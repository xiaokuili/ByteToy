'use client'

import { DashboardGrid } from '@/components/dashboard/dashboard-grid'
import { BlockSelector } from '@/components/dashboard/block-selector'
import { useState } from 'react'
import { Block } from '@/types/dashboard'

export default function DashboardPage() {
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([])

  const handleAddBlock = (block: Block) => {
    setSelectedBlocks([...selectedBlocks, block])
  }

  return (
    <div className="flex h-screen">
      <BlockSelector onSelectBlock={handleAddBlock} />
      <DashboardGrid blocks={selectedBlocks} />
    </div>
  )
} 