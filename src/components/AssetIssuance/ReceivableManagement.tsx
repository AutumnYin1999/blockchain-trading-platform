import { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface Receivable {
  id: string
  issuer: string
  amount: number
  dueDate: string
  status: 'pending' | 'received' | 'listed' | 'sold'
  receivedDate?: string
}

interface ReceivableManagementProps {
  onReceive: (id: string) => void
  onList: (id: string) => void
}

function ReceivableManagement({ onReceive, onList }: ReceivableManagementProps) {
  const { language } = useLanguage()
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'received'>('pending')

  // 模拟数据：待接收的应收账款（使用useMemo根据语言更新）
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

  // 模拟数据：已接收的应收账款（使用useMemo根据语言更新）
  const initialReceivedData = useMemo(() => [
    {
      id: 'AR-2024-100',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
      amount: 600000,
      dueDate: '2025-05-20',
      status: 'received' as const,
      receivedDate: '2024-12-15',
    },
    {
      id: 'AR-2024-101',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 400000,
      dueDate: '2025-04-10',
      status: 'listed' as const,
      receivedDate: '2024-12-10',
    },
  ], [language])

  const [receivedReceivables, setReceivedReceivables] = useState<Receivable[]>(initialReceivedData)

  // 当语言改变时，更新数据中的issuer字段
  useEffect(() => {
    setPendingReceivables(prev => prev.map((r, i) => ({
      ...r,
      issuer: initialPendingData[i]?.issuer || r.issuer
    })))
    setReceivedReceivables(prev => prev.map((r, i) => ({
      ...r,
      issuer: initialReceivedData[i]?.issuer || r.issuer
    })))
  }, [language, initialPendingData, initialReceivedData])

  const handleReceive = (id: string) => {
    const receivable = pendingReceivables.find(r => r.id === id)
    if (receivable) {
      // 从待接收列表移除
      setPendingReceivables(prev => prev.filter(r => r.id !== id))
      // 添加到已接收列表
      setReceivedReceivables(prev => [{
        ...receivable,
        status: 'received',
        receivedDate: new Date().toISOString().split('T')[0],
      }, ...prev])
      onReceive(id)
    }
  }

  const handleList = (id: string) => {
    setReceivedReceivables(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'listed' } : r
    ))
    onList(id)
    // 可以在这里添加跳转到市场页面的逻辑
  }

  const getStatusLabel = (status: string) => {
    if (language === 'zh') {
      switch (status) {
        case 'pending': return '待接收'
        case 'received': return '持有中'
        case 'listed': return '已上架'
        case 'sold': return '已售出'
        default: return status
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending'
        case 'received': return 'Holding'
        case 'listed': return 'Listed'
        case 'sold': return 'Sold'
        default: return status
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'listed': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {language === 'zh' ? '应收账款管理' : 'Accounts Receivable Management'}
        </h3>
      </div>

      {/* 子标签页 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('pending')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeSubTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          {language === 'zh' ? '待接收' : 'Pending'}
          {pendingReceivables.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
              {pendingReceivables.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('received')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeSubTab === 'received'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          {language === 'zh' ? '已接收' : 'Received'}
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {activeSubTab === 'pending' ? (
          <div className="space-y-3">
            {pendingReceivables.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p className="text-sm">{language === 'zh' ? '暂无待接收的应收账款' : 'No pending receivables'}</p>
              </div>
            ) : (
              pendingReceivables.map((receivable) => (
                <div
                  key={receivable.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-800">{receivable.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(receivable.status)}`}>
                          {getStatusLabel(receivable.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
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
                        <div className="col-span-2">
                          <span className="text-gray-500">
                            {language === 'zh' ? '到期日：' : 'Due Date: '}
                          </span>
                          <span className="font-medium text-gray-800">{receivable.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReceive(receivable.id)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    {language === 'zh' ? '接收' : 'Receive'}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {receivedReceivables.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p className="text-sm">{language === 'zh' ? '暂无已接收的应收账款' : 'No received receivables'}</p>
              </div>
            ) : (
              receivedReceivables.map((receivable) => (
                <div
                  key={receivable.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-800">{receivable.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(receivable.status)}`}>
                          {getStatusLabel(receivable.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
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
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    {receivable.status === 'received' && (
                      <button
                        onClick={() => handleList(receivable.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <i className="fas fa-arrow-up mr-2"></i>
                        {language === 'zh' ? '上架到市场' : 'List to Market'}
                      </button>
                    )}
                    <button
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      {language === 'zh' ? '查看' : 'View'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceivableManagement
