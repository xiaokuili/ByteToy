import { create } from 'zustand'
import { OutlineConfig } from '@/types/report'
import debounce from 'lodash-es/debounce'
import { loadOutlineFromDb, saveOutlineToDb, deleteOutlineFromDb } from '@/lib/services'

interface OutlineService {
    generateOutlineByAI: (title: string, history?: string, focus_modules?: string[]) => Promise<OutlineConfig[]>
    isGenerating: boolean
    generateMessage: string
    error: string | null

    loadOutline: (reportId: string) => Promise<OutlineConfig[]>
    isLoading: boolean
    loadMessage: string
    loadError: string | null

    // 第一次应该只会生成和存储， 后续才会进行更新
    saveOutline: (outline: OutlineConfig, reportId: string) => Promise<void>
    isSaving: boolean
    saveMessage: string
    saveError: string | null

    deleteOutline: (reportId: string) => Promise<void>
    isDeleting: boolean
    deleteMessage: string
    deleteError: string | null
}

export const useOutlineService = create<OutlineService>((set) => ({
    isGenerating: false,
    generateMessage: '',
    error: null,
    isLoading: false,
    loadMessage: '',
    loadError: null,
    isSaving: false,
    saveMessage: '',
    saveError: null,
    isDeleting: false,
    deleteMessage: '',
    deleteError: null,

    generateOutlineByAI: async (title: string, history?: string, focus_modules: string[] = ['']) => {
        if (!title) {
            set({ error: '请输入标题' });
            return [];
        }

        set({ isGenerating: true, error: null });
        try {
            const outlineConfigs = await fetchOutlineWithDebounce(title, history, focus_modules);
            set({ isGenerating: false, generateMessage: '大纲生成完成' });
            return outlineConfigs;
        } catch (err) {
            console.error('Error:', err);
            set({
                isGenerating: false,
                error: err instanceof Error ? err.message : '生成失败'
            });
            return [];
        }
    },

    loadOutline: async (reportId: string) => {
        if (!reportId) {
            set({ loadError: '请提供ID' });
            return [];
        }

        set({ isLoading: true, loadError: null });
        try {
            const outlineConfigs = await loadOutlineFromDb(reportId);
            set({ isLoading: false, loadMessage: '大纲加载完成' });
            return outlineConfigs;
        } catch (err) {
            console.error('Error:', err);
            set({
                isLoading: false,
                loadError: err instanceof Error ? err.message : '加载失败'
            });
            return [];
        }
    },

    saveOutline: async (outline: OutlineConfig, reportId: string) => {
        if (!outline) {
            set({ saveError: '请提供大纲数据' });
            return outline;
        }

        set({ isSaving: true, saveError: null });
        try {
            await saveOutlineToDb(outline, reportId);
            set({ isSaving: false, saveMessage: '大纲保存完成' });
        } catch (err) {
            console.error('Error:', err);
            set({
                isSaving: false,
                saveError: err instanceof Error ? err.message : '保存失败'
            });
        }
    },

    deleteOutline: async (reportId: string) => {
        set({ isDeleting: true, deleteError: null });
        try {
            await deleteOutlineFromDb(reportId);
            set({ isDeleting: false, deleteMessage: '大纲删除完成' });
        } catch (err) {
            set({ isDeleting: false, deleteError: err instanceof Error ? err.message : '删除失败' });
        }
    }
}))

const fetchOutline = async (title: string, history?: string, focus_modules: string[] = ['']): Promise<OutlineConfig[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AI_CORE_URL}/generate-outline`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            history: history || '',
            focus_modules
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
        id: item.outline_id,
        title: item.outline_title,
        depth: item.level,
        nextNodeId: item.next_id
    }));
}

const debouncedFetchOutline = debounce(async (
    title: string,
    history: string | undefined,
    focus_modules: string[],
    resolve: (value: OutlineConfig[]) => void,
    reject: (error: Error) => void
) => {
    try {
        const result = await fetchOutline(title, history, focus_modules);
        resolve(result);
    } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
    }
}, 500);

const fetchOutlineWithDebounce = (title: string, history?: string, focus_modules: string[] = ['']): Promise<OutlineConfig[]> => {
    return new Promise<OutlineConfig[]>((resolve, reject) => {
        debouncedFetchOutline(title, history, focus_modules, resolve, reject);
    });
};
