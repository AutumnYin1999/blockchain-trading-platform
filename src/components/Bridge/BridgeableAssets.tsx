import { useState, useMemo } from 'react'
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
  source?: 'self-packaged' | 'purchased' | 'non-abs' // 资产来源
}

interface BridgeableAssetsProps {
  assets: BridgeableAsset[]
  userRole: string
  onAssetSelect: (assetId: string, selected: boolean) => void
  onQuantityChange: (assetId: string, quantity: number) => void
  selectedCount: number
  selectedValue: number
}

function BridgeableAssets({
  assets,
  userRole,
  onAssetSelect,
  onQuantityChange,
  selectedCount,
  selectedValue,
}: BridgeableAssetsProps) {
  const { t, language } = useLanguage()
  const [filterType, setFilterType] = useState<string>('all')
  const [filterTranche, setFilterTranche] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getTypeLabel = (type: string) => {
    if (type === 'receivable') return t('bridge.receivableABS')
    if (type === 'inventory') return t('bridge.inventoryABS')
    return type
  }

  const getSourceLabel = (source?: string) => {
    if (!source) return null
    if (source === 'self-packaged') {
      return {
        text: language === 'zh' ? '自打包（可桥接）' : 'Self-Packaged (Bridgeable)',
        icon: '✅',
        color: 'bg-green-100 text-green-700 border-green-200'
      }
    }
    if (source === 'purchased') {
      return {
        text: language === 'zh' ? '购买自其他银行（不可桥接）' : 'Purchased from Other Bank (Not Bridgeable)',
        icon: '⚠️',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
    }
    if (source === 'non-abs') {
      return {
        text: language === 'zh' ? '非ABS资产（不可桥接）' : 'Non-ABS Asset (Not Bridgeable)',
        icon: '❌',
        color: 'bg-red-100 text-red-700 border-red-200'
      }
    }
    return null
  }

  const isBridgeable = (asset: BridgeableAsset) => {
    if (userRole === '银行' || userRole === 'Bank') {
      return asset.source === 'self-packaged'
    }
    return true // 其他角色可以桥接所有资产
  }

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 类型筛选
      const matchType = filterType === 'all' || asset.type === filterType
      
      // 层级筛选
      const matchTranche = filterTranche === 'all' || asset.tranche === filterTranche
      
      // 搜索筛选
      const matchSearch = asset.absId.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchType && matchTranche && matchSearch
    })
  }, [assets, filterType, filterTranche, searchTerm])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{t('bridge.bridgeableAssets')}</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          {assets.length} {language === 'zh' ? '全部' : 'All'}
        </span>
      </div>

      {/* 筛选控件 */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder={language === 'zh' ? '搜索 ABS ID...' : 'Search ABS ID...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'zh' ? '全部类型' : 'All Types'}</option>
            <option value="receivable">{t('bridge.receivableABS')}</option>
            <option value="inventory">{t('bridge.inventoryABS')}</option>
          </select>
          <select
            value={filterTranche}
            onChange={(e) => setFilterTranche(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'zh' ? '全部层级' : 'All Tranches'}</option>
            <option value="Senior">{t('bridge.senior')}</option>
            <option value="Mezzanine">{t('bridge.mezzanine')}</option>
            <option value="Junior">{t('bridge.junior')}</option>
          </select>
        </div>
      </div>

      {/* 资产列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAssets.map((asset) => {
          const sourceLabel = getSourceLabel(asset.source)
          const bridgeable = isBridgeable(asset)
          
          return (
            <div
              key={asset.id}
              className={`p-4 border rounded-lg transition-all ${
                asset.selected
                  ? 'border-blue-500 bg-blue-50'
                  : bridgeable
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="checkbox"
                    checked={asset.selected}
                    onChange={(e) => onAssetSelect(asset.id, e.target.checked)}
                    disabled={!bridgeable}
                    className={`mt-1 ${!bridgeable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{asset.absId}</div>
                    <div className="flex items-center space-x-2 mt-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          asset.type === 'receivable'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {getTypeLabel(asset.type)}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {asset.tranche} ({asset.riskRating})
                      </span>
                      {sourceLabel && (
                        <span className={`px-2 py-0.5 rounded text-xs border ${sourceLabel.color}`}>
                          {sourceLabel.icon} {sourceLabel.text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('bridge.holdingQuantity')}:</span>
                <span className="font-medium text-gray-800">{asset.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('bridge.tokenValue')}:</span>
                <span className="font-medium text-gray-800">
                  {asset.value.toLocaleString()} eHKD
                </span>
              </div>
              {asset.selected && bridgeable && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('bridge.bridgeQuantityLabel')}:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={asset.quantity}
                    value={asset.bridgeQuantity}
                    onChange={(e) =>
                      onQuantityChange(asset.id, parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {!bridgeable && (
                <div className="mt-2 text-xs text-gray-500 italic">
                  {language === 'zh' 
                    ? '此资产不可桥接'
                    : 'This asset is not bridgeable'}
                </div>
              )}
            </div>
          </div>
          )
        })}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t('bridge.selectedAssets')}:</span>
            <span className="font-semibold text-gray-800">{selectedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t('bridge.selectedValue')}:</span>
            <span className="font-semibold text-gray-800">
              {selectedValue.toLocaleString()} eHKD
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BridgeableAssets
