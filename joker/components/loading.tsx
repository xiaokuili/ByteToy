'use client'

import { Progress } from "@/components/ui/progress"

function LoadingDots() {
  return (
    <div className="flex gap-1 mb-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  )
}

interface LoadingProps {
  message?: string
  show?: boolean
}

export function Loading({ message = "加载中...", show = false }: LoadingProps) {
  if (!show) return null
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <LoadingDots />
          <div className="text-sm text-muted-foreground animate-pulse">
            {message}
          </div>
        </div>
        <div className="mt-2">
          <Progress value={33} className="h-1.5" />
        </div>
      </div>
    </div>
  )
}
