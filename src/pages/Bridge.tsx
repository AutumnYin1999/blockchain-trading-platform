import { useState, useEffect } from 'react'
import BridgeableAssets from '../components/Bridge/BridgeableAssets'
import BridgeConfig from '../components/Bridge/BridgeConfig'
import BridgeHistory from '../components/Bridge/BridgeHistory'
import BridgePreviewModal from '../components/Bridge/BridgePreviewModal'
import BridgeDetailModal from '../components/Bridge/BridgeDetailModal'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'

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
  source?: 'self-packaged' | 'purchased' | 'non-abs' // 资产来源：自打包、购买自其他银行、非ABS资产
}

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

function BridgePage() {
  const { currentRole, permissions, displayName } = useRole()
  const { t, language } = useLanguage()
  const [selectedAssets, setSelectedAssets] = useState<BridgeableAsset[]>([])
  const [targetChain, setTargetChain] = useState('ethereum')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBridge, setSelectedBridge] = useState<BridgeRecord | null>(null)
  const [bridgeHistory, setBridgeHistory] = useState<BridgeRecord[]>([])

  // 模拟可桥接资产数据
  const [bridgeableAssets, setBridgeableAssets] = useState<BridgeableAsset[]>([
    {
      id: '1',
      absId: 'ABS-R-2025-001',
      type: 'receivable',
      tranche: 'Senior',
      value: 100000,
      quantity: 5,
      riskRating: 'AAA',
      selected: false,
      bridgeQuantity: 0,
      source: 'self-packaged', // 自打包
    },
    {
      id: '2',
      absId: 'ABS-R-2025-002',
      type: 'receivable',
      tranche: 'Mezzanine',
      value: 80000,
      quantity: 3,
      riskRating: 'BBB',
      selected: false,
      bridgeQuantity: 0,
      source: 'purchased', // 购买自其他银行
    },
    {
      id: '3',
      absId: 'ABS-I-2025-001',
      type: 'inventory',
      tranche: 'Senior',
      value: 120000,
      quantity: 4,
      riskRating: 'AAA',
      selected: false,
      bridgeQuantity: 0,
      source: 'self-packaged', // 自打包
    },
    {
      id: '4',
      absId: 'AR-2025-010',
      type: 'receivable',
      tranche: 'Senior',
      value: 50000,
      quantity: 2,
      riskRating: 'A+',
      selected: false,
      bridgeQuantity: 0,
      source: 'non-abs', // 非ABS资产
    },
  ])

  useEffect(() => {
    // 模拟历史记录
    setBridgeHistory([
      {
        id: 'BR-001',
        absId: 'ABS-R-2025-001',
        targetChain: 'Ethereum',
        quantity: 2,
        value: 200000,
        status: '完成',
        timestamp: '2025-01-15 14:30:00',
        txHash: '0x1234...5678',
      },
      {
        id: 'BR-002',
        absId: 'ABS-I-2025-001',
        targetChain: 'Polygon',
        quantity: 1,
        value: 120000,
        status: '进行中',
        timestamp: '2025-01-15 15:00:00',
      },
    ])
  }, [])

  const handleAssetSelect = (assetId: string, selected: boolean) => {
    // 银行角色只能选择自打包的ABS资产
    if (isBank && selected) {
      const asset = bridgeableAssets.find(a => a.id === assetId)
      if (asset && asset.source !== 'self-packaged') {
        alert(language === 'zh' 
          ? '只能桥接自己打包的ABS代币'
          : 'Can only bridge self-packaged ABS tokens')
        return
      }
    }
    
    setBridgeableAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId ? { ...asset, selected } : asset
      )
    )
  }

  const handleQuantityChange = (assetId: string, quantity: number) => {
    setBridgeableAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === assetId) {
          const maxQuantity = asset.quantity
          return {
            ...asset,
            bridgeQuantity: Math.min(Math.max(0, quantity), maxQuantity),
          }
        }
        return asset
      })
    )
  }

  const selectedAssetsList = bridgeableAssets.filter((asset) => asset.selected && asset.bridgeQuantity > 0)
  const totalValue = selectedAssetsList.reduce(
    (sum, asset) => sum + asset.value * asset.bridgeQuantity,
    0
  )
  const bridgeFee = totalValue * 0.0015 // 0.15%
  const estimatedReceived = totalValue - bridgeFee

  const handlePreview = () => {
    if (selectedAssetsList.length === 0 || !recipientAddress) {
      alert('请选择资产并填写接收地址')
      return
    }
    setShowPreviewModal(true)
  }

  const handleConfirmBridge = () => {
    // 模拟桥接过程
    const newBridge: BridgeRecord = {
      id: `BR-${Date.now()}`,
      absId: selectedAssetsList[0].absId,
      targetChain: targetChain,
      quantity: selectedAssetsList.reduce((sum, a) => sum + a.bridgeQuantity, 0),
      value: totalValue,
      status: '进行中',
      timestamp: new Date().toLocaleString('zh-CN'),
    }
    setBridgeHistory((prev) => [newBridge, ...prev])
    setShowPreviewModal(false)
    
    // 重置选择
    setBridgeableAssets((prev) =>
      prev.map((asset) => ({ ...asset, selected: false, bridgeQuantity: 0 }))
    )
    setRecipientAddress('')
  }

  const isBank = currentRole === '银行' || currentRole === 'Bank'

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{t('bridge.title')}</h2>
                {isBank && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                    <i className="fas fa-building-columns mr-2"></i>
                    {language === 'zh' ? '银行（Validator）' : 'Bank (Validator)'}
                  </span>
                )}
              </div>
              {isBank ? (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    {language === 'zh' 
                      ? '权限说明：只能桥接自己打包的ABS代币，不能桥接购买的ABS或基础资产代币'
                      : 'Permission: Can only bridge self-packaged ABS tokens, cannot bridge purchased ABS or base asset tokens'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mt-1">
                  {permissions.bridgeOwnABS
                    ? t('bridge.bankDescription')
                    : permissions.bridgePurchasedABS
                    ? t('bridge.nbfiDescription')
                    : t('bridge.title')}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {t('bridge.bridgeTotal')}: <strong className="text-gray-800">1,850,000 eHKD</strong> | 
              {t('bridge.bridgeFee')}: <strong className="text-gray-800">2,775 eHKD</strong>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：可桥接资产列表 */}
        <div className="lg:col-span-4">
          <BridgeableAssets
            assets={bridgeableAssets}
            userRole={currentRole}
            onAssetSelect={handleAssetSelect}
            onQuantityChange={handleQuantityChange}
            selectedCount={selectedAssetsList.length}
            selectedValue={totalValue}
          />
        </div>

        {/* 中部：桥接配置 */}
        <div className="lg:col-span-5">
          <BridgeConfig
            selectedAssets={selectedAssetsList}
            totalValue={totalValue}
            bridgeFee={bridgeFee}
            estimatedReceived={estimatedReceived}
            targetChain={targetChain}
            onTargetChainChange={setTargetChain}
            recipientAddress={recipientAddress}
            onRecipientAddressChange={setRecipientAddress}
            onPreview={handlePreview}
          />
        </div>

        {/* 右侧：桥接历史与状态 */}
        <div className="lg:col-span-3">
          <BridgeHistory
            history={bridgeHistory}
            onViewDetail={(bridge) => {
              setSelectedBridge(bridge)
              setShowDetailModal(true)
            }}
          />
        </div>
      </div>

      {/* 桥接预览模态框 */}
      {showPreviewModal && (
        <BridgePreviewModal
          selectedAssets={selectedAssetsList}
          targetChain={targetChain}
          recipientAddress={recipientAddress}
          totalValue={totalValue}
          bridgeFee={bridgeFee}
          estimatedReceived={estimatedReceived}
          onConfirm={handleConfirmBridge}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {/* 桥接详情模态框 */}
      {showDetailModal && selectedBridge && (
        <BridgeDetailModal
          bridge={selectedBridge}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedBridge(null)
          }}
        />
      )}
    </div>
  )
}

export default BridgePage
