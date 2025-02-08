import { create } from 'zustand'

interface InputState {
  title: string
  history?: string
  report_id: string
  setTitle: (title: string) => void
  setHistory: (template?: string) => void
  setReportId: (id: string) => void

}

export const useInput = create<InputState>((set) => ({
  title: '',
  history: undefined,
  report_id: "",
  setTitle: (title: string) => set({ title }),
  setHistory: (template?: string) => set({ history: template }),
  setReportId: (id: string ) => set({ report_id: id })
}))
