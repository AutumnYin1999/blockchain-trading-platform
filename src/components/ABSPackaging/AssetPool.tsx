import { useState, useMemo, useRef, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { AssetToken } from '../../pages/ABSPackaging'

interface AssetPoolProps {
  selectedAssets: AssetToken[]
  onAssetSelect: (asset: AssetToken, selected: boolean) => void
  onSelectAll: (assets: AssetToken[], selected: boolean) => void
  totalValue: number
  averageRiskRating: string
  selectedCount: number
}

function AssetPool({ selectedAssets, onAssetSelect, onSelectAll, totalValue, averageRiskRating, selectedCount }: AssetPoolProps) {
  const { t, language } = useLanguage()
  const [assetType, setAssetType] = useState<'receivable' | 'inventory'>('receivable')
  const [riskFilter, setRiskFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 模拟资产数据
  const receivableAssets: AssetToken[] = useMemo(() => [
    { id: 'AR-2025-001', type: 'receivable', faceValue: 500000, riskRating: 'B+', daysRemaining: 89, issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A', quantity: 1 },
    { id: 'AR-2025-002', type: 'receivable', faceValue: 800000, riskRating: 'A-', daysRemaining: 135, issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B', quantity: 1 },
    { id: 'AR-2025-003', type: 'receivable', faceValue: 1200000, riskRating: 'AAA', daysRemaining: 273, issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C', quantity: 1 },
    { id: 'AR-2025-004', type: 'receivable', faceValue: 300000, riskRating: 'BBB+', daysRemaining: 45, issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A', quantity: 2 },
    { id: 'AR-2025-005', type: 'receivable', faceValue: 600000, riskRating: 'A', daysRemaining: 120, issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B', quantity: 1 },
    { id: 'AR-2025-006', type: 'receivable', faceValue: 450000, riskRating: 'A+', daysRemaining: 180, issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C', quantity: 1 },
  ], [language])

  const inventoryAssets: AssetToken[] = useMemo(() => [
    { id: 'INV-2025-015', type: 'inventory', faceValue: 300000, riskRating: 'A', status: language === 'zh' ? '成品-钢材' : 'Finished-Steel', issuer: language === 'zh' ? '建筑公司X' : 'Construction Company X', quantity: 1 },
    { id: 'INV-2025-016', type: 'inventory', faceValue: 150000, riskRating: 'BB+', status: language === 'zh' ? '原材料-水泥' : 'Raw Material-Cement', issuer: language === 'zh' ? '建筑公司Y' : 'Construction Company Y', quantity: 1 },
    { id: 'INV-2025-017', type: 'inventory', faceValue: 450000, riskRating: 'A-', status: language === 'zh' ? '在制品-预制构件' : 'WIP-Precast Components', issuer: language === 'zh' ? '建筑公司Z' : 'Construction Company Z', quantity: 1 },
    { id: 'INV-2025-018', type: 'inventory', faceValue: 250000, riskRating: 'BBB+', status: language === 'zh' ? '成品-钢材' : 'Finished-Steel', issuer: language === 'zh' ? '建筑公司X' : 'Construction Company X', quantity: 2 },
    { id: 'INV-2025-019', type: 'inventory', faceValue: 380000, riskRating: 'A', status: language === 'zh' ? '原材料-钢材' : 'Raw Material-Steel', issuer: language === 'zh' ? '建筑公司Y' : 'Construction Company Y', quantity: 1 },
  ], [language])

  const currentAssets = assetType === 'receivable' ? receivableAssets : inventoryAssets

  // 筛选逻辑
  const filteredAssets = useMemo(() => {
    return currentAssets.filter(asset => {
      // 风险等级筛选
      if (riskFilter !== 'all') {
        const riskLevel = asset.riskRating[0]
        if (riskFilter === 'A' && !['A'].includes(riskLevel)) return false
        if (riskFilter === 'B' && !['B'].includes(riskLevel)) return false
        if (riskFilter === 'C' && !['C'].includes(riskLevel)) return false
      }

      // 搜索筛选（代币ID或债务人/发行方）
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesId = asset.id.toLowerCase().includes(query)
        const matchesIssuer = asset.issuer.toLowerCase().includes(query)
        if (!matchesId && !matchesIssuer) return false
      }

      return true
    })
  }, [currentAssets, riskFilter, searchQuery])

  const isSelected = (assetId: string) => {
    return selectedAssets.some(a => a.id === assetId)
  }

  // 检查当前筛选的资产是否全部被选中
  const allFilteredSelected = useMemo(() => {
    if (filteredAssets.length === 0) return false
    return filteredAssets.every(asset => isSelected(asset.id))
  }, [filteredAssets, selectedAssets])

  // 检查是否有部分选中（用于indeterminate状态）
  const someFilteredSelected = useMemo(() => {
    if (filteredAssets.length === 0) return false
    return filteredAssets.some(asset => isSelected(asset.id)) && !allFilteredSelected
  }, [filteredAssets, selectedAssets, allFilteredSelected])

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(filteredAssets, checked)
  }

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someFilteredSelected
    }
  }, [someFilteredSelected])

  const getRiskColor = (rating: string) => {
    if (rating.startsWith('A')) return 'bg-green-100 text-green-700 border-green-200'
    if (rating.startsWith('B')) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">
          {language === 'zh' ? '选择打包资产' : 'Select Assets for Packaging'}
        </h3>
      </div>

      {/* 筛选器 */}
      <div className="p-4 border-b border-gray-200 space-y-3 bg-gray-50">
        {/* 资产类型（单选） */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {language === 'zh' ? '资产类型' : 'Asset Type'}
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setAssetType('receivable')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                assetType === 'receivable'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '应收账款' : 'Receivable'}
            </button>
            <button
              onClick={() => setAssetType('inventory')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                assetType === 'inventory'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '库存' : 'Inventory'}
            </button>
          </div>
        </div>

        {/* 风险等级 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {language === 'zh' ? '风险等级' : 'Risk Level'}
          </label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{language === 'zh' ? '全部' : 'All'}</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        {/* 搜索框 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {language === 'zh' ? '搜索' : 'Search'}
          </label>
          <input
            type="text"
            placeholder={language === 'zh' ? '按代币ID或债务人搜索' : 'Search by Token ID or Debtor'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 资产列表（表格） */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                {language === 'zh' ? '代币ID' : 'Token ID'}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                {language === 'zh' ? '类型' : 'Type'}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                {language === 'zh' ? '面值' : 'Face Value'}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                {language === 'zh' ? '风险评级' : 'Risk Rating'}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                {assetType === 'receivable' 
                  ? (language === 'zh' ? '到期日' : 'Due Date')
                  : (language === 'zh' ? '库存类型' : 'Inventory Type')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-gray-500 text-sm">
                  {language === 'zh' ? '暂无数据' : 'No data'}
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => {
                const selected = isSelected(asset.id)
                return (
                  <tr
                    key={asset.id}
                    className={`hover:bg-blue-50 transition-colors cursor-pointer ${selected ? 'bg-blue-50' : ''}`}
                    onClick={() => onAssetSelect(asset, !selected)}
                  >
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          e.stopPropagation()
                          onAssetSelect(asset, !selected)
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 font-mono text-xs">
                      {asset.id}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        asset.type === 'receivable'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {asset.type === 'receivable' ? '📄' : '📦'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {asset.faceValue.toLocaleString('en-US')} eHKD
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${getRiskColor(asset.riskRating)}`}>
                        {asset.riskRating}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">
                      {asset.daysRemaining 
                        ? `${new Date(Date.now() + asset.daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                        : asset.status || '--'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 选择统计 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{language === 'zh' ? '已选资产数' : 'Selected Assets'}</span>
          <span className="font-semibold text-gray-800 font-mono">
            {selectedCount} {language === 'zh' ? '个' : ''}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{language === 'zh' ? '资产池总价值' : 'Total Pool Value'}</span>
          <span className="font-semibold text-gray-800 font-mono">
            {totalValue.toLocaleString('en-US')} eHKD
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{language === 'zh' ? '平均风险评级' : 'Average Risk Rating'}</span>
          <span className="font-semibold text-gray-800">
            {averageRiskRating}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AssetPool
