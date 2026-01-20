import { useLanguage } from '../../hooks/useLanguage'
import { AssetToken, TrancheConfig } from '../../pages/ABSPackaging'

interface ABSBuilderProps {
  selectedAssets: AssetToken[]
  absName: string
  onAbsNameChange: (name: string) => void
  absType: 'receivable' | 'inventory' | 'mixed'
  totalValue: number
  packagingSize: number
  onPackagingSizeChange: (size: number) => void
  trancheConfig: TrancheConfig
  onTrancheConfigChange: (config: TrancheConfig) => void
  allowNBFI: boolean
  onAllowNBFIChange: (value: boolean) => void
  autoList: boolean
  onAutoListChange: (value: boolean) => void
  notes: string
  onNotesChange: (value: string) => void
  canPackage: boolean
}

function ABSBuilder({
  selectedAssets,
  absName,
  onAbsNameChange,
  absType,
  totalValue,
  packagingSize,
  onPackagingSizeChange,
  trancheConfig,
  onTrancheConfigChange,
  allowNBFI,
  onAllowNBFIChange,
  autoList,
  onAutoListChange,
  notes,
  onNotesChange,
  canPackage,
}: ABSBuilderProps) {
  const { t, language } = useLanguage()
  
  // 计算各层金额（基于打包规模）
  const seniorAmount = packagingSize * (trancheConfig.senior / 100)
  const mezzanineAmount = packagingSize * (trancheConfig.mezzanine / 100)
  const juniorAmount = packagingSize * (trancheConfig.junior / 100)

  const handleSeniorChange = (value: number) => {
    const maxValue = 100 - trancheConfig.mezzanine
    const newSenior = Math.min(Math.max(0, value), maxValue)
    const remaining = 100 - newSenior - trancheConfig.mezzanine
    onTrancheConfigChange({
      senior: newSenior,
      mezzanine: trancheConfig.mezzanine,
      junior: remaining,
    })
  }

  const handleMezzanineChange = (value: number) => {
    const maxValue = 100 - trancheConfig.senior
    const newMezzanine = Math.min(Math.max(0, value), maxValue)
    const remaining = 100 - trancheConfig.senior - newMezzanine
    onTrancheConfigChange({
      senior: trancheConfig.senior,
      mezzanine: newMezzanine,
      junior: remaining,
    })
  }

  const getTypeLabel = () => {
    if (absType === 'receivable') return language === 'zh' ? '应收账款ABS' : 'Receivable ABS'
    if (absType === 'inventory') return language === 'zh' ? '库存ABS' : 'Inventory ABS'
    return language === 'zh' ? '混合ABS' : 'Mixed ABS'
  }

  const isDisabled = selectedAssets.length < 2

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {language === 'zh' ? '配置ABS结构' : 'Configure ABS Structure'}
      </h3>

      <div className="space-y-6">
        {/* 基础信息 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 text-sm">
            {language === 'zh' ? '基础信息' : 'Basic Information'}
          </h4>

          {/* ABS名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? 'ABS名称' : 'ABS Name'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={absName}
              onChange={(e) => onAbsNameChange(e.target.value)}
              placeholder={language === 'zh' ? '应收账款ABS-2025-001' : 'Receivable ABS-2025-001'}
              disabled={isDisabled}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
            />
          </div>

          {/* 资产类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '资产类型' : 'Asset Type'}
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <i className={`fas ${
                  absType === 'receivable' ? 'fa-file-invoice-dollar text-blue-600' :
                  absType === 'inventory' ? 'fa-boxes text-green-600' :
                  'fa-layer-group text-purple-600'
                }`}></i>
                <span className="font-medium text-gray-800">{getTypeLabel()}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({language === 'zh' ? '根据选中资产自动判断' : 'Auto-determined by selected assets'})
                </span>
              </div>
            </div>
          </div>

          {/* 打包规模 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '打包规模' : 'Packaging Size'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={packagingSize}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(totalValue, parseFloat(e.target.value) || 0))
                  onPackagingSizeChange(value)
                }}
                min="0"
                max={totalValue}
                disabled={isDisabled}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
              <span className="text-sm text-gray-600">eHKD</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {language === 'zh' ? '最大：' : 'Max: '}
              <span className="font-mono">{totalValue.toLocaleString('en-US')} eHKD</span>
              {language === 'zh' ? '（资产池总价值）' : ' (Total Pool Value)'}
            </div>
          </div>
        </div>

        {/* 风险分层配置器 */}
        <div>
          <h4 className="font-medium text-gray-800 text-sm mb-4">
            {language === 'zh' ? '风险分层配置' : 'Risk Tranche Configuration'}
          </h4>

          {/* 高级层 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-900"></span>
                <span className="font-medium text-gray-800">
                  {language === 'zh' ? '高级层 (Senior, AAA)' : 'Senior Tranche (AAA)'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-mono">
                  {trancheConfig.senior.toFixed(1)}% ({seniorAmount.toLocaleString('en-US')} eHKD)
                </span>
                <span className="text-sm font-semibold text-blue-900 font-mono">
                  {language === 'zh' ? '预期利率：' : 'Expected Rate: '}5.2%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - trancheConfig.mezzanine}
              step="0.1"
              value={trancheConfig.senior}
              onChange={(e) => handleSeniorChange(parseFloat(e.target.value))}
              disabled={isDisabled}
              className="w-full disabled:opacity-50"
            />
          </div>

          {/* 中级层 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="font-medium text-gray-800">
                  {language === 'zh' ? '中级层 (Mezzanine, BBB)' : 'Mezzanine Tranche (BBB)'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-mono">
                  {trancheConfig.mezzanine.toFixed(1)}% ({mezzanineAmount.toLocaleString('en-US')} eHKD)
                </span>
                <span className="text-sm font-semibold text-blue-500 font-mono">
                  {language === 'zh' ? '预期利率：' : 'Expected Rate: '}7.8%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - trancheConfig.senior}
              step="0.1"
              value={trancheConfig.mezzanine}
              onChange={(e) => handleMezzanineChange(parseFloat(e.target.value))}
              disabled={isDisabled}
              className="w-full disabled:opacity-50"
            />
          </div>

          {/* 初级层 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="font-medium text-gray-800">
                  {language === 'zh' ? '初级层 (Junior, BB)' : 'Junior Tranche (BB)'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-mono">
                  {trancheConfig.junior.toFixed(1)}% ({juniorAmount.toLocaleString('en-US')} eHKD)
                </span>
                <span className="text-sm font-semibold text-orange-500 font-mono">
                  {language === 'zh' ? '预期利率：' : 'Expected Rate: '}12.5%
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600">
                {language === 'zh' ? '固定剩余部分' : 'Fixed remaining portion'}
              </div>
            </div>
          </div>
        </div>

        {/* 发行设置 */}
        <div>
          <h4 className="font-medium text-gray-800 text-sm mb-4">
            {language === 'zh' ? '发行设置' : 'Issuance Settings'}
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium text-gray-800 text-sm">
                  {language === 'zh' ? '允许NBFI购买' : 'Allow NBFI Purchase'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'zh' ? '允许非银行金融机构购买此ABS产品' : 'Allow non-bank financial institutions to purchase this ABS product'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowNBFI}
                onChange={(e) => onAllowNBFIChange(e.target.checked)}
                disabled={isDisabled}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium text-gray-800 text-sm">
                  {language === 'zh' ? '自动上架市场' : 'Auto List to Market'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'zh' ? '发行后自动上架到交易市场' : 'Automatically list to market after issuance'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoList}
                onChange={(e) => onAutoListChange(e.target.checked)}
                disabled={isDisabled}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '备注信息' : 'Notes'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                placeholder={language === 'zh' ? '输入备注信息...' : 'Enter notes...'}
                disabled={isDisabled}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      {isDisabled && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
            <div className="text-sm text-yellow-800">
              {language === 'zh' 
                ? '请先在左侧选择至少2个资产才能配置ABS结构'
                : 'Please select at least 2 assets from the left panel to configure ABS structure'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ABSBuilder
