import { Token } from '../../pages/MarketTrading'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useLanguage } from '../../hooks/useLanguage'

interface MarketSidebarProps {
  watchlist: string[]
  tokens: Token[]
  recentTransactions: any[]
  onRemoveFromWatchlist: (tokenId: string) => void
}

function MarketSidebar({ watchlist, tokens, recentTransactions, onRemoveFromWatchlist }: MarketSidebarProps) {
  const { t } = useLanguage()
  // 获取观察列表中的代币
  const watchedTokens = tokens.filter(token => watchlist.includes(token.id))

  // 模拟市场趋势数据
  const trendData = [
    { day: t('marketTrading.monday'), price: 45000 },
    { day: t('marketTrading.tuesday'), price: 45200 },
    { day: t('marketTrading.wednesday'), price: 44800 },
    { day: t('marketTrading.thursday'), price: 45500 },
    { day: t('marketTrading.friday'), price: 46000 },
    { day: t('marketTrading.saturday'), price: 45800 },
    { day: t('marketTrading.sunday'), price: 46200 },
  ]

  return (
    <div className="space-y-6">
      {/* 我的观察列表 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-star mr-2 text-yellow-500"></i>
            {t('marketTrading.myWatchlist')}
          </h3>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          {watchedTokens.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              <i className="fas fa-star text-2xl text-gray-300 mb-2"></i>
              <p>{t('marketTrading.noWatchedTokens')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('marketTrading.clickStarToAdd')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchedTokens.map(token => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{token.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        token.type === 'receivable'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {token.type === 'receivable' ? 'AR' : 'INV'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {token.currentPrice.toLocaleString('en-US')} eHKD
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromWatchlist(token.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                    title={t('marketTrading.remove')}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 最近交易 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-history mr-2 text-blue-600"></i>
            {t('marketTrading.recentTransactions')}
          </h3>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              <i className="fas fa-exchange-alt text-2xl text-gray-300 mb-2"></i>
              <p>{t('marketTrading.noTransactionRecords')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{tx.tokenId}</span>
                    <span className="text-xs text-gray-500">{tx.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{t('marketTrading.quantity')}: {tx.quantity}</span>
                    <span className="text-gray-800 font-medium">
                      {tx.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 市场趋势 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-chart-line mr-2 text-green-600"></i>
            {t('marketTrading.marketTrend')}
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trendData}>
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
                domain={['dataMin - 500', 'dataMax + 500']}
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
                formatter={(value: number) => [`${value.toLocaleString('en-US')} eHKD`, t('marketTrading.price')]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MarketSidebar
