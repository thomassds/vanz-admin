import { useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/store/authSlice'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    void navigate('/login')
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f7f9fc]">
      <h1 className="font-['Montserrat',sans-serif] text-3xl font-bold text-[#002c66]">
        Dashboard
      </h1>
      <p className="text-[#708097]">Em construção...</p>
      <button
        onClick={handleLogout}
        className="rounded-md bg-[#00c8ff] px-6 py-2 font-['Montserrat',sans-serif] text-sm font-bold text-white hover:brightness-105"
      >
        Sair
      </button>
    </main>
  )
}
