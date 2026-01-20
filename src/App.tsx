import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import MainLayout from './components/Layout/MainLayout'
import RoleSelection from './pages/RoleSelection'
import DashboardPage from './pages/Dashboard'
import AssetIssuancePage from './pages/AssetIssuance'
import ReceivablesManagementPage from './pages/ReceivablesManagement'
import InventoryIssuancePage from './pages/InventoryIssuance'
import MarketTradingPage from './pages/MarketTrading'
import ABSPackagingPage from './pages/ABSPackaging'
import LendingPage from './pages/Lending'
import FundRecoveryPage from './pages/FundRecovery'
import BridgePage from './pages/Bridge'
import Placeholder from './pages/Placeholder'

function App() {
  // 获取 Vite 配置的 base 路径，用于 GitHub Pages 部署
  const basename = import.meta.env.BASE_URL || '/'
  
  return (
    <LanguageProvider>
      <BrowserRouter basename={basename}>
      <Routes>
        {/* 角色选择页面 - 作为首页 */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        
        {/* 主应用布局 - 需要登录/选择角色后访问 */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="asset-issuance" element={<AssetIssuancePage />} />
          <Route path="receivables-management" element={<ReceivablesManagementPage />} />
          <Route path="inventory-issuance" element={<InventoryIssuancePage />} />
          <Route path="market-trading" element={<MarketTradingPage />} />
          <Route path="lending" element={<LendingPage />} />
          <Route path="abs-packaging" element={<ABSPackagingPage />} />
          <Route path="bridge" element={<BridgePage />} />
          <Route path="fund-recovery" element={<FundRecoveryPage />} />
        </Route>

        {/* 兼容旧路由 - 重定向到新路由 */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/asset-issuance" element={<Navigate to="/app/asset-issuance" replace />} />
        <Route path="/market-trading" element={<Navigate to="/app/market-trading" replace />} />
        <Route path="/lending" element={<Navigate to="/app/lending" replace />} />
        <Route path="/abs-packaging" element={<Navigate to="/app/abs-packaging" replace />} />
        <Route path="/bridge" element={<Navigate to="/app/bridge" replace />} />
        <Route path="/fund-recovery" element={<Navigate to="/app/fund-recovery" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
