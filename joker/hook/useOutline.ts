import { create } from 'zustand'
import { generateOutline } from '@/server/generateOutline'
import type { OutlineItem } from '@/server/generateOutline'

interface OutlineState {
    title: string
    template?: string
    items: OutlineItem[]
    isGenerating: boolean
    error: string | null
    setTitle: (title: string) => void
    setTemplate: (template?: string) => void
    generate: () => Promise<OutlineItem[]>
}

export const useOutline = create<OutlineState>((set, get) => ({
    title: '',
    template: undefined,
    items: [],
    isGenerating: false,
    error: null,

    setTitle: (title: string) => set({ title }),

    setTemplate: (template?: string) => set({ template }),

    generate: async () => {
        const { title } = get()

        if (!title) {
            set({ error: '请输入标题' })
            return []
        }

        set({ isGenerating: true, error: null })

        try {
            const items = await generateOutline(title)
            set({ items, isGenerating: false })
            return items
        } catch (err) {
            set({
                isGenerating: false,
                error: err instanceof Error ? err.message : '生成失败'
            })
            return []
        }
    }
}))
