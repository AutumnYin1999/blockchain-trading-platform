import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'
import ReceivableDetailModal from './ReceivableDetailModal'

interface Receivable {
  id: string
  issuer: string
  amount: number
  dueDate: string
  status: 'pending' | 'received' | 'listed' | 'sold' | 'settled'
  receivedDate?: string
  listedDate?: string
  soldDate?: string
}

type TabType = 'pending' | 'received' | 'listed' | 'history'

function ReceivablesManagementContent() {
  const { language } = useLanguage()
  const { currentRole } = useRole()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIssuer, setFilterIssuer] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null)

  // 模拟数据：待接收的应收账款
  const initialPendingData = useMemo(() => [
    {
      id: 'AR-2025-001',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 500000,
      dueDate: '2025-06-30',
      status: 'pending' as const,
    },
    {
      id: 'AR-2025-002',
      issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B',
      amount: 300000,
      dueDate: '2025-07-15',
      status: 'pending' as const,
    },
    {
      id: 'AR-2025-003',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 800000,
      dueDate: '2025-08-01',
      status: 'pending' as const,
    },
  ], [language])

  const [pendingReceivables, setPendingReceivables] = useState<Receivable[]>(initialPendingData)
  const [receivedReceivables, setReceivedReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2024-100',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
      amount: 600000,
      dueDate: '2025-05-20',
      status: 'received' as const,
      receivedDate: '2024-12-15',
    },
  ])
  const [listedReceivables, setListedReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2024-101',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 400000,
      dueDate: '2025-04-10',
      status: 'listed' as const,
      receivedDate: '2024-12-10',
      listedDate: '2024-12-20',
    },
  ])
  const [historyReceivables, setHistoryReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2024-050',
      issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B',
      amount: 200000,
      dueDate: '2024-12-31',
      status: 'sold' as const,
      receivedDate: '2024-11-01',
      listedDate: '2024-11-15',
      soldDate: '2024-12-01',
    },
  ])

  // 当语言改变时更新数据
  useEffect(() => {
    setPendingReceivables(prev => prev.map((r, i) => ({
      ...r,
      issuer: initialPendingData[i]?.issuer || r.issuer
    })))
  }, [language, initialPendingData])

  // 获取所有发行企业列表（用于筛选）
  const allIssuers = useMemo(() => {
    const issuers = new Set<string>()
    const allReceivables = [
      ...pendingReceivables,
      ...receivedReceivables,
      ...listedReceivables,
      ...historyReceivables
    ]
    allReceivables.forEach(r => {
      issuers.add(r.issuer)
    })
    return Array.from(issuers)
  }, [pendingReceivables, receivedReceivables, listedReceivables, historyReceivables])

  // 计算统计数据
  const stats = useMemo(() => {
    const pendingTotal = pendingReceivables.reduce((sum, r) => sum + r.amount, 0)
    const receivedTotal = receivedReceivables.reduce((sum, r) => sum + r.amount, 0)
    const listedTotal = listedReceivables.reduce((sum, r) => sum + r.amount, 0)
    
    // 计算平均回款周期（已售出的应收账款）
    const soldItems = historyReceivables.filter(r => r.status === 'sold' && r.receivedDate && r.soldDate)
    const avgDays = soldItems.length > 0
      ? Math.round(soldItems.reduce((sum, r) => {
          const received = new Date(r.receivedDate!)
          const sold = new Date(r.soldDate!)
          return sum + (sold.getTime() - received.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / soldItems.length)
      : 0

    return { pendingTotal, receivedTotal, listedTotal, avgDays }
  }, [pendingReceivables, receivedReceivables, listedReceivables, historyReceivables])

  // 筛选数据
  const getFilteredData = (data: Receivable[]) => {
    return data.filter(r => {
      const matchSearch = !searchTerm || r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchIssuer = !filterIssuer || r.issuer === filterIssuer
      const matchDate = !dateRange.start || !dateRange.end || 
                       (r.dueDate >= dateRange.start && r.dueDate <= dateRange.end)
      return matchSearch && matchIssuer && matchDate
    })
  }

  const handleReceive = (id: string) => {
    const receivable = pendingReceivables.find(r => r.id === id)
    if (receivable) {
      setPendingReceivables(prev => prev.filter(r => r.id !== id))
      setReceivedReceivables(prev => [{
        ...receivable,
        status: 'received',
        receivedDate: new Date().toISOString().split('T')[0],
      }, ...prev])
      setActiveTab('received')
    }
  }

  const handleBatchReceive = () => {
    const toReceive = pendingReceivables.filter(r => selectedItems.includes(r.id))
    const now = new Date().toISOString().split('T')[0]
    setPendingReceivables(prev => prev.filter(r => !selectedItems.includes(r.id)))
    setReceivedReceivables(prev => [
      ...toReceive.map(r => ({
        ...r,
        status: 'received' as const,
        receivedDate: now,
      })),
      ...prev
    ])
    setSelectedItems([])
    setActiveTab('received')
  }

  const handleList = (id: string) => {
    const receivable = receivedReceivables.find(r => r.id === id)
    if (receivable) {
      setReceivedReceivables(prev => prev.filter(r => r.id !== id))
      setListedReceivables(prev => [{
        ...receivable,
        status: 'listed',
        listedDate: new Date().toISOString().split('T')[0],
      }, ...prev])
      setActiveTab('listed')
    }
  }

  const handleBatchList = () => {
    const toList = receivedReceivables.filter(r => selectedItems.includes(r.id))
    const now = new Date().toISOString().split('T')[0]
    setReceivedReceivables(prev => prev.filter(r => !selectedItems.includes(r.id)))
    setListedReceivables(prev => [
      ...toList.map(r => ({
        ...r,
        status: 'listed' as const,
        listedDate: now,
      })),
      ...prev
    ])
    setSelectedItems([])
    setActiveTab('listed')
  }

  const getStatusLabel = (status: string) => {
    if (language === 'zh') {
      switch (status) {
        case 'pending': return '待接收'
        case 'received': return '持有中'
        case 'listed': return '已上架'
        case 'sold': return '已售出'
        case 'settled': return '已结清'
        default: return status
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending'
        case 'received': return 'Holding'
        case 'listed': return 'Listed'
        case 'sold': return 'Sold'
        case 'settled': return 'Settled'
        default: return status
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'listed': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-purple-100 text-purple-800'
      case 'settled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentData = activeTab === 'pending' ? pendingReceivables :
                     activeTab === 'received' ? receivedReceivables :
                     activeTab === 'listed' ? listedReceivables :
                     historyReceivables

  const filteredData = getFilteredData(currentData)

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
            {language === 'zh' ? '应收账款管理' : 'Accounts Receivable Management'}
          </h2>
          <p className="text-gray-600">
            {language === 'zh' ? '管理从核心企业接收的应收账款代币' : 'Manage accounts receivable tokens received from core enterprises'}
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

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '待接收总额' : 'Pending Total'}
            </span>
            <i className="fas fa-clock text-yellow-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${(stats.pendingTotal / 1000).toFixed(1)}K eHKD
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '已持有总额' : 'Held Total'}
            </span>
            <i className="fas fa-wallet text-blue-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${(stats.receivedTotal / 1000).toFixed(1)}K eHKD
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '平均回款周期' : 'Avg. Collection Period'}
            </span>
            <i className="fas fa-calendar-alt text-green-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.avgDays} {language === 'zh' ? '天' : 'days'}
          </div>
        </div>
      </div>

      {/* 搜索与筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder={language === 'zh' ? '搜索代币ID或发行企业...' : 'Search token ID or issuer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <select
              value={filterIssuer}
              onChange={(e) => setFilterIssuer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{language === 'zh' ? '所有发行企业' : 'All Issuers'}</option>
              {allIssuers.map(issuer => (
                <option key={issuer} value={issuer}>{issuer}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="date"
              placeholder={language === 'zh' ? '起始日期' : 'Start Date'}
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <input
              type="date"
              placeholder={language === 'zh' ? '结束日期' : 'End Date'}
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          {(['pending', 'received', 'listed', 'history'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSelectedItems([])
              }}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab === 'pending' && (language === 'zh' ? '待接收' : 'Pending')}
              {tab === 'received' && (language === 'zh' ? '已接收' : 'Received')}
              {tab === 'listed' && (language === 'zh' ? '已上架' : 'Listed')}
              {tab === 'history' && (language === 'zh' ? '历史记录' : 'History')}
              {tab === 'pending' && pendingReceivables.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                  {pendingReceivables.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 批量操作栏 */}
        {selectedItems.length > 0 && (
          <div className="p-4 bg-teal-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {language === 'zh' ? `已选择 ${selectedItems.length} 项` : `${selectedItems.length} items selected`}
            </span>
            <div className="flex space-x-2">
              {activeTab === 'pending' && (
                <button
                  onClick={handleBatchReceive}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  {language === 'zh' ? '批量接收' : 'Batch Receive'}
                </button>
              )}
              {activeTab === 'received' && (
                <button
                  onClick={handleBatchList}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <i className="fas fa-arrow-up mr-2"></i>
                  {language === 'zh' ? '批量上架' : 'Batch List'}
                </button>
              )}
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {language === 'zh' ? '取消选择' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-6 max-h-[calc(100vh-30rem)] overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
              <p className="text-sm">
                {language === 'zh' ? `暂无${getStatusLabel(activeTab === 'history' ? 'history' : currentData[0]?.status || '')}的应收账款` : `No ${getStatusLabel(activeTab === 'history' ? 'history' : currentData[0]?.status || '')} receivables`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((receivable) => (
                <div
                  key={receivable.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    selectedItems.includes(receivable.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {(activeTab === 'pending' || activeTab === 'received') && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(receivable.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(prev => [...prev, receivable.id])
                          } else {
                            setSelectedItems(prev => prev.filter(id => id !== receivable.id))
                          }
                        }}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">{receivable.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(receivable.status)}`}>
                            {getStatusLabel(receivable.status)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">
                            {language === 'zh' ? '发行企业：' : 'Issuer: '}
                          </span>
                          <span className="font-medium text-gray-800">{receivable.issuer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {language === 'zh' ? '金额：' : 'Amount: '}
                          </span>
                          <span className="font-medium text-gray-800">
                            {receivable.amount.toLocaleString()} eHKD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {language === 'zh' ? '到期日：' : 'Due Date: '}
                          </span>
                          <span className="font-medium text-gray-800">{receivable.dueDate}</span>
                        </div>
                        {receivable.receivedDate && (
                          <div>
                            <span className="text-gray-500">
                              {language === 'zh' ? '接收日期：' : 'Received: '}
                            </span>
                            <span className="font-medium text-gray-800">{receivable.receivedDate}</span>
                          </div>
                        )}
                        {receivable.listedDate && (
                          <div>
                            <span className="text-gray-500">
                              {language === 'zh' ? '上架日期：' : 'Listed: '}
                            </span>
                            <span className="font-medium text-gray-800">{receivable.listedDate}</span>
                          </div>
                        )}
                        {receivable.soldDate && (
                          <div>
                            <span className="text-gray-500">
                              {language === 'zh' ? '售出日期：' : 'Sold: '}
                            </span>
                            <span className="font-medium text-gray-800">{receivable.soldDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    {receivable.status === 'pending' && (
                      <button
                        onClick={() => handleReceive(receivable.id)}
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
                      >
                        <i className="fas fa-check-circle mr-2"></i>
                        {language === 'zh' ? '接收' : 'Receive'}
                      </button>
                    )}
                    {receivable.status === 'received' && (
                      <button
                        onClick={() => handleList(receivable.id)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        <i className="fas fa-arrow-up mr-2"></i>
                        {language === 'zh' ? '上架到市场' : 'List to Market'}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedReceivable(receivable)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      {language === 'zh' ? '查看详情' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedReceivable && (
        <ReceivableDetailModal
          receivable={selectedReceivable}
          onClose={() => setSelectedReceivable(null)}
        />
      )}
    </div>
  )
}

export default ReceivablesManagementContent
