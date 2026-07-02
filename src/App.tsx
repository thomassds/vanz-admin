import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useAppSelector } from '@/app/hooks'
import { selectTheme } from '@/shared/store/uiSlice'

export default function App() {
  const theme = useAppSelector(selectTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('vanz-theme', theme)
  }, [theme])

  return <RouterProvider router={router} />
}
