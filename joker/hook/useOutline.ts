import { create } from 'zustand'
import { debounce } from 'lodash-es'
import { aigenerateOutline } from '@/server/generateOutlineBase'
import type { OutlineBase } from '@/server/generateOutlineBase'
import type { DataConfig, GenerateConfig } from '@/server/generateOutlineSetting'
import { aigenerateDataConfig, dbgenerateDataConfig } from '@/server/generateOutlineSetting'

export interface OutlineItem extends OutlineBase {

    reportID?: string
    reportTitle?: string
    // 数据配置
    dataConfig?: DataConfig[]
    generateConfig?: GenerateConfig
}


interface OutlineState {
    items: OutlineItem[]
    isInitGenerating: boolean
    error: string | null
    initGenerateMessage: string

    isDataConfigGenerating: boolean
    DataConfigMessage: string

    currentOutline: OutlineItem | null
    setCurrentOutline: (outline: OutlineItem) => void

    generate: ({ report_title, history }: { report_title: string, history?: string }) => Promise<OutlineItem[]>
    generateDataConfig: ({ report_title, report_id, outline_id, outline_title }:
        { report_title: string, report_id: string, outline_id: string, outline_title: string }) => Promise<DataConfig[]>

    updateItem: (id: string, updates: Partial<OutlineItem>) => void
    deleteItem: (id: string) => void
    addItem: (item: OutlineItem) => void
    reorderItems: (items: OutlineItem[]) => void


}

const debouncedGenerateOutline = debounce(async (
    title: string,
    history: string | undefined,
    resolve: (value: OutlineItem[]) => void,
    reject: (error: Error) => void
) => {
    try {
        const result = await aigenerateOutline(title, history);
        resolve(result);
    } catch (error) {
        reject(error as Error);
    }
}, 300);

// 包装函数
const generateWithDebounce = (title: string, history?: string) => {
    return new Promise<OutlineItem[]>((resolve, reject) => {
        debouncedGenerateOutline(title, history, resolve, reject);
    });
};




export const useOutline = create<OutlineState>((set, get) => ({
    items: [],
    isInitGenerating: false,
    error: null,
    initGenerateMessage: '',

    isDataConfigGenerating: false,
    DataConfigMessage: '',
    currentOutline: null,
    setCurrentOutline: (outline) => set({ currentOutline: outline }),
    generate: async ({ report_title, history }: { report_title: string, history?: string }) => {
        if (!report_title) {
            set({ error: '请输入标题' });
            return [];
        }

        set({ isInitGenerating: true, error: null });
        try {
            const stream = await fetch(`${process.env.NEXT_PUBLIC_AI_CORE_URL}/generate-outline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: report_title,
                    history: history || '',
                    focus_modules: ['']
                })
            });

            const reader = stream.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('Stream not available');
            }

            let items: OutlineItem[] = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    const data = JSON.parse(line);

                    if (data.type === 'data') {
                        items = data?.data?.items?.map((item: any) => ({
                            outlineID: item.outline_id,
                            outlineTitle: item.outline_title,
                            type: item.type,
                            level: item.level,
                            nextId: item.next_id
                        }));
                        console.log(items)
                        set({ items: items });
                    } else if (data.type === 'end') {
                        set({ isInitGenerating: false, initGenerateMessage: '大纲生成完成' });
                    }
                }
            }

            return items;

        } catch (err) {
            console.error('Error:', err);
            set({
                isInitGenerating: false,
                error: err instanceof Error ? err.message : '生成失败'
            });
            return [];
        }
    },
    generateDataConfig: async ({ report_title, report_id, outline_id, outline_title }:
        { report_title: string, report_id: string, outline_id: string, outline_title: string }): Promise<DataConfig[]> => {
        if (get().currentOutline == null) {
            return [];
        }
        set({ isDataConfigGenerating: true, DataConfigMessage: '' });
        try {

            const dataConfig = await dbgenerateDataConfig(report_id, outline_id);
            if (dataConfig) {
                set({ isDataConfigGenerating: false });
                return dataConfig;
            } else {
                const result = await aigenerateDataConfig({ report_title, outline_title });
                set({ isDataConfigGenerating: false });
                return result;
            }
        } catch (error) {
            set({
                isDataConfigGenerating: false,
                DataConfigMessage: error instanceof Error ? error.message : '生成失败'
            });
            return [];
        }
    },

    updateItem: (id: string, updates: Partial<OutlineItem>) => {
        const { items } = get()
        const updateItemRecursive = (items: OutlineItem[]): OutlineItem[] => {
            return items.map(item => {
                if (item.outlineID === id) {
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
                if (item.outlineID === id) return false
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
    },

}))
