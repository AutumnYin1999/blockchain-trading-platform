import { useLanguage } from '../../hooks/useLanguage'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface LiquidityManagementProps {
  onLiquidityManage: () => void
}

function LiquidityManagement({ onLiquidityManage }: LiquidityManagementProps) {
  const { t, language } = useLanguage()

  // 模拟数据
  const myLiquidity = {
    total: 2500000,
    todayRevenue: 850,
    cumulativeRevenue: 12500,
    annualizedYield: 3.7,
    poolShare: 15.8 // 在总池子中的占比
  }

  const riskMetrics = {
    poolConcentration: 68, // 池子集中度（前3大LP占比）
    utilizationRate: 45, // 池子利用率
    riskLevel: 'low' // low, medium, high
  }

  // 收益趋势数据（最近7天）
  const revenueTrend = [
    { date: '01-08', today: 720, cumulative: 9800 },
    { date: '01-09', today: 780, cumulative: 10580 },
    { date: '01-10', today: 820, cumulative: 11400 },
    { date: '01-11', today: 850, cumulative: 12250 },
  ]

  const getRiskColor = (level: string) => {
    if (level === 'low') return 'text-green-600 bg-green-100'
    if (level === 'medium') return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        <i className="fas fa-swimming-pool mr-2 text-purple-600"></i>
        {language === 'zh' ? '外汇池流动性管理' : 'Forex Pool Liquidity Management'}
      </h3>

      <div className="space-y-6">
        {/* 我的流动性头寸 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? '我的流动性头寸' : 'My Liquidity Position'}
          </h4>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {myLiquidity.total.toLocaleString('en-US')} eHKD
            </div>
            <div className="text-sm text-gray-600">
              {language === 'zh' ? '占总池子' : 'Pool Share'}: {myLiquidity.poolShare}%
            </div>
          </div>
        </div>

        {/* 收益仪表盘 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? '收益仪表盘' : 'Revenue Dashboard'}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'zh' ? '今日收益' : 'Today'}
              </div>
              <div className="text-lg font-bold text-green-700">
                {myLiquidity.todayRevenue.toLocaleString('en-US')} eHKD
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'zh' ? '累计收益' : 'Cumulative'}
              </div>
              <div className="text-lg font-bold text-blue-700">
                {myLiquidity.cumulativeRevenue.toLocaleString('en-US')} eHKD
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'zh' ? '年化收益率' : 'APY'}
              </div>
              <div className="text-lg font-bold text-purple-700">
                {myLiquidity.annualizedYield}%
              </div>
            </div>
          </div>
        </div>

        {/* 收益趋势图 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? '收益趋势' : 'Revenue Trend'}
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={revenueTrend}>
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => language === 'zh' 
                  ? (value === 'today' ? '今日' : '累计')
                  : (value === 'today' ? 'Today' : 'Cumulative')
                }
              />
              <Line 
                type="monotone" 
                dataKey="today" 
                stroke="#10b981" 
                strokeWidth={2}
                name="today"
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="cumulative"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 添加/移除流动性操作 */}
        <div>
          <button
            onClick={onLiquidityManage}
            className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <i className="fas fa-sliders-h mr-2"></i>
            {t('fundRecovery.addRemoveLiquidity')}
          </button>
        </div>

        {/* 风险评估指标 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? '风险评估指标' : 'Risk Assessment Metrics'}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '池子集中度' : 'Pool Concentration'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${riskMetrics.poolConcentration}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {riskMetrics.poolConcentration}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '池子利用率' : 'Pool Utilization'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${riskMetrics.utilizationRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {riskMetrics.utilizationRate}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '风险等级' : 'Risk Level'}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(riskMetrics.riskLevel)}`}>
                {language === 'zh' 
                  ? (riskMetrics.riskLevel === 'low' ? '低' : riskMetrics.riskLevel === 'medium' ? '中' : '高')
                  : riskMetrics.riskLevel.charAt(0).toUpperCase() + riskMetrics.riskLevel.slice(1)
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiquidityManagement
