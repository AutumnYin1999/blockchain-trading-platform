import { FilterState } from '../../pages/MarketTrading'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'

interface TokenFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

function TokenFilters({ filters, onFiltersChange }: TokenFiltersProps) {
  const { t, language } = useLanguage()
  const { currentRole } = useRole()
  const isBank = currentRole === '银行'
  const issuers = [
    t('marketTrading.sampleIssuers.coreEnterpriseA'),
    t('marketTrading.sampleIssuers.coreEnterpriseB'),
    t('marketTrading.sampleIssuers.coreEnterpriseC'),
    t('marketTrading.sampleIssuers.constructionCompanyX'),
    t('marketTrading.sampleIssuers.constructionCompanyY'),
    t('marketTrading.sampleIssuers.constructionCompanyZ'),
  ]

  const handleTokenTypeToggle = (type: 'receivable' | 'inventory') => {
    const newTypes = filters.tokenTypes.includes(type)
      ? filters.tokenTypes.filter(t => t !== type)
      : [...filters.tokenTypes, type]
    onFiltersChange({ ...filters, tokenTypes: newTypes })
  }

  const handleReset = () => {
    onFiltersChange({
      tokenTypes: [],
      riskLevel: 'all',
      issuer: 'all',
      priceRange: [0, 1000000],
      dueTime: undefined,
      inventoryType: undefined,
      yieldRange: undefined,
      remainingDays: undefined,
      creditRating: undefined,
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fas fa-filter mr-2 text-blue-600"></i>
          {t('marketTrading.filterConditions')}
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="fas fa-redo mr-1"></i>
          {t('marketTrading.reset')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 代币类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.tokenType')}
          </label>
          <div className="flex space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('receivable')}
                onChange={() => handleTokenTypeToggle('receivable')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t('marketTrading.receivable')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('inventory')}
                onChange={() => handleTokenTypeToggle('inventory')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t('marketTrading.inventory')}</span>
            </label>
          </div>
        </div>

        {/* 风险等级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.riskLevel')}
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => onFiltersChange({ ...filters, riskLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('marketTrading.all')}</option>
            <option value="low">{t('marketTrading.lowRisk')}</option>
            <option value="medium">{t('marketTrading.mediumRisk')}</option>
            <option value="high">{t('marketTrading.highRisk')}</option>
          </select>
        </div>

        {/* 发行方 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.issuer')}
          </label>
          <select
            value={filters.issuer}
            onChange={(e) => onFiltersChange({ ...filters, issuer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('marketTrading.all')}</option>
            {issuers.map(issuer => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>
        </div>

        {/* 价格范围 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.priceRange')}: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} eHKD
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceRange: [parseInt(e.target.value), filters.priceRange[1]]
              })}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)]
              })}
              className="flex-1"
            />
          </div>
        </div>

        {/* 到期时间（仅应收账款） */}
        {filters.tokenTypes.includes('receivable') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.dueTime')}
            </label>
            <select
              value={filters.dueTime || 'all'}
              onChange={(e) => onFiltersChange({
                ...filters,
                dueTime: e.target.value === 'all' ? undefined : e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('marketTrading.all')}</option>
              <option value="30">30 {t('marketTrading.withinDays')}</option>
              <option value="90">90 {t('marketTrading.withinDays')}</option>
              <option value="180">180 {t('marketTrading.withinDays')}</option>
            </select>
          </div>
        )}

        {/* 库存类型（仅库存） */}
        {filters.tokenTypes.includes('inventory') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.inventoryType')}
            </label>
            <select
              value={filters.inventoryType || 'all'}
              onChange={(e) => onFiltersChange({
                ...filters,
                inventoryType: e.target.value === 'all' ? undefined : e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('marketTrading.all')}</option>
              <option value="raw">{t('assetIssuance.rawMaterial')}</option>
              <option value="wip">{t('assetIssuance.workInProgress')}</option>
              <option value="finished">{t('assetIssuance.finishedProduct')}</option>
            </select>
          </div>
        )}

        {/* 银行专用筛选条件 */}
        {isBank && filters.tokenTypes.includes('receivable') && (
          <>
            {/* 年化收益率范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '年化收益率范围' : 'Annual Yield Range'} (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={filters.yieldRange?.[0] || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    yieldRange: [parseFloat(e.target.value) || 0, filters.yieldRange?.[1] || 20]
                  })}
                  placeholder={language === 'zh' ? '最低' : 'Min'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={filters.yieldRange?.[1] || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    yieldRange: [filters.yieldRange?.[0] || 0, parseFloat(e.target.value) || 20]
                  })}
                  placeholder={language === 'zh' ? '最高' : 'Max'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 剩余期限筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '剩余期限' : 'Remaining Days'}
              </label>
              <select
                value={filters.remainingDays || 'all'}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  remainingDays: e.target.value === 'all' ? undefined : e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('marketTrading.all')}</option>
                <option value="30">{language === 'zh' ? '30天内' : 'Within 30 days'}</option>
                <option value="90">{language === 'zh' ? '90天内' : 'Within 90 days'}</option>
                <option value="180">{language === 'zh' ? '180天内' : 'Within 180 days'}</option>
                <option value="365">{language === 'zh' ? '365天内' : 'Within 365 days'}</option>
              </select>
            </div>

            {/* 信用评级筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '债务人信用评级' : 'Debtor Credit Rating'}
              </label>
              <select
                value={filters.creditRating || 'all'}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  creditRating: e.target.value === 'all' ? undefined : e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('marketTrading.all')}</option>
                <option value="A+">{language === 'zh' ? 'A级以上' : 'A+ and above'}</option>
                <option value="A">{language === 'zh' ? 'A级' : 'A'}</option>
                <option value="B+">{language === 'zh' ? 'B+级及以上' : 'B+ and above'}</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TokenFilters
