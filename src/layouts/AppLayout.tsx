import { Outlet } from 'react-router-dom'
import { TrialBanner } from '@/features/subscription/components/TrialBanner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-app">
      <Topbar />
      <TrialBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
