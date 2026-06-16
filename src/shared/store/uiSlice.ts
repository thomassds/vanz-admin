import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store.types'

interface UiState {
  isSidebarOpen: boolean
}

const initialState: UiState = {
  isSidebarOpen: window.innerWidth >= 768,
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
  },
})

export const { openSidebar, closeSidebar, toggleSidebar } = uiSlice.actions

export const selectIsSidebarOpen = (state: RootState) => state.ui.isSidebarOpen
