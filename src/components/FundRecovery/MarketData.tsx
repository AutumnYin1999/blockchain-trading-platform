import { useLanguage } from '../../hooks/useLanguage'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { getDepthData, getRecentActivity } from './ForexPoolPanel'

function MarketData() {
  const { t, language } = useLanguage()

  // NBFI兑换占比统计
  const nbfiConversionStats = [
    { name: language === 'zh' ? '银行' : 'Bank', value: 35, color: '#3b82f6' },
    { name: language === 'zh' ? 'NBFI' : 'NBFI', value: 65, color: '#8b5cf6' },
  ]

  // 手续费收入趋势（最近7天）
  const feeRevenueTrend = [
    { date: '01-08', revenue: 12500 },
    { date: '01-09', revenue: 13200 },
    { date: '01-10', revenue: 14100 },
    { date: '01-11', revenue: 15200 },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        <i className="fas fa-chart-line mr-2 text-green-600"></i>
        {language === 'zh' ? '外汇池市场数据' : 'Forex Pool Market Data'}
      </h3>

      <div className="space-y-6">
        {/* 池子深度图（交互式） */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {t('fundRecovery.poolDepthChart')}
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getDepthData()}>
              <XAxis
                dataKey="price"
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
                formatter={(value: number) => `${value.toLocaleString('en-US')} eHKD`}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => language === 'zh'
                  ? (value === 'buy' ? '买入' : '卖出')
                  : (value === 'buy' ? 'Buy' : 'Sell')
                }
              />
              <Bar dataKey="buy" fill="#10b981" name="buy" />
              <Bar dataKey="sell" fill="#ef4444" name="sell" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 实时兑换活动流 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {t('fundRecovery.realTimeConversionActivity')}
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {getRecentActivity(t).map(activity => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <i className={`fas ${activity.type === 'buy' ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'}`}></i>
                  <span className="text-sm font-medium text-gray-800">
                    {activity.amount.toLocaleString('en-US')} USDC
                  </span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NBFI兑换占比统计 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? 'NBFI兑换占比统计' : 'NBFI Conversion Share Statistics'}
          </h4>
          <div className="flex items-center space-x-4">
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie
                  data={nbfiConversionStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nbfiConversionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {nbfiConversionStats.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 手续费收入趋势 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'zh' ? '手续费收入趋势' : 'Fee Revenue Trend'}
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={feeRevenueTrend}>
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: number) => `${value.toLocaleString('en-US')} eHKD`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MarketData
