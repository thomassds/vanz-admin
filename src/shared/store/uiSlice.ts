import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store.types'

export type Theme = 'light' | 'dark'

interface UiState {
  isSidebarOpen: boolean
  theme: Theme
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('vanz-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const initialState: UiState = {
  isSidebarOpen: window.innerWidth >= 768,
  theme: getInitialTheme(),
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true
    },
    closeSidebar(state) {
      state.isSidebarOpen = false
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme(state, action: { payload: Theme }) {
      state.theme = action.payload
    },
  },
})

export const { openSidebar, closeSidebar, toggleSidebar, toggleTheme, setTheme } =
  uiSlice.actions

export const selectIsSidebarOpen = (state: RootState) => state.ui.isSidebarOpen
export const selectTheme = (state: RootState) => state.ui.theme
