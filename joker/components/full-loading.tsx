'use client'

import { useEffect, useState } from 'react'
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

function LoadingText({ message }: { message: string }) {
  return (
    <div className="text-sm text-foreground/80 animate-pulse transition-colors duration-1000">
      {message}
    </div>
  )
}

export function FullLoading({show, message}: {show: boolean, message: string}) {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout


    const animateProgress = () => {
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 1.5
        })
      }, 300)
    }

    if (show) {
      animateProgress()
    }

    return () => {
      if (timer) clearTimeout(timer)
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-xl bg-card/95 backdrop-blur-sm border border-border/20 shadow-lg min-w-[300px]">
        <LoadingDots />
        <Progress
          value={progress}
          className="w-full transition-all duration-300"
        />
        <LoadingText message={message} />
      </div>
    </div>
  )
}