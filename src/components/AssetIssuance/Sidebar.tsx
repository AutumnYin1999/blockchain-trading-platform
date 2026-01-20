import { NavLink, useLocation } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { useLanguage } from '../../hooks/useLanguage'
import { hasPermission } from '../../utils/rolePermissions'

interface SidebarProps {
  isOpen: boolean
}

function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation()
  const { currentRole } = useRole()
  const { t } = useLanguage()

  // 基础菜单项
  const baseMenuItems = [
    { id: 'dashboard', labelKey: 'navigation.dashboard', icon: 'fa-chart-line', path: '/app/dashboard', permission: 'dashboard' },
    { id: 'market-trading', labelKey: 'navigation.marketTrading', icon: 'fa-exchange-alt', path: '/app/market-trading', permission: 'marketTrading' },
    { id: 'lending', labelKey: 'navigation.lending', icon: 'fa-hand-holding-usd', path: '/app/lending', permission: 'lending' },
    { id: 'abs-packaging', labelKey: 'navigation.absPackaging', icon: 'fa-box', path: '/app/abs-packaging', permission: 'absPackaging' },
    { id: 'bridge', labelKey: 'navigation.bridge', icon: 'fa-bridge', path: '/app/bridge', permission: 'bridge' },
    { id: 'fund-recovery', labelKey: 'navigation.fundRecovery', icon: 'fa-recycle', path: '/app/fund-recovery', permission: 'fundRecovery' },
  ]

  // 根据角色决定资产发行相关菜单项
  let assetIssuanceItems: typeof baseMenuItems = []
  if (currentRole === '建筑公司') {
    // 建筑公司显示两个独立菜单项
    assetIssuanceItems = [
      { id: 'receivables-management', labelKey: 'navigation.receivablesManagement', icon: 'fa-file-invoice-dollar', path: '/app/receivables-management', permission: 'assetIssuanceReceivable' },
      { id: 'inventory-issuance', labelKey: 'navigation.inventoryIssuance', icon: 'fa-boxes', path: '/app/inventory-issuance', permission: 'assetIssuanceInventory' },
    ]
  } else {
    // 其他角色显示原来的资产发行菜单
    assetIssuanceItems = [
      { id: 'asset-issuance', labelKey: 'navigation.assetIssuance', icon: 'fa-coins', path: '/app/asset-issuance', permission: 'assetIssuance' },
    ]
  }

  // 合并菜单项：仪表盘 -> 资产发行相关 -> 其他
  const menuItems = [
    baseMenuItems[0], // dashboard
    ...assetIssuanceItems,
    ...baseMenuItems.slice(1), // 其他菜单项
  ]

  if (!isOpen) return null

  const visibleMenuItems = menuItems.filter((item) =>
    hasPermission(currentRole, item.permission as any)
  )

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <nav className="p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}


export default Sidebar
