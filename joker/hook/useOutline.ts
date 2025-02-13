import debounce from 'lodash-es/debounce'
import { create } from 'zustand'

// 第一步从大模型生成的大纲
export interface OutlineBase {
    outlineID: string
    outlineTitle: string
    level: number
    nextId: string | null
}
// 控制生成文本的数据源
// 数据源可以产生优质内容，而不是数据
export interface DataConfig  {
    id: string
    url: string
    name: string
}

// AI 人们都想要和高质量类似的AI生成内容， 但是却追求AI自己生成的内容
export interface GenerateConfig {
    id: string
    llm_name: string
    example_sentence: string 
}




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
            const items = await fetchOutlineWithDebounce(report_title, history);
            set({ items, isInitGenerating: false, initGenerateMessage: '大纲生成完成' });
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



const fetchOutline = async (title: string, history?: string): Promise<OutlineItem[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_CORE_URL}/generate-outline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                history: history || '',
                focus_modules: ['']
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format');
        }

        return data.items.map((item: {
            outline_id: string;
            outline_title: string;
            type: string;
            level: number;
            next_id: string | null;
        }) => ({
            outlineID: item.outline_id,
            outlineTitle: item.outline_title,
            type: item.type,
            level: item.level,
            nextId: item.next_id
        }));
    } catch (err) {
        console.error('Error fetching outline:', err);
        throw err;
    }
};

// 基于防抖动，禁止开发过程中两次请求结果不同
const debouncedFetchOutline = debounce(async (
    title: string,
    history: string | undefined,
    resolve: (value: OutlineItem[]) => void,
    reject: (error: Error) => void
) => {
    console.log('Actually fetching outline for:', title);
    try {
        const result = await fetchOutline(title, history);
        resolve(result);
    } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
    }
}, 500);

const fetchOutlineWithDebounce = (title: string, history?: string): Promise<OutlineItem[]> => {
    return new Promise<OutlineItem[]>((resolve, reject) => {
        debouncedFetchOutline(title, history, resolve, reject);
    });
};




const dbgenerateDataConfig = async (report_id: string, outline_id: string): Promise<DataConfig[]> => {

    console.log(report_id, outline_id)
    return []
}

const aigenerateDataConfig = async ({ report_title, outline_title }: { report_title: string, outline_title: string }): Promise<DataConfig[]> => {
    console.log(report_title, outline_title)
    return []
}

