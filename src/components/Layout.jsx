import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <main className="px-8 py-7 max-w-[1600px]">{children}</main>
      </div>
    </div>
  )
}
