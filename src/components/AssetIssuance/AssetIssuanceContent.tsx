import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountsReceivableForm from './AccountsReceivableForm'
import InventoryForm from './InventoryForm'
import RecentIssuances from './RecentIssuances'
import { useRole } from '../../hooks/useRole'
import { useLanguage } from '../../hooks/useLanguage'
import PermissionGuard from '../Common/PermissionGuard'

type TabType = 'receivable' | 'inventory'

function AssetIssuanceContent() {
  const { currentRole, permissions } = useRole()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('receivable')
  const [recentIssuances, setRecentIssuances] = useState<any[]>([])
  const [inventoryTotal, setInventoryTotal] = useState(0)

  // 根据权限设置默认标签页
  useEffect(() => {
    if (permissions.assetIssuanceReceivable && !permissions.assetIssuanceInventory) {
      setActiveTab('receivable')
    } else if (permissions.assetIssuanceInventory && !permissions.assetIssuanceReceivable) {
      setActiveTab('inventory')
    }
  }, [permissions])

  const handleIssuanceSuccess = (issuance: any) => {
    setRecentIssuances(prev => [issuance, ...prev])
    // 如果是库存代币，更新库存总值
    if (issuance.type === t('assetIssuance.inventoryTab') || issuance.type.includes('库存') || issuance.type.includes('Inventory')) {
      setInventoryTotal(prev => prev + issuance.amount)
    }
  }

  const showTabs = permissions.assetIssuanceReceivable && permissions.assetIssuanceInventory

  // 建筑公司重定向到新页面
  if (currentRole === '建筑公司') {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="fas fa-info-circle text-4xl text-teal-600 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === 'zh' ? '页面已拆分' : 'Page Split'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'zh' 
              ? '建筑公司的资产发行功能已拆分为两个独立页面，请使用左侧导航菜单访问：' 
              : 'Asset issuance functions for construction companies have been split into two separate pages. Please use the left navigation menu:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/app/receivables-management')}
              className="p-6 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-left"
            >
              <i className="fas fa-file-invoice-dollar text-2xl text-teal-600 mb-2"></i>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'zh' ? '应收账款管理' : 'Receivables Management'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh' ? '管理从核心企业接收的应收账款代币' : 'Manage receivables received from core enterprises'}
              </p>
            </button>
            <button
              onClick={() => navigate('/app/inventory-issuance')}
              className="p-6 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-left"
            >
              <i className="fas fa-boxes text-2xl text-teal-600 mb-2"></i>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'zh' ? '库存代币发行' : 'Inventory Issuance'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh' ? '发行和管理库存代币' : 'Issue and manage inventory tokens'}
              </p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 核心企业保持原有布局
  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('assetIssuance.title')}</h2>
        <p className="text-gray-600">{t('assetIssuance.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：表单区域 */}
        <div className="lg:col-span-2">
          {/* 标签页 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {showTabs && (
              <div className="flex border-b border-gray-200">
                <PermissionGuard permission="assetIssuanceReceivable">
                  <button
                    onClick={() => setActiveTab('receivable')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'receivable'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <i className="fas fa-file-invoice-dollar mr-2"></i>
                    {t('assetIssuance.receivableTab')}
                  </button>
                </PermissionGuard>
                <PermissionGuard permission="assetIssuanceInventory">
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'inventory'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <i className="fas fa-boxes mr-2"></i>
                    {t('assetIssuance.inventoryTab')}
                  </button>
                </PermissionGuard>
              </div>
            )}

            {/* 表单内容 */}
            <div className="p-6">
              {permissions.assetIssuanceReceivable && activeTab === 'receivable' && (
                <AccountsReceivableForm onSuccess={handleIssuanceSuccess} />
              )}
              {permissions.assetIssuanceInventory && activeTab === 'inventory' && (
                <InventoryForm onSuccess={handleIssuanceSuccess} />
              )}
              {!permissions.assetIssuanceReceivable && !permissions.assetIssuanceInventory && (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-lock text-4xl mb-4"></i>
                  <p>{language === 'zh' ? '您没有资产发行权限' : 'You do not have asset issuance permission'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：最近发行的代币 */}
        <div className="lg:col-span-1">
          <RecentIssuances issuances={recentIssuances} />
        </div>
      </div>
    </div>
  )
}

export default AssetIssuanceContent
