"use client"
import { create } from 'zustand'
import { OutlineItem } from '@/server/generateOutline'
import { generateText } from '@/server/generateBlock'

interface TextStore {
  text: string
  isGenerating: boolean
  error: string | null
  generateText: (outline: OutlineItem) => Promise<string> // 修改返回类型
}

export const useTextStore = create<TextStore>((set) => ({
  text: '',
  isGenerating: false,
  error: null,
  
  generateText: async (outline: OutlineItem) => {
    set({ isGenerating: true, error: null })
    try {
      const text = await generateText(outline) // 添加 await
      set({ text, isGenerating: false })
      return text // 返回生成的文本
    } catch (err) {
      set({
        isGenerating: false,
        error: err instanceof Error ? err.message : '生成文本内容失败',
        text: ''
      })
      throw err // 抛出错误以便调用方处理
    }
  }
}))
