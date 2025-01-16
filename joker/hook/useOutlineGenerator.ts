import { create } from 'zustand'
import { generateOutline, OutlineItem } from '@/server/generateOutline'

interface OutlineState {
  title: string
  outline: OutlineItem[]
  isLoading: boolean
  error: string | null
}

interface OutlineActions {
  setTitle: (title: string) => void
  generateOutline: (title: string) => Promise<boolean> // 返回是否成功
}

export  const useOutlineStore = create<OutlineState & OutlineActions>((set) => ({
  // 初始状态
  title: '',
  outline: [],
  isLoading: false,
  error: null,

  // Actions
  setTitle: (title) => set({ title }),

  generateOutline: async (title) => {
    if (!title) return false

    set({ isLoading: true, error: null })

    try {
      const outline = await generateOutline(title)
      set({ outline, isLoading: false })
      return true
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : '生成大纲失败',
        outline: []
      })
      return false
    }
  }
}))


