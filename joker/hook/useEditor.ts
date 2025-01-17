import { create } from 'zustand';
import { Editor } from '@tiptap/react';
import { persist } from 'zustand/middleware';
import { generateOutline, OutlineItem } from '@/server/generateOutline';
import { generateText } from '@/server/generateBlock';

interface SavedDoc {
  id: string;
  content: string;
}

interface EditorState {
  // Editor state
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  
  // Document storage
  savedDocs: SavedDoc[];
  getDoc: (id: string) => string | null;
  saveDoc: (id: string, content: string) => void;
  
  // Outline generation
  outlineTitle: string;
  outline: OutlineItem[];
  isGeneratingOutline: boolean;
  outlineError: string | null;
  setOutlineTitle: (title: string) => void;
  generateOutlineFromTitle: (title: string) => Promise<OutlineItem[]>;
  
  // Text generation
  generateTextFromOutline: (outline: OutlineItem) => Promise<string>;
  isGeneratingText: boolean;
  textError: string | null;
}

export const useEditorStore = create<EditorState>()(
  persist<EditorState>(
    (set, get) => ({
      // Editor state
      editor: null,
      setEditor: (editor) => set({ editor }),
      
      // Document storage
      savedDocs: [],
      getDoc: (id) => {
        const doc = get().savedDocs.find(doc => doc.id === id);
        return doc ? doc.content : "";
      },
      saveDoc: (id, content) => {
        return set((state) => {
          const existingDocIndex = state.savedDocs.findIndex(doc => doc.id === id);
          
          if (existingDocIndex >= 0) {
            // 更新已存在的文档
            const newDocs = [...state.savedDocs];
            newDocs[existingDocIndex] = { id, content };
            return { savedDocs: newDocs };
          } else {
            // 添加新文档
            return { savedDocs: [...state.savedDocs, { id, content }] };
          }
        });
      },

      // Outline generation
      outlineTitle: '',
      outline: [],
      isGeneratingOutline: false,
      outlineError: null,
      setOutlineTitle: (title) => set({ outlineTitle: title }),
      generateOutlineFromTitle: async (title) => {
        if (!title) {
          set({ outlineError: '标题不能为空', outline: [] });
          return [];
        }
        
        set({ isGeneratingOutline: true, outlineError: null });
        
        try {
          const outline = await generateOutline(title);
          set({ outline, isGeneratingOutline: false });
          return outline;
        } catch (err) {
          set({
            isGeneratingOutline: false,
            outlineError: err instanceof Error ? err.message : '生成大纲失败',
            outline: []
          });
          return [];
        }
      },

      // Text generation 
      generateTextFromOutline: async (outline: OutlineItem) => {
        set({ isGeneratingText: true, textError: null });
        try {
          const text = await generateText(outline);
          set({ isGeneratingText: false });
          return text;
        } catch (err) {
          set({ isGeneratingText: false, textError: err instanceof Error ? err.message : '生成文本失败' });
          throw err;
        }
      },
      isGeneratingText: false,
      textError: null
    }),
    {
      name: 'editor-storage',
      
      // @ts-ignore
      partialize: (state) => ({
        savedDocs: state.savedDocs
      })
    }
  )
);
