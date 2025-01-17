'use client'

import { Loader2 } from 'lucide-react'
import { useOutlineStore } from '@/hook/useOutlineGenerator'



function LoadingText({ message }: { message: string }) {
  return (
    <div className="text-sm text-white/90">
      {message.split('').map((char, index) => (
        <span 
          key={index}
          className="inline-block animate-bounce"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}




export function FullLoading() {
  
    // 判断大纲生成是否完成
  const { isLoading: outlineLoading } = useOutlineStore()
  if (!outlineLoading) return null

    // 判断报告生成是否完成
 

  
  const message = outlineLoading ? "正在生成大纲，请稍等..." : "正在生成报告，请稍等..."

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-row items-center gap-4  px-8 py-6 rounded-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <LoadingText message={message} />
      </div>
    </div>
  )
}