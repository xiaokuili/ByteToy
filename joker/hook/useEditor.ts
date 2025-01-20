"use client"
import { create } from 'zustand';
import { Editor } from '@tiptap/react';
import { persist } from 'zustand/middleware';
import { generateOutline, OutlineItem } from '@/server/generateOutline';
import { generateText } from '@/server/generateContent';

// 将状态按职责拆分
interface OutlineState {
  title: string;
  items: OutlineItem[];
  isGenerating: boolean;
  error: string | null;
}

interface EditorState {
  instance: Editor | null;
  isGenerating: boolean;
  error: string | null;
}

interface StorageState {
  docs: Array<{ id: string; content: string }>;
}

interface Store {
  // 大纲相关
  outline: OutlineState;
  setOutlineTitle: (title: string) => void;
  generateOutline: (title: string) => Promise<OutlineItem[]>;

  // 编辑器相关
  editor: EditorState;
  setEditor: (editor: Editor | null) => void;
  generateContent: (outline: OutlineItem) => Promise<void>;

  // 存储相关
  storage: StorageState;
  saveDoc: (id: string, content: string) => void;
  getDoc: (id: string) => string;
}

export const useEditorStore = create<Store>()(
  persist(
    (set, get) => ({
      // 大纲状态管理
      outline: {
        title: '',
        items: [],
        isGenerating: false,
        error: null
      },
      setOutlineTitle: (title) =>
        set(state => ({ outline: { ...state.outline, title } })),
      generateOutline: async (title) => {
        set(state => ({
          outline: { ...state.outline, isGenerating: true, error: null }
        }));

        try {
          const items = await generateOutline(title);
          set(state => ({
            outline: { ...state.outline, items, isGenerating: false }
          }));
          return items;
        } catch (err) {
          set(state => ({
            outline: {
              ...state.outline,
              isGenerating: false,
              error: err instanceof Error ? err.message : '生成失败'
            }
          }));
          return [];
        }
      },

      // 编辑器状态管理
      editor: {
        instance: null,
        isGenerating: false,
        error: null
      },
      setEditor: (instance) =>
        set(state => ({ editor: { ...state.editor, instance } })),
      generateContent: async (outline: OutlineItem) => {
        const { editor } = get();
        if (!editor.instance) return;

        try {
          set(state => ({
            editor: { ...state.editor, isGenerating: true, error: null }
          }));

          const stream = await generateText(outline);

          let isFirst = true;
          for await (const chunk of stream) {

            if (isFirst) {
              set(state => ({
                editor: { ...state.editor, isGenerating: false }
              }));
              isFirst = false;
            }

            if (chunk && typeof chunk === 'string' && chunk.trim()) {
              editor.instance.commands.insertContent(chunk);
            }
          }
          editor.instance.commands.enter();
        } catch (err) {
          set(state => ({
            editor: {
              ...state.editor,
              error: err instanceof Error ? err.message : '生成失败',
              isGenerating: false
            }
          }));
        }
      },

      // 存储状态管理
      storage: {
        docs: []
      },
      saveDoc: (id, content) => {
        set(state => ({
          storage: {
            docs: [
              ...state.storage.docs.filter(doc => doc.id !== id),
              { id, content }
            ]
          }
        }));
      },
      getDoc: (id) => {
        const doc = get().storage.docs.find(doc => doc.id === id);
        return doc?.content ?? '';
      }
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        storage: state.storage
      })
    }
  )
);
