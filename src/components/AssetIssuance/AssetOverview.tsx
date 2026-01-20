import { useLanguage } from '../../hooks/useLanguage'

interface AssetOverviewProps {
  pendingReceivablesTotal: number
  receivedReceivablesTotal: number
  inventoryTotal: number
  onBatchList: () => void
}

function AssetOverview({
  pendingReceivablesTotal,
  receivedReceivablesTotal,
  inventoryTotal,
  onBatchList,
}: AssetOverviewProps) {
  const { language } = useLanguage()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {language === 'zh' ? '资产概览' : 'Asset Overview'}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* 统计卡片 */}
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '待接收应收账款' : 'Pending Receivables'}
              </span>
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${(pendingReceivablesTotal / 1000).toFixed(1)}K eHKD
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '已持有应收账款' : 'Held Receivables'}
              </span>
              <i className="fas fa-wallet text-blue-600"></i>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${(receivedReceivablesTotal / 1000).toFixed(1)}K eHKD
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '库存代币总值' : 'Inventory Tokens Total'}
              </span>
              <i className="fas fa-boxes text-purple-600"></i>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${(inventoryTotal / 1000).toFixed(1)}K eHKD
            </div>
          </div>
        </div>

        {/* 批量操作按钮 */}
        <button
          onClick={onBatchList}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors shadow-sm"
        >
          <i className="fas fa-upload mr-2"></i>
          {language === 'zh' ? '批量上架所有资产' : 'Batch List All Assets'}
        </button>
      </div>
    </div>
  )
}

export default AssetOverview
