import { create } from 'zustand'
import { OutlineNode } from '@/types/report'

interface ReportConfigState {
    items: OutlineNode[]
    currentItem: OutlineNode | null
    setCurrentItem: (item: OutlineNode) => void
    updateItem: (id: string, updates: Partial<OutlineNode>) => void
    deleteItem: (id: string) => void
    addItem: (item: OutlineNode) => void
    reorderItems: (items: OutlineNode[]) => void
}

export const useReportConfig = create<ReportConfigState>((set, get) => ({
    items: [],
    currentItem: null,
    setCurrentItem: (item) => set({ currentItem: item }),

    updateItem: (id: string, updates: Partial<OutlineNode>) => {
        const { items } = get()
        const updateItemRecursive = (items: OutlineNode[]): OutlineNode[] => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates }
                }
                return item
            })
        }
        set({ items: updateItemRecursive(items) })
    },

    deleteItem: (id: string) => {
        const { items } = get()
        const deleteItemRecursive = (items: OutlineNode[]): OutlineNode[] => {
            return items.filter(item => {
                if (item.id === id) return false
                return true
            })
        }
        set({ items: deleteItemRecursive(items) })
    },

    addItem: (item: OutlineNode) => {
        const { items } = get()
        set({ items: [...items, item] })
    },

    reorderItems: (newItems: OutlineNode[]) => {
        set({ items: newItems })
    },
}))
