import { create } from 'zustand'
import { generateOutline, OutlineItem } from '@/server/generateOutline'
import { useEffect, useCallback } from 'react'

interface OutlineState {
  title: string
  outline: OutlineItem[]
  isLoading: boolean
  error: string | null
}

interface OutlineActions {
  setTitle: (title: string) => void
  generateOutline: (title: string) => Promise<void>
}

const useOutlineStore = create<OutlineState & OutlineActions>((set) => ({
  // 初始状态
  title: '',
  outline: [],
  isLoading: false,
  error: null,

  // Actions
  setTitle: (title) => set({ title }),

  generateOutline: async (title) => {
    if (!title) return

    set({ isLoading: true, error: null })

    try {
      const outline = await generateOutline(title)
      set({ outline, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : '生成大纲失败',
        outline: []
      })
    }
  }
}))

export const useOutlineGenerator = () => {
  const { title, generateOutline, isLoading, error, outline, setTitle } = useOutlineStore()
  
  const memoizedGenerateOutline = useCallback(() => {
    if (title) {
      generateOutline(title)
    }
  }, [title, generateOutline])

  useEffect(() => {
    memoizedGenerateOutline()
  }, [memoizedGenerateOutline])

  return {
    title,
    outline,
    isLoading,
    error,
    setTitle
  }
}
