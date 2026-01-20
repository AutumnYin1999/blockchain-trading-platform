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

interface BridgeHistoryProps {
  history: BridgeRecord[]
  onViewDetail: (bridge: BridgeRecord) => void
}

function BridgeHistory({ history, onViewDetail }: BridgeHistoryProps) {
  const { t, language } = useLanguage()
  const inProgress = t('bridge.inProgress')
  const completed = t('bridge.completed')
  const failed = t('bridge.failed')
  
  const activeBridges = history.filter((b) => b.status === '进行中' || b.status === inProgress)
  const completedBridges = history.filter((b) => b.status === '完成' || b.status === completed)

  const getStatusColor = (status: string) => {
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
    if (status === '进行中') return inProgress
    if (status === '完成') return completed
    if (status === '失败') return failed
    return status
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{t('bridge.bridgeHistory')}</h3>
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded active">
            {inProgress}
          </button>
          <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            {language === 'zh' ? '历史' : 'History'}
          </button>
        </div>
      </div>

      {/* 进行中的桥接 */}
      {activeBridges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t('bridge.inProgress')}</h4>
          {activeBridges.map((bridge) => (
            <div key={bridge.id} className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">{bridge.absId}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(bridge.status)}`}>
                  {getStatusText(bridge.status)}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <div>{language === 'zh' ? '目标链' : 'Target Chain'}: {bridge.targetChain}</div>
                <div>{language === 'zh' ? '数量' : 'Quantity'}: {bridge.quantity}</div>
                <div>{language === 'zh' ? '价值' : 'Value'}: {bridge.value.toLocaleString()} eHKD</div>
              </div>
              {/* 进度条 */}
              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{language === 'zh' ? '链确认中' : 'Chain Confirming'} (5/12 {language === 'zh' ? '区块' : 'blocks'})</div>
              </div>
              <button
                onClick={() => onViewDetail(bridge)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {t('bridge.viewDetail')} →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 历史记录 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">{language === 'zh' ? '历史' : 'History'}</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {completedBridges.map((bridge) => (
            <div
              key={bridge.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
              onClick={() => onViewDetail(bridge)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-800">{bridge.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(bridge.status)}`}>
                  {getStatusText(bridge.status)}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>{bridge.absId}</div>
                <div>{bridge.targetChain} · {bridge.quantity}</div>
                <div className="text-gray-500">{bridge.timestamp}</div>
              </div>
              {bridge.txHash && (
                <div className="mt-2 text-xs">
                  <a
                    href={`https://etherscan.io/tx/${bridge.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('bridge.viewTransaction')} <i className="fas fa-external-link-alt text-[10px]"></i>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BridgeHistory
