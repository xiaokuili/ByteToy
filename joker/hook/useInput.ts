import { create } from 'zustand'

interface InputState {
  title: string
  template?: string
  setTitle: (title: string) => void
  setTemplate: (template?: string) => void
}

export const useInput = create<InputState>((set) => ({
  title: '',
  template: undefined,
  setTitle: (title: string) => set({ title }),
  setTemplate: (template?: string) => set({ template })
}))
