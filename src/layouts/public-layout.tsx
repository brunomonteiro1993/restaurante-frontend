import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <Outlet />
    </main>
  )
}
