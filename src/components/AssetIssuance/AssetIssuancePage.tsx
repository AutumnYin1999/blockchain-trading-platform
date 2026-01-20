import { useState } from 'react'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'
import AssetIssuanceContent from './AssetIssuanceContent'

function AssetIssuancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} currentPage="asset-issuance" />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <AssetIssuanceContent />
        </div>
      </div>
    </div>
  )
}

export default AssetIssuancePage
