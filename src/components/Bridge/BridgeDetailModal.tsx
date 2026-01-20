import { useLanguage } from '../../hooks/useLanguage'

interface BridgeRecord {
  id: string
  absId: string
  targetChain: string
  quantity: number
  value: number
  status: '进行中' | '完成' | '失败'
  timestamp: string
  txHash?: string
}

interface BridgeDetailModalProps {
  bridge: BridgeRecord
  onClose: () => void
}

function BridgeDetailModal({ bridge, onClose }: BridgeDetailModalProps) {
  const { t, language } = useLanguage()
  
  const getStatusColor = (status: string) => {
    const completed = t('bridge.completed')
    const inProgress = t('bridge.inProgress')
    const failed = t('bridge.failed')
    
    if (status === '完成' || status === completed) {
      return 'bg-green-100 text-green-700'
    }
    if (status === '进行中' || status === inProgress) {
      return 'bg-orange-100 text-orange-700'
    }
    if (status === '失败' || status === failed) {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-gray-100 text-gray-700'
  }
  
  const getStatusText = (status: string) => {
    if (status === '完成') return t('bridge.completed')
    if (status === '进行中') return t('bridge.inProgress')
    if (status === '失败') return t('bridge.failed')
    return status
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('bridge.viewDetail')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.basicInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.bridgeId')}:</span>
                <span className="font-medium text-gray-800">{bridge.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">ABS ID:</span>
                <span className="font-medium text-gray-800">{bridge.absId}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.targetChain')}:</span>
                <span className="font-medium text-gray-800">{bridge.targetChain}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.status')}:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bridge.status)}`}>
                  {getStatusText(bridge.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 桥接详情 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.bridgeDetails')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.bridgeQuantity')}:</span>
                <span className="font-medium text-gray-800">{bridge.quantity}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.totalValue')}:</span>
                <span className="font-medium text-gray-800">
                  {bridge.value.toLocaleString()} eHKD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.timestamp')}:</span>
                <span className="font-medium text-gray-800">{bridge.timestamp}</span>
              </div>
            </div>
          </div>

          {/* 交易哈希 */}
          {bridge.txHash && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.transactionInfo')}</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">{t('bridge.transactionHash')}:</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 font-mono text-sm text-gray-800 break-all">
                    {bridge.txHash}
                  </code>
                  <a
                    href={`https://etherscan.io/tx/${bridge.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    {t('bridge.viewOnExplorer')} <i className="fas fa-external-link-alt text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 进度信息（如果进行中） */}
          {(bridge.status === '进行中' || bridge.status === t('bridge.inProgress')) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.progress')}</h4>
              <div className="space-y-3">
                {[
                  { 
                    stepText: language === 'zh' ? '发起桥接请求' : 'Initiate Bridge Request', 
                    completed: true, 
                    time: bridge.timestamp 
                  },
                  { 
                    stepText: language === 'zh' ? '联盟链确认' : 'Alliance Chain Confirmation', 
                    completed: true, 
                    progress: `5/12 ${language === 'zh' ? '区块' : 'blocks'}` 
                  },
                  { 
                    stepText: language === 'zh' ? '跨链中' : 'Cross-Chaining', 
                    completed: false, 
                    progress: language === 'zh' ? '进行中' : 'In Progress' 
                  },
                  { 
                    stepText: language === 'zh' ? '目标链确认' : 'Target Chain Confirmation', 
                    completed: false 
                  },
                  { 
                    stepText: language === 'zh' ? '完成' : 'Completed', 
                    completed: false 
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {item.completed ? (
                        <i className="fas fa-check text-sm"></i>
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.stepText}</div>
                      {item.progress && (
                        <div className="text-sm text-gray-600">{item.progress}</div>
                      )}
                      {item.time && (
                        <div className="text-sm text-gray-600">{item.time}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BridgeDetailModal
