
import { create } from 'zustand'
import { generateOutline, OutlineItem } from '@/server/generateOutline'



interface OutlineState {
  outline: OutlineItem[]
  isLoading: boolean
  error: string | null
  generateOutline: (title: string) => Promise<void>
}




export const useOutlineGenerator = create<OutlineState>((set) => ({
  outline: [],
  isLoading: false,
  error: null,
  generateOutline: async (title: string) => {
    try {
      set({ isLoading: true, error: null })
      // ... 生成大纲的逻辑
      const outline = await generateOutline(title)
      set({ outline, isLoading: false })
    } catch (err) {
      set({ 
        isLoading: false,
        error: err instanceof Error ? err.message : '生成大纲失败'
      })
    }
  }
}))
