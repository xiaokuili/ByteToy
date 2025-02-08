import { create } from 'zustand'

interface InputState {
  title: string
  history?: string
  report_id: string | null
  setTitle: (title: string) => void
  setHistory: (template?: string) => void
  setReportId: (id: string | null) => void

}

export const useInput = create<InputState>((set) => ({
  title: '',
  history: undefined,
  report_id: null,
  setTitle: (title: string) => set({ title }),
  setHistory: (template?: string) => set({ history: template }),
  setReportId: (id: string | null) => set({ report_id: id })
}))
