import { useState, useMemo } from 'react'
import AssetPool from '../components/ABSPackaging/AssetPool'
import ABSBuilder from '../components/ABSPackaging/ABSBuilder'
import ABSPreviewPanel from '../components/ABSPackaging/ABSPreviewPanel'
import ABSHistory from '../components/ABSPackaging/ABSHistory'
import ABSPreviewModal from '../components/ABSPackaging/ABSPreviewModal'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'
import PermissionGuard from '../components/Common/PermissionGuard'

export interface AssetToken {
  id: string
  type: 'receivable' | 'inventory'
  faceValue: number
  riskRating: string
  daysRemaining?: number
  status?: string
  issuer: string
  quantity: number
}

export interface ABSProduct {
  id: string
  name: string
  type: 'receivable' | 'inventory' | 'mixed'
  totalSize: number
  createdAt: string
  seniorTranche: { amount: number; status: string }
  mezzanineTranche: { amount: number; status: string }
  juniorTranche: { amount: number; status: string }
  hash: string
}

export interface TrancheConfig {
  senior: number // 百分比
  mezzanine: number // 百分比
  junior: number // 百分比（自动计算）
}

function ABSPackaging() {
  const { currentRole, permissions } = useRole()
  const { t, language } = useLanguage()
  const [selectedAssets, setSelectedAssets] = useState<AssetToken[]>([])
  const [absName, setAbsName] = useState('')
  const [packagingSize, setPackagingSize] = useState(0)
  const [trancheConfig, setTrancheConfig] = useState<TrancheConfig>({
    senior: 70,
    mezzanine: 20,
    junior: 10,
  })
  const [allowNBFI, setAllowNBFI] = useState(true)
  const [autoList, setAutoList] = useState(true)
  const [notes, setNotes] = useState('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [absProducts, setAbsProducts] = useState<ABSProduct[]>([])

  // 计算选中资产总价值
  const totalValue = useMemo(() => {
    return selectedAssets.reduce((sum, asset) => sum + asset.faceValue * asset.quantity, 0)
  }, [selectedAssets])

  // 当选中资产变化时，自动更新打包规模
  useMemo(() => {
    if (selectedAssets.length > 0 && packagingSize === 0) {
      setPackagingSize(totalValue)
    } else if (selectedAssets.length === 0) {
      setPackagingSize(0)
    } else if (packagingSize > totalValue) {
      setPackagingSize(totalValue)
    }
  }, [selectedAssets, totalValue])

  // 计算平均风险评级
  const averageRiskRating = useMemo(() => {
    if (selectedAssets.length === 0) return '--'
    
    const riskMap: Record<string, number> = {
      'AAA': 1, 'AA+': 2, 'AA': 3, 'AA-': 4,
      'A+': 5, 'A': 6, 'A-': 7,
      'BBB+': 8, 'BBB': 9, 'BBB-': 10,
      'BB+': 11, 'BB': 12, 'BB-': 13,
      'B+': 14, 'B': 15, 'B-': 16,
      'CCC+': 17, 'CCC': 18, 'CCC-': 19,
    }
    
    const avgRisk = selectedAssets.reduce((sum, asset) => {
      return sum + (riskMap[asset.riskRating] || 10)
    }, 0) / selectedAssets.length
    
    // 反向映射到评级
    const entries = Object.entries(riskMap)
    const closest = entries.reduce((prev, curr) => {
      return Math.abs(curr[1] - avgRisk) < Math.abs(prev[1] - avgRisk) ? curr : prev
    })
    
    return closest[0]
  }, [selectedAssets])

  // 自动判断ABS类型（根据选中资产）
  const absType = useMemo(() => {
    if (selectedAssets.length === 0) return 'receivable'
    const hasReceivable = selectedAssets.some(a => a.type === 'receivable')
    const hasInventory = selectedAssets.some(a => a.type === 'inventory')
    
    // 不允许混合类型
    if (hasReceivable && hasInventory) {
      // 如果混合了，返回主要类型
      const receivableCount = selectedAssets.filter(a => a.type === 'receivable').length
      const inventoryCount = selectedAssets.filter(a => a.type === 'inventory').length
      return receivableCount >= inventoryCount ? 'receivable' : 'inventory'
    }
    if (hasReceivable) return 'receivable'
    return 'inventory'
  }, [selectedAssets])

  // 验证是否可以打包
  const canPackage = useMemo(() => {
    if (selectedAssets.length < 2) return false
    if (!absName.trim()) return false
    if (packagingSize <= 0) return false
    
    // 检查是否有至少2个不同发行方
    const uniqueIssuers = new Set(selectedAssets.map(a => a.issuer))
    if (uniqueIssuers.size < 2) return false
    
    return true
  }, [selectedAssets, absName, packagingSize])

  const handleAssetSelect = (asset: AssetToken, selected: boolean) => {
    if (selected) {
      // 检查资产是否已经存在，避免重复添加
      setSelectedAssets(prev => {
        if (prev.some(a => a.id === asset.id)) {
          return prev // 已存在，不重复添加
        }
        return [...prev, asset]
      })
    } else {
      setSelectedAssets(prev => {
        const newList = prev.filter(a => a.id !== asset.id)
        // 如果取消选择后打包规模超过总价值，调整打包规模
        const newTotal = newList.reduce((sum, a) => sum + a.faceValue * a.quantity, 0)
        if (packagingSize > newTotal) {
          setPackagingSize(newTotal)
        }
        return newList
      })
    }
  }

  const handleSelectAll = (assets: AssetToken[], selected: boolean) => {
    if (selected) {
      // 全选：添加所有未选中的资产
      setSelectedAssets(prev => {
        const existingIds = new Set(prev.map(a => a.id))
        const newAssets = assets.filter(a => !existingIds.has(a.id))
        return [...prev, ...newAssets]
      })
    } else {
      // 取消全选：移除所有当前筛选的资产
      const assetIds = new Set(assets.map(a => a.id))
      setSelectedAssets(prev => {
        const newList = prev.filter(a => !assetIds.has(a.id))
        // 如果取消选择后打包规模超过总价值，调整打包规模
        const newTotal = newList.reduce((sum, a) => sum + a.faceValue * a.quantity, 0)
        if (packagingSize > newTotal) {
          setPackagingSize(newTotal)
        }
        return newList
      })
    }
  }

  const handleReset = () => {
    setSelectedAssets([])
    setAbsName('')
    setPackagingSize(0)
    setTrancheConfig({ senior: 70, mezzanine: 20, junior: 10 })
    setAllowNBFI(true)
    setAutoList(true)
    setNotes('')
  }

  const handlePackage = (absData: any) => {
    // 生成ABS ID
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 999) + 1
    const typePrefix = absType === 'receivable' ? 'R' : absType === 'inventory' ? 'I' : 'M'
    const absId = `ABS-${typePrefix}-${year}-${random.toString().padStart(3, '0')}`
    
    const newABS: ABSProduct = {
      id: absId,
      name: absName,
      type: absType,
      totalSize: packagingSize,
      createdAt: new Date().toLocaleString('zh-CN'),
      seniorTranche: {
        amount: packagingSize * (trancheConfig.senior / 100),
        status: t('absPackaging.inSale'),
      },
      mezzanineTranche: {
        amount: packagingSize * (trancheConfig.mezzanine / 100),
        status: t('absPackaging.inSale'),
      },
      juniorTranche: {
        amount: packagingSize * (trancheConfig.junior / 100),
        status: t('absPackaging.notStarted'),
      },
      hash: absData.hash,
    }
    
    setAbsProducts(prev => [newABS, ...prev])
    setShowPreviewModal(false)
    
    // 重置表单
    handleReset()
  }

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{t('absPackaging.title')}</h2>
          {permissions.absPackagingCreate && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {t('absPackaging.bankOnly')}
            </span>
          )}
          {permissions.absPackagingPurchase && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              {t('absPackaging.nbfiPurchase')}
            </span>
          )}
        </div>
        <p className="text-gray-600">
          {permissions.absPackagingCreate
            ? t('absPackaging.bankDescription')
            : t('absPackaging.nbfiDescription')}
        </p>
      </div>

      {/* 银行：显示完整的打包界面（三栏布局） */}
      <PermissionGuard permission="absPackagingCreate">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* 左栏（30%）：资产池构建 */}
          <div className="lg:col-span-3">
            <AssetPool
              selectedAssets={selectedAssets}
              onAssetSelect={handleAssetSelect}
              onSelectAll={handleSelectAll}
              totalValue={totalValue}
              averageRiskRating={averageRiskRating}
              selectedCount={selectedAssets.length}
            />
          </div>

          {/* 中栏（50%）：ABS构建器 */}
          <div className="lg:col-span-5">
            <ABSBuilder
              selectedAssets={selectedAssets}
              absName={absName}
              onAbsNameChange={setAbsName}
              absType={absType}
              totalValue={totalValue}
              packagingSize={packagingSize}
              onPackagingSizeChange={setPackagingSize}
              trancheConfig={trancheConfig}
              onTrancheConfigChange={setTrancheConfig}
              allowNBFI={allowNBFI}
              onAllowNBFIChange={setAllowNBFI}
              autoList={autoList}
              onAutoListChange={setAutoList}
              notes={notes}
              onNotesChange={setNotes}
              canPackage={canPackage}
            />
          </div>

          {/* 右栏（20%）：分层预览与发行 */}
          <div className="lg:col-span-2">
            <ABSPreviewPanel
              packagingSize={packagingSize}
              trancheConfig={trancheConfig}
              onPreview={() => setShowPreviewModal(true)}
              onConfirm={() => setShowPreviewModal(true)}
              onReset={handleReset}
              canPackage={canPackage}
            />
          </div>
        </div>

        {/* 已打包ABS历史（在下方显示） */}
        {absProducts.length > 0 && (
          <div className="mt-6">
            <ABSHistory absProducts={absProducts} />
          </div>
        )}
      </PermissionGuard>

      {/* NBFI：只显示购买界面 */}
      <PermissionGuard permission="absPackagingPurchase">
        <div className="lg:col-span-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('absPackaging.purchasableAbsProducts')}</h3>
            <p className="text-gray-600 mb-6">
              {t('absPackaging.browseAbsProducts')}
            </p>
            <ABSHistory absProducts={absProducts} />
          </div>
        </div>
      </PermissionGuard>

      {/* ABS预览模态框 */}
      {showPreviewModal && (
        <ABSPreviewModal
          absName={absName}
          absType={absType}
          selectedAssets={selectedAssets}
          totalValue={packagingSize}
          trancheConfig={trancheConfig}
          allowNBFI={allowNBFI}
          autoList={autoList}
          notes={notes}
          onConfirm={handlePackage}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  )
}

export default ABSPackaging
