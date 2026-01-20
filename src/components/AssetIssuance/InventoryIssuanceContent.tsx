import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'
import InventoryForm from './InventoryForm'

interface InventoryToken {
  id: string
  type: 'raw' | 'wip' | 'finished'
  description: string
  valuation: number
  location: string
  quantity: number
  status: 'issued' | 'listed' | 'sold'
  issuedDate: string
  listedDate?: string
}

type InventoryViewType = 'all' | 'raw' | 'wip' | 'finished'

function InventoryIssuanceContent() {
  const { language } = useLanguage()
  const { currentRole } = useRole()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<InventoryViewType>('all')
  const [inventoryTokens, setInventoryTokens] = useState<InventoryToken[]>([
    {
      id: 'INV-2025-001',
      type: 'raw',
      description: language === 'zh' ? '钢材100吨' : 'Steel 100 tons',
      valuation: 500000,
      location: language === 'zh' ? '仓库A' : 'Warehouse A',
      quantity: 1,
      status: 'issued',
      issuedDate: '2025-01-10',
    },
    {
      id: 'INV-2025-002',
      type: 'wip',
      description: language === 'zh' ? '在建项目-办公楼' : 'Under Construction - Office Building',
      valuation: 1200000,
      location: language === 'zh' ? '工地B' : 'Site B',
      quantity: 1,
      status: 'listed',
      issuedDate: '2025-01-05',
      listedDate: '2025-01-08',
    },
    {
      id: 'INV-2025-003',
      type: 'finished',
      description: language === 'zh' ? '已完工住宅单元' : 'Completed Residential Units',
      valuation: 800000,
      location: language === 'zh' ? '仓库C' : 'Warehouse C',
      quantity: 1,
      status: 'issued',
      issuedDate: '2024-12-20',
    },
  ])
  const [inventoryTotal, setInventoryTotal] = useState(2500000)

  const handleIssuanceSuccess = (issuance: any) => {
    // 从issuance中提取信息创建新的库存代币
    const getTypeFromString = (typeStr: string): 'raw' | 'wip' | 'finished' => {
      if (typeStr === 'raw' || typeStr === '原材料') return 'raw'
      if (typeStr === 'wip' || typeStr === '在制品') return 'wip'
      if (typeStr === 'finished' || typeStr === '成品') return 'finished'
      return 'raw' // 默认
    }

    const newToken: InventoryToken = {
      id: issuance.id,
      type: getTypeFromString(issuance.inventoryType || 'raw'),
      description: issuance.description || '',
      valuation: issuance.amount,
      location: issuance.location || '',
      quantity: parseInt(issuance.quantity || '1'),
      status: issuance.status === 'Listed' || issuance.status === '已上架' || issuance.status === 'Listed' ? 'listed' : 'issued',
      issuedDate: new Date().toISOString().split('T')[0],
      listedDate: (issuance.status === 'Listed' || issuance.status === '已上架') ? new Date().toISOString().split('T')[0] : undefined,
    }
    setInventoryTokens(prev => [newToken, ...prev])
    setInventoryTotal(prev => prev + issuance.amount)
  }

  // 计算统计数据
  const stats = useMemo(() => {
    const total = inventoryTokens.reduce((sum, t) => sum + t.valuation, 0)
    const count = inventoryTokens.length
    const byType = {
      raw: inventoryTokens.filter(t => t.type === 'raw').reduce((sum, t) => sum + t.valuation, 0),
      wip: inventoryTokens.filter(t => t.type === 'wip').reduce((sum, t) => sum + t.valuation, 0),
      finished: inventoryTokens.filter(t => t.type === 'finished').reduce((sum, t) => sum + t.valuation, 0),
    }
    return { total, count, byType }
  }, [inventoryTokens])

  // 筛选数据
  const filteredTokens = useMemo(() => {
    if (activeView === 'all') return inventoryTokens
    return inventoryTokens.filter(t => t.type === activeView)
  }, [inventoryTokens, activeView])

  const getTypeLabel = (type: string) => {
    if (language === 'zh') {
      switch (type) {
        case 'raw': return '原材料'
        case 'wip': return '在制品'
        case 'finished': return '成品'
        default: return type
      }
    } else {
      switch (type) {
        case 'raw': return 'Raw Material'
        case 'wip': return 'Work in Progress'
        case 'finished': return 'Finished Product'
        default: return type
      }
    }
  }

  const getStatusLabel = (status: string) => {
    if (language === 'zh') {
      switch (status) {
        case 'issued': return '已发行'
        case 'listed': return '已上架'
        case 'sold': return '已售出'
        default: return status
      }
    } else {
      switch (status) {
        case 'issued': return 'Issued'
        case 'listed': return 'Listed'
        case 'sold': return 'Sold'
        default: return status
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-blue-100 text-blue-800'
      case 'listed': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleList = (id: string) => {
    setInventoryTokens(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'listed' as const, listedDate: new Date().toISOString().split('T')[0] } : t
    ))
  }

  const handleUnlist = (id: string) => {
    setInventoryTokens(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'issued' as const, listedDate: undefined } : t
    ))
  }

  // 如果不是建筑公司，显示无权限
  if (currentRole !== '建筑公司') {
    return (
      <div className="p-6 text-center py-12 text-gray-500">
        <i className="fas fa-lock text-4xl mb-4"></i>
        <p>{language === 'zh' ? '您没有权限访问此页面' : 'You do not have permission to access this page'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'zh' ? '库存代币发行' : 'Inventory Token Issuance'}
          </h2>
          <p className="text-gray-600">
            {language === 'zh' ? '发行和管理库存代币' : 'Issue and manage inventory tokens'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-home mr-2"></i>
            {language === 'zh' ? '返回仪表盘' : 'Back to Dashboard'}
          </button>
          <button
            onClick={() => navigate('/app/market-trading')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            {language === 'zh' ? '查看市场' : 'View Market'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧（60%）：发行表单 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'zh' ? '发行库存代币' : 'Issue Inventory Token'}
              </h3>
            </div>
            <div className="p-6">
              <InventoryForm onSuccess={handleIssuanceSuccess} />
            </div>
          </div>
        </div>

        {/* 右侧（40%）：我的库存 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'zh' ? '我的库存' : 'My Inventory'}
              </h3>
            </div>

            {/* 统计卡片 */}
            <div className="p-4 space-y-3 border-b border-gray-200">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {language === 'zh' ? '总估值' : 'Total Valuation'}
                  </span>
                  <i className="fas fa-dollar-sign text-purple-600"></i>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  ${(stats.total / 1000).toFixed(1)}K eHKD
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {language === 'zh' ? '库存数量' : 'Inventory Count'}
                  </span>
                  <i className="fas fa-boxes text-blue-600"></i>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.count} {language === 'zh' ? '项' : 'items'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-gray-500">{language === 'zh' ? '原材料' : 'Raw'}</div>
                  <div className="font-semibold text-gray-800">${(stats.byType.raw / 1000).toFixed(0)}K</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-gray-500">{language === 'zh' ? '在制品' : 'WIP'}</div>
                  <div className="font-semibold text-gray-800">${(stats.byType.wip / 1000).toFixed(0)}K</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-gray-500">{language === 'zh' ? '成品' : 'Finished'}</div>
                  <div className="font-semibold text-gray-800">${(stats.byType.finished / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>

            {/* 视图切换 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-2">
                {(['all', 'raw', 'wip', 'finished'] as InventoryViewType[]).map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === view
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {view === 'all' && (language === 'zh' ? '全部' : 'All')}
                    {view === 'raw' && (language === 'zh' ? '原材料' : 'Raw')}
                    {view === 'wip' && (language === 'zh' ? '在制品' : 'WIP')}
                    {view === 'finished' && (language === 'zh' ? '成品' : 'Finished')}
                  </button>
                ))}
              </div>
            </div>

            {/* 库存列表 */}
            <div className="p-4 max-h-[calc(100vh-30rem)] overflow-y-auto">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                  <p className="text-xs">
                    {language === 'zh' ? '暂无库存代币' : 'No inventory tokens'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTokens.map((token) => (
                    <div
                      key={token.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm text-gray-800">{token.id}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              token.type === 'raw' ? 'bg-blue-100 text-blue-700' :
                              token.type === 'wip' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {getTypeLabel(token.type)}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(token.status)}`}>
                              {getStatusLabel(token.status)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{token.description}</div>
                          <div className="text-xs text-gray-500">
                            {token.valuation.toLocaleString()} eHKD · {token.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        {token.status === 'issued' && (
                          <button
                            onClick={() => handleList(token.id)}
                            className="flex-1 bg-teal-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-teal-700 transition-colors"
                          >
                            <i className="fas fa-arrow-up mr-1"></i>
                            {language === 'zh' ? '上架' : 'List'}
                          </button>
                        )}
                        {token.status === 'listed' && (
                          <button
                            onClick={() => handleUnlist(token.id)}
                            className="flex-1 bg-gray-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                          >
                            <i className="fas fa-arrow-down mr-1"></i>
                            {language === 'zh' ? '下架' : 'Unlist'}
                          </button>
                        )}
                        <button
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-eye mr-1"></i>
                          {language === 'zh' ? '查看' : 'View'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部：市场热度 */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {language === 'zh' ? '市场热度' : 'Market Trends'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '类似库存市场价格参考' : 'Similar Inventory Market Prices'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{language === 'zh' ? '钢材（100吨）' : 'Steel (100 tons)'}</span>
                <span className="font-medium text-gray-800">$480K - $520K eHKD</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{language === 'zh' ? '在建办公楼' : 'Office Building (WIP)'}</span>
                <span className="font-medium text-gray-800">$1.1M - $1.3M eHKD</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{language === 'zh' ? '已完工住宅' : 'Completed Residential'}</span>
                <span className="font-medium text-gray-800">$750K - $850K eHKD</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '近期询价记录' : 'Recent Inquiries'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">INV-2025-002</span>
                  <span className="text-gray-500 text-xs">2小时前</span>
                </div>
                <div className="text-gray-600 text-xs">
                  {language === 'zh' ? '询价：$1.15M eHKD' : 'Inquiry: $1.15M eHKD'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">INV-2025-001</span>
                  <span className="text-gray-500 text-xs">5小时前</span>
                </div>
                <div className="text-gray-600 text-xs">
                  {language === 'zh' ? '询价：$490K eHKD' : 'Inquiry: $490K eHKD'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryIssuanceContent
