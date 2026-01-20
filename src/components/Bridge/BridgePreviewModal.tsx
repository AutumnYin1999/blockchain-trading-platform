import { useLanguage } from '../../hooks/useLanguage'

interface BridgeableAsset {
  id: string
  absId: string
  type: 'receivable' | 'inventory' // 改为英文键值
  tranche: 'Senior' | 'Mezzanine' | 'Junior'
  value: number
  quantity: number
  riskRating: string
  selected: boolean
  bridgeQuantity: number
}

interface BridgePreviewModalProps {
  selectedAssets: BridgeableAsset[]
  targetChain: string
  recipientAddress: string
  totalValue: number
  bridgeFee: number
  estimatedReceived: number
  onConfirm: () => void
  onClose: () => void
}

function BridgePreviewModal({
  selectedAssets,
  targetChain,
  recipientAddress,
  totalValue,
  bridgeFee,
  estimatedReceived,
  onConfirm,
  onClose,
}: BridgePreviewModalProps) {
  const { t, language } = useLanguage()
  const chainNames: Record<string, string> = {
    ethereum: 'Ethereum Mainnet',
    polygon: 'Polygon PoS',
    arbitrum: 'Arbitrum One',
    optimism: 'Optimism',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('bridge.previewBridge')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 桥接摘要 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.bridgeSummary')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.sourceChain')}:</span>
                <span className="font-medium text-gray-800">联盟链 (HK-ABS-Chain)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.targetChain')}:</span>
                <span className="font-medium text-gray-800">{chainNames[targetChain]}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.recipientAddress')}:</span>
                <span className="font-medium text-gray-800 font-mono text-sm">
                  {recipientAddress.slice(0, 10)}...{recipientAddress.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          {/* 桥接资产 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.bridgeAssets')}</h4>
            <div className="space-y-2">
              {selectedAssets.map((asset) => {
                const getTypeLabel = (type: string) => {
                  if (type === 'receivable') return t('bridge.receivableABS')
                  if (type === 'inventory') return t('bridge.inventoryABS')
                  return type
                }
                return (
                  <div
                    key={asset.id}
                    className="p-3 border border-gray-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{asset.absId}</div>
                      <div className="text-sm text-gray-600">
                        {getTypeLabel(asset.type)} · {asset.tranche} ({asset.riskRating})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {asset.bridgeQuantity}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(asset.value * asset.bridgeQuantity).toLocaleString()} eHKD
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 费用明细 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('bridge.feeDetails')}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.assetValue')}:</span>
                <span className="font-medium text-gray-800">
                  {totalValue.toLocaleString()} eHKD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('bridge.bridgeFee')} (0.15%):</span>
                <span className="font-medium text-gray-800">
                  {bridgeFee.toLocaleString()} eHKD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-semibold text-gray-800">{t('bridge.estimatedArrival')}:</span>
                <span className="font-bold text-lg text-blue-600">
                  ~{estimatedReceived.toLocaleString()} eHKD
                </span>
              </div>
            </div>
          </div>

          {/* 预估时间 */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-amber-600"></i>
              <div>
                <div className="font-semibold text-amber-800">{t('bridge.estimatedTime')}</div>
                <div className="text-sm text-amber-700">{t('bridge.estimatedTimeValue') || '约 15 分钟后'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            {language === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('bridge.confirmBridge')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BridgePreviewModal
