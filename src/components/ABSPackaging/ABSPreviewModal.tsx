import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { AssetToken, TrancheConfig } from '../../pages/ABSPackaging'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ABSPreviewModalProps {
  absName: string
  absType: 'receivable' | 'inventory' | 'mixed'
  selectedAssets: AssetToken[]
  totalValue: number
  trancheConfig: TrancheConfig
  allowNBFI: boolean
  autoList: boolean
  notes: string
  onConfirm: (data: any) => void
  onClose: () => void
}

function ABSPreviewModal({
  absName,
  absType,
  selectedAssets,
  totalValue,
  trancheConfig,
  allowNBFI,
  autoList,
  notes,
  onConfirm,
  onClose,
}: ABSPreviewModalProps) {
  const { t, language } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  const seniorAmount = totalValue * (trancheConfig.senior / 100)
  const mezzanineAmount = totalValue * (trancheConfig.mezzanine / 100)
  const juniorAmount = totalValue * (trancheConfig.junior / 100)

  const pieData = [
    { name: t('absPackaging.seniorTranche'), value: trancheConfig.senior, amount: seniorAmount, color: '#1e40af' },
    { name: t('absPackaging.mezzanineTranche'), value: trancheConfig.mezzanine, amount: mezzanineAmount, color: '#3b82f6' },
    { name: t('absPackaging.juniorTranche'), value: trancheConfig.junior, amount: juniorAmount, color: '#f97316' },
  ]

  const getTypeLabel = () => {
    if (absType === 'receivable') return t('absPackaging.receivableABS')
    if (absType === 'inventory') return t('absPackaging.inventoryABS')
    return t('absPackaging.mixedABS')
  }

  const handleConfirm = async () => {
    setIsProcessing(true)

    // 模拟智能合约打包过程
    await new Promise(resolve => setTimeout(resolve, 3000))

    const hash = '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    setTransactionHash(hash)
    setIsProcessing(false)
    setIsSuccess(true)

    // 延迟触发回调
    setTimeout(() => {
      onConfirm({ hash, absName, absType, totalValue, trancheConfig })
    }, 2000)
  }

  const copyHash = () => {
    navigator.clipboard.writeText(transactionHash)
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 text-center border-b border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('absPackaging.packagingSuccess')}</h3>
            <p className="text-gray-600">{t('absPackaging.absRecordedOnBlockchain')}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('absPackaging.transactionHash')}
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="font-mono text-xs text-blue-600 flex-1 break-all">
                  {transactionHash}
                </span>
                <button
                  onClick={copyHash}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title={t('absPackaging.copyHash')}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">{t('absPackaging.nextSteps')}</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>{t('absPackaging.absRecordedOnBlockchain')}</li>
                    <li>{t('absPackaging.canViewInList')}</li>
                    <li>{t('absPackaging.hashCanQueryDetails')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t('absPackaging.confirm')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('absPackaging.previewABS')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ABS基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{t('absPackaging.basicInfo')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('absPackaging.absNameLabel')}：</span>
                <span className="font-medium text-gray-800 ml-2">{absName}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('absPackaging.assetType')}：</span>
                <span className="font-medium text-gray-800 ml-2">{getTypeLabel()}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('absPackaging.packagingScaleLabel')}</span>
                <span className="font-medium text-gray-800 ml-2">
                  {totalValue.toLocaleString('en-US')} eHKD
                </span>
              </div>
              <div>
                <span className="text-gray-600">{t('absPackaging.assetCount')}</span>
                <span className="font-medium text-gray-800 ml-2">{selectedAssets.length}</span>
              </div>
            </div>
          </div>

          {/* 选中资产列表 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{t('absPackaging.selectedAssetList')}</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('absPackaging.tokenId')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('absPackaging.typeLabel')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('absPackaging.faceValue')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('absPackaging.riskRating')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('absPackaging.issuer')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedAssets.map(asset => (
                      <tr key={asset.id}>
                        <td className="px-4 py-2 text-gray-800">{asset.id}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            asset.type === 'receivable'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {asset.type === 'receivable' ? 'AR' : 'INV'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {asset.faceValue.toLocaleString('en-US')} eHKD
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            {asset.riskRating}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600">{asset.issuer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 风险分层 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{t('absPackaging.trancheConfig')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 饼图 */}
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${props.payload.amount.toLocaleString('en-US')} eHKD (${value.toFixed(1)}%)`,
                        name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 分层明细 */}
              <div className="space-y-3">
                {pieData.map((tranche, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3"
                    style={{ borderLeftColor: tranche.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{tranche.name}</span>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: tranche.color + '20',
                          color: tranche.color,
                        }}
                      >
                        {index === 0 ? 'AAA' : index === 1 ? 'BBB' : 'BB'}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('absPackaging.amount')}</span>
                        <span className="font-medium text-gray-800">
                          {tranche.amount.toLocaleString('en-US')} eHKD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('absPackaging.percentage')}</span>
                        <span className="font-medium text-gray-800">{tranche.value.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('absPackaging.expectedYield')}：</span>
                        <span className="font-medium text-gray-800">
                          {index === 0 ? '5.2%' : index === 1 ? '7.8%' : '12.5%'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 预期现金流表 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              {language === 'zh' ? '预期现金流表' : 'Expected Cash Flow Table'}
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">
                      {language === 'zh' ? '期数' : 'Period'}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">
                      {language === 'zh' ? '高级层' : 'Senior'}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">
                      {language === 'zh' ? '中级层' : 'Mezzanine'}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">
                      {language === 'zh' ? '初级层' : 'Junior'}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">
                      {language === 'zh' ? '合计' : 'Total'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4].map((period) => {
                    const seniorCF = seniorAmount * 0.25 // 每期25%
                    const mezzanineCF = mezzanineAmount * 0.25
                    const juniorCF = juniorAmount * 0.25
                    const totalCF = seniorCF + mezzanineCF + juniorCF
                    return (
                      <tr key={period}>
                        <td className="px-4 py-2 font-medium text-gray-800">第{period}期</td>
                        <td className="px-4 py-2 font-mono text-gray-700">
                          {seniorCF.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                        </td>
                        <td className="px-4 py-2 font-mono text-gray-700">
                          {mezzanineCF.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                        </td>
                        <td className="px-4 py-2 font-mono text-gray-700">
                          {juniorCF.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                        </td>
                        <td className="px-4 py-2 font-mono font-semibold text-gray-800">
                          {totalCF.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 发行设置 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{t('absPackaging.issuanceSettings')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('absPackaging.allowNBFI')}</span>
                <span className="font-medium text-gray-800">{allowNBFI ? t('common.confirm') : t('absPackaging.cancel')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('absPackaging.autoList')}</span>
                <span className="font-medium text-gray-800">{autoList ? t('common.confirm') : t('absPackaging.cancel')}</span>
              </div>
              {notes && (
                <div>
                  <span className="text-gray-600">{t('absPackaging.notes')}：</span>
                  <span className="text-gray-800 ml-2">{notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            {t('absPackaging.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('absPackaging.processing')}
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                {t('absPackaging.confirmPackaging')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ABSPreviewModal
