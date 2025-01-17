import { create, StateCreator } from 'zustand';
import { Editor } from '@tiptap/react';
import { persist, createJSONStorage } from 'zustand/middleware'

interface SavedDoc {
  id: string;
  content: string;
}
interface EditorState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  savedDocs: SavedDoc[];
  getDoc: (id: string) => string | null;
  saveDoc: (id: string, content: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist<EditorState>(
    (set, get) => ({
      editor: null,
      setEditor: (editor) => set({ editor }),
      savedDocs: [],
      getDoc: (id) => {
        const doc = get().savedDocs.find(doc => doc.id === id);
        return doc ? doc.content : "";
      },
      saveDoc: (id, content) => set((state) => ({
        savedDocs: [...state.savedDocs, {
          id,
          content
        }]
      }))
    }),
    {
      name: 'editor-storage',
      // ignore lint error
      // @ts-ignore
      partialize: (state) => ({
        savedDocs: state.savedDocs
      }) 
    }
  )
);

