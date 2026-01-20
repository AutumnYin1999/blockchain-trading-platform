import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

interface ListedToken {
  id: string
  type: 'receivable' | 'inventory'
  faceValue: number
  listedPrice: number
  listedDate: string
  inquiryCount: number
  status: 'selling'
  // 应收账款特有
  dueDate?: string
  issuer?: string
  // 库存特有
  inventoryType?: string
  description?: string
  location?: string
}

interface SaleRecord {
  tokenId: string
  buyer: string
  salePrice: number
  saleDate: string
  commission: number
}

type TabType = 'receivable' | 'inventory'

function MyListingsContent() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('receivable')
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [newPrice, setNewPrice] = useState('')

  // 模拟数据：在售的应收账款代币
  const receivableTokens: ListedToken[] = [
    {
      id: 'AR-2024-101',
      type: 'receivable',
      faceValue: 400000,
      listedPrice: 395000,
      listedDate: '2024-12-20',
      inquiryCount: 5,
      status: 'selling',
      dueDate: '2025-04-10',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
    },
    {
      id: 'AR-2024-100',
      type: 'receivable',
      faceValue: 600000,
      listedPrice: 590000,
      listedDate: '2024-12-15',
      inquiryCount: 8,
      status: 'selling',
      dueDate: '2025-05-20',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
    },
  ]

  // 模拟数据：在售的库存代币
  const inventoryTokens: ListedToken[] = [
    {
      id: 'INV-2025-002',
      type: 'inventory',
      faceValue: 1200000,
      listedPrice: 1180000,
      listedDate: '2025-01-08',
      inquiryCount: 3,
      status: 'selling',
      inventoryType: language === 'zh' ? '在制品' : 'Work in Progress',
      description: language === 'zh' ? '在建项目-办公楼' : 'Under Construction - Office Building',
      location: language === 'zh' ? '工地B' : 'Site B',
    },
  ]

  // 模拟数据：销售记录
  const saleRecords: SaleRecord[] = [
    {
      tokenId: 'AR-2024-050',
      buyer: language === 'zh' ? 'NBFI机构A' : 'NBFI Institution A',
      salePrice: 195000,
      saleDate: '2024-12-01',
      commission: 1950,
    },
    {
      tokenId: 'INV-2024-120',
      buyer: language === 'zh' ? 'NBFI机构B' : 'NBFI Institution B',
      salePrice: 285000,
      saleDate: '2024-11-25',
      commission: 2850,
    },
    {
      tokenId: 'AR-2024-045',
      buyer: language === 'zh' ? 'NBFI机构C' : 'NBFI Institution C',
      salePrice: 480000,
      saleDate: '2024-11-20',
      commission: 4800,
    },
  ]

  // 计算销售统计
  const salesStats = useMemo(() => {
    const totalSales = saleRecords.reduce((sum, r) => sum + r.salePrice, 0)
    const totalCommission = saleRecords.reduce((sum, r) => sum + r.commission, 0)
    const avgDiscount = saleRecords.length > 0
      ? saleRecords.reduce((sum, r) => {
          // 假设面值，计算平均折扣率
          const discount = ((r.salePrice / (r.salePrice + r.commission)) - 1) * 100
          return sum + Math.abs(discount)
        }, 0) / saleRecords.length
      : 0

    return { totalSales, totalCommission, avgDiscount }
  }, [saleRecords])

  const currentTokens = activeTab === 'receivable' ? receivableTokens : inventoryTokens

  const handleModifyPrice = (token: ListedToken) => {
    setSelectedToken(token)
    setNewPrice(token.listedPrice.toString())
    setShowPriceModal(true)
  }

  const handleConfirmPrice = () => {
    if (selectedToken && newPrice) {
      // 这里应该更新代币价格
      console.log('Update price:', selectedToken.id, newPrice)
      setShowPriceModal(false)
      setSelectedToken(null)
      setNewPrice('')
    }
  }

  const handleUnlist = (tokenId: string) => {
    // 这里应该下架代币
    console.log('Unlist token:', tokenId)
  }

  const handleViewDetail = (token: ListedToken) => {
    // 显示详情弹窗
    console.log('View detail:', token.id)
  }

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'zh' ? '我的在售资产' : 'My Listed Assets'}
          </h2>
          <p className="text-gray-600">
            {language === 'zh' ? '管理已上架待售的代币，查看销售状态' : 'Manage listed tokens for sale and view sales status'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/app/receivables-management')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-arrow-up mr-2"></i>
            {language === 'zh' ? '快速上架应收账款' : 'Quick List Receivables'}
          </button>
          <button
            onClick={() => navigate('/app/inventory-issuance')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-boxes mr-2"></i>
            {language === 'zh' ? '快速上架库存' : 'Quick List Inventory'}
          </button>
        </div>
      </div>

      {/* 资金回收提示 */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {language === 'zh' ? '资金回收效率' : 'Fund Recovery Efficiency'}
            </h3>
            <p className="text-gray-600">
              {language === 'zh' 
                ? `通过出售代票，您已提前回笼资金 ${salesStats.totalSales.toLocaleString()} eHKD`
                : `Through token sales, you have recovered ${salesStats.totalSales.toLocaleString()} eHKD in advance`}
            </p>
          </div>
          <div className="text-3xl font-bold text-teal-600">
            {salesStats.totalSales > 0 ? `$${(salesStats.totalSales / 1000).toFixed(0)}K` : '$0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：在售资产列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 标签页 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('receivable')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'receivable'
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-file-invoice-dollar mr-2"></i>
                {language === 'zh' ? '应收账款代币' : 'Receivable Tokens'}
                <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">
                  {receivableTokens.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'inventory'
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-boxes mr-2"></i>
                {language === 'zh' ? '库存代币' : 'Inventory Tokens'}
                <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">
                  {inventoryTokens.length}
                </span>
              </button>
            </div>

            {/* 列表内容 */}
            <div className="p-6">
              {currentTokens.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <p className="text-sm">
                    {language === 'zh' ? '暂无在售的代币' : 'No tokens on sale'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTokens.map((token) => (
                    <div
                      key={token.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-800">{token.id}</span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {language === 'zh' ? '出售中' : 'Selling'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">
                                {language === 'zh' ? '面值/估值：' : 'Face Value/Valuation: '}
                              </span>
                              <span className="font-medium text-gray-800">
                                {token.faceValue.toLocaleString()} eHKD
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {language === 'zh' ? '上架价格：' : 'Listed Price: '}
                              </span>
                              <span className="font-medium text-gray-800">
                                {token.listedPrice.toLocaleString()} eHKD
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {language === 'zh' ? '上架时间：' : 'Listed Date: '}
                              </span>
                              <span className="font-medium text-gray-800">{token.listedDate}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {language === 'zh' ? '询价次数：' : 'Inquiries: '}
                              </span>
                              <span className="font-medium text-gray-800">{token.inquiryCount}</span>
                            </div>
                            {token.type === 'receivable' && token.dueDate && (
                              <div>
                                <span className="text-gray-500">
                                  {language === 'zh' ? '到期日：' : 'Due Date: '}
                                </span>
                                <span className="font-medium text-gray-800">{token.dueDate}</span>
                              </div>
                            )}
                            {token.type === 'receivable' && token.issuer && (
                              <div>
                                <span className="text-gray-500">
                                  {language === 'zh' ? '发行企业：' : 'Issuer: '}
                                </span>
                                <span className="font-medium text-gray-800">{token.issuer}</span>
                              </div>
                            )}
                            {token.type === 'inventory' && token.inventoryType && (
                              <div>
                                <span className="text-gray-500">
                                  {language === 'zh' ? '类型：' : 'Type: '}
                                </span>
                                <span className="font-medium text-gray-800">{token.inventoryType}</span>
                              </div>
                            )}
                            {token.type === 'inventory' && token.description && (
                              <div>
                                <span className="text-gray-500">
                                  {language === 'zh' ? '描述：' : 'Description: '}
                                </span>
                                <span className="font-medium text-gray-800">{token.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleModifyPrice(token)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          {language === 'zh' ? '修改价格' : 'Modify Price'}
                        </button>
                        <button
                          onClick={() => handleUnlist(token.id)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm"
                        >
                          <i className="fas fa-arrow-down mr-2"></i>
                          {language === 'zh' ? '下架' : 'Unlist'}
                        </button>
                        <button
                          onClick={() => handleViewDetail(token)}
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
        </div>

        {/* 右侧：销售记录与统计 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 销售统计 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'zh' ? '销售统计' : 'Sales Statistics'}
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {language === 'zh' ? '累计成交额' : 'Total Sales'}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {salesStats.totalSales.toLocaleString()} eHKD
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {language === 'zh' ? '累计支付佣金' : 'Total Commission Paid'}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {salesStats.totalCommission.toLocaleString()} eHKD
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {language === 'zh' ? '平均售出折扣率' : 'Avg. Discount Rate'}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {salesStats.avgDiscount.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* 近期成交记录 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'zh' ? '近期成交记录' : 'Recent Sales'}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {saleRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                  <p className="text-xs">{language === 'zh' ? '暂无成交记录' : 'No sales records'}</p>
                </div>
              ) : (
                saleRecords.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-800">{record.tokenId}</span>
                      <span className="text-xs text-gray-500">{record.saleDate}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'zh' ? '买方：' : 'Buyer: '}
                        </span>
                        <span className="font-medium text-gray-800">{record.buyer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'zh' ? '成交价格：' : 'Sale Price: '}
                        </span>
                        <span className="font-medium text-gray-800">
                          {record.salePrice.toLocaleString()} eHKD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'zh' ? '平台佣金：' : 'Commission: '}
                        </span>
                        <span className="font-medium text-gray-800">
                          {record.commission.toLocaleString()} eHKD
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 修改价格弹窗 */}
      {showPriceModal && selectedToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPriceModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'zh' ? '修改价格' : 'Modify Price'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '代币ID' : 'Token ID'}
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{selectedToken.id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '当前价格' : 'Current Price'}
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                  {selectedToken.listedPrice.toLocaleString()} eHKD
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '新价格' : 'New Price'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={language === 'zh' ? '请输入新价格' : 'Enter new price'}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowPriceModal(false)
                  setSelectedToken(null)
                  setNewPrice('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmPrice}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                {language === 'zh' ? '确认修改' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListingsContent
