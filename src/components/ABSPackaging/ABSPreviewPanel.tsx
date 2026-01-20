import { useLanguage } from '../../hooks/useLanguage'
import { TrancheConfig } from '../../pages/ABSPackaging'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ABSPreviewPanelProps {
  packagingSize: number
  trancheConfig: TrancheConfig
  onPreview: () => void
  onConfirm: () => void
  onReset: () => void
  canPackage: boolean
  estimatedFee?: number
}

function ABSPreviewPanel({
  packagingSize,
  trancheConfig,
  onPreview,
  onConfirm,
  onReset,
  canPackage,
  estimatedFee = 0,
}: ABSPreviewPanelProps) {
  const { language } = useLanguage()

  // 计算各层金额
  const seniorAmount = packagingSize * (trancheConfig.senior / 100)
  const mezzanineAmount = packagingSize * (trancheConfig.mezzanine / 100)
  const juniorAmount = packagingSize * (trancheConfig.junior / 100)

  // 环形图数据
  const pieData = [
    { name: language === 'zh' ? '高级层' : 'Senior', value: trancheConfig.senior, amount: seniorAmount, color: '#1e40af' },
    { name: language === 'zh' ? '中级层' : 'Mezzanine', value: trancheConfig.mezzanine, amount: mezzanineAmount, color: '#3b82f6' },
    { name: language === 'zh' ? '初级层' : 'Junior', value: trancheConfig.junior, amount: juniorAmount, color: '#f97316' },
  ]

  // 计算预估总发行费（假设为打包规模的0.5%）
  const totalFee = packagingSize * 0.005

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {language === 'zh' ? '发行预览' : 'Issuance Preview'}
      </h3>

      <div className="flex-1 space-y-6">
        {/* 可视化图表 */}
        <div>
          <h4 className="font-medium text-gray-800 text-sm mb-3">
            {language === 'zh' ? '分层结构' : 'Tranche Structure'}
          </h4>
          {packagingSize > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
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
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              {language === 'zh' ? '暂无数据' : 'No data'}
            </div>
          )}
        </div>

        {/* 关键指标摘要 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 text-sm">
            {language === 'zh' ? '关键指标' : 'Key Metrics'}
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{language === 'zh' ? '总规模' : 'Total Size'}</span>
              <span className="font-semibold text-gray-800 font-mono">
                {packagingSize.toLocaleString('en-US')} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{language === 'zh' ? '层数' : 'Tranches'}</span>
              <span className="font-semibold text-gray-800 font-mono">3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{language === 'zh' ? '预估总发行费' : 'Estimated Total Fee'}</span>
              <span className="font-semibold text-gray-800 font-mono">
                {totalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </span>
            </div>
          </div>
        </div>

        {/* 分层明细 */}
        <div className="space-y-2">
          {pieData.map((tranche, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 text-sm"
              style={{ borderLeftColor: tranche.color, borderLeftWidth: '3px' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">{tranche.name}</span>
                <span className="text-xs text-gray-500 font-mono">
                  {tranche.value.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-600 font-mono">
                {tranche.amount.toLocaleString('en-US')} eHKD
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
        <button
          onClick={onPreview}
          disabled={!canPackage}
          className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <i className="fas fa-file-alt mr-2"></i>
          {language === 'zh' ? '预览ABS报告' : 'Preview ABS Report'}
        </button>
        <button
          onClick={onConfirm}
          disabled={!canPackage}
          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <i className="fas fa-check-circle mr-2"></i>
          {language === 'zh' ? '确认并发行' : 'Confirm & Issue'}
        </button>
        <button
          onClick={onReset}
          className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          <i className="fas fa-redo mr-2"></i>
          {language === 'zh' ? '重置' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

export default ABSPreviewPanel
