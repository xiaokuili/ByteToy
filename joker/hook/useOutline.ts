import { create } from 'zustand'
import { debounce } from 'lodash-es'
import { generateOutline } from '@/server/generateOutline'
import type { OutlineItem } from '@/server/generateOutline'

interface OutlineState {
    items: OutlineItem[]
    isGenerating: boolean
    error: string | null
    generateMessage: string
    generate: ({ title, template }: { title: string, template?: string }) => Promise<OutlineItem[]>

    updateItem: (id: string, updates: Partial<OutlineItem>) => void
    deleteItem: (id: string) => void
    addItem: (item: OutlineItem) => void
    reorderItems: (items: OutlineItem[]) => void
}

const debouncedGenerateOutline = debounce(async (
    title: string,
    template: string | undefined,
    resolve: (value: OutlineItem[]) => void,
    reject: (error: any) => void
) => {
    console.log('Actually generating for:', title);
    try {
        const result = await generateOutline(title, template);
        resolve(result);
    } catch (error) {
        reject(error);
    }
}, 300);

// 包装函数
const generateWithDebounce = (title: string, template?: string) => {
    return new Promise<OutlineItem[]>((resolve, reject) => {
        debouncedGenerateOutline(title, template, resolve, reject);
    });
};


export const useOutline = create<OutlineState>((set, get) => ({
    items: [],
    isGenerating: false,
    error: null,
    generateMessage: '',

    generate: async ({ title, template }: { title: string, template?: string }) => {
        if (!title) {
            set({ error: '请输入标题' });
            return [];
        }


        set({ isGenerating: true, error: null });
        try {

            const items = await generateWithDebounce(title, template)
            set({ items, isGenerating: false });
            return items || [];
        } catch (err) {
            set({
                isGenerating: false,
                error: err instanceof Error ? err.message : '生成失败'
            });
            return [];
        }
    },

    updateItem: (id: string, updates: Partial<OutlineItem>) => {
        const { items } = get()
        const updateItemRecursive = (items: OutlineItem[]): OutlineItem[] => {
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
        const deleteItemRecursive = (items: OutlineItem[]): OutlineItem[] => {
            return items.filter(item => {
                if (item.id === id) return false
                return true
            })
        }
        set({ items: deleteItemRecursive(items) })
    },

    addItem: (item: OutlineItem) => {
        const { items } = get()
        set({ items: [...items, item] })
    },

    reorderItems: (newItems: OutlineItem[]) => {
        set({ items: newItems })
    }
}))
