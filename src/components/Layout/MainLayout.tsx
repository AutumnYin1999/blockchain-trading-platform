import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopNavbar from '../AssetIssuance/TopNavbar'
import Sidebar from '../AssetIssuance/Sidebar'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
