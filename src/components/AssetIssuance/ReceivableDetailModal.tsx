import { useLanguage } from '../../hooks/useLanguage'

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

interface ReceivableDetailModalProps {
  receivable: Receivable | null
  onClose: () => void
}

function ReceivableDetailModal({ receivable, onClose }: ReceivableDetailModalProps) {
  const { language } = useLanguage()

  if (!receivable) return null

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {language === 'zh' ? '应收账款详情' : 'Receivable Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'zh' ? '基本信息' : 'Basic Information'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{language === 'zh' ? '代币ID' : 'Token ID'}:</span>
                <span className="font-medium text-gray-800">{receivable.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{language === 'zh' ? '发行企业' : 'Issuer'}:</span>
                <span className="font-medium text-gray-800">{receivable.issuer}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{language === 'zh' ? '金额' : 'Amount'}:</span>
                <span className="font-medium text-gray-800">
                  {receivable.amount.toLocaleString()} eHKD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{language === 'zh' ? '到期日' : 'Due Date'}:</span>
                <span className="font-medium text-gray-800">{receivable.dueDate}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{language === 'zh' ? '状态' : 'Status'}:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(receivable.status)}`}>
                  {getStatusLabel(receivable.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 时间线 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'zh' ? '时间线' : 'Timeline'}
            </h4>
            <div className="space-y-3">
              {receivable.receivedDate && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {language === 'zh' ? '接收日期' : 'Received Date'}
                    </div>
                    <div className="text-sm text-gray-600">{receivable.receivedDate}</div>
                  </div>
                </div>
              )}
              {receivable.listedDate && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-arrow-up text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {language === 'zh' ? '上架日期' : 'Listed Date'}
                    </div>
                    <div className="text-sm text-gray-600">{receivable.listedDate}</div>
                  </div>
                </div>
              )}
              {receivable.soldDate && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-dollar-sign text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {language === 'zh' ? '售出日期' : 'Sold Date'}
                    </div>
                    <div className="text-sm text-gray-600">{receivable.soldDate}</div>
                  </div>
                </div>
              )}
              {!receivable.receivedDate && !receivable.listedDate && !receivable.soldDate && (
                <div className="text-center py-4 text-gray-500">
                  {language === 'zh' ? '暂无时间线记录' : 'No timeline records'}
                </div>
              )}
            </div>
          </div>

          {/* 计算信息 */}
          {receivable.receivedDate && receivable.dueDate && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {language === 'zh' ? '计算信息' : 'Calculation Information'}
              </h4>
              <div className="space-y-3">
                {(() => {
                  const received = new Date(receivable.receivedDate)
                  const due = new Date(receivable.dueDate)
                  const daysUntilDue = Math.ceil((due.getTime() - received.getTime()) / (1000 * 60 * 60 * 24))
                  const isOverdue = new Date() > due && receivable.status !== 'sold' && receivable.status !== 'settled'
                  
                  return (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">
                          {language === 'zh' ? '距离到期日' : 'Days Until Due'}:
                        </span>
                        <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                          {daysUntilDue > 0 ? `${daysUntilDue} ${language === 'zh' ? '天' : 'days'}` : language === 'zh' ? '已到期' : 'Overdue'}
                        </span>
                      </div>
                      {isOverdue && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-red-700">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span className="text-sm font-medium">
                              {language === 'zh' ? '此应收账款已过期' : 'This receivable is overdue'}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceivableDetailModal
