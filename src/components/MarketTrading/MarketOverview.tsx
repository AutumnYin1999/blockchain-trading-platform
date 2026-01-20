import { useLanguage } from '../../hooks/useLanguage'

function MarketOverview() {
  const { t } = useLanguage()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 市场总交易量 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.marketTotalVolume')}</span>
          <i className="fas fa-chart-line text-blue-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">1,245,800</div>
        <div className="text-sm text-gray-500 mt-1">eHKD</div>
      </div>

      {/* 活跃代币数量 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.activeTokenCount')}</span>
          <i className="fas fa-coins text-green-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">89</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.tokens')}</div>
      </div>

      {/* 今日交易笔数 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.todayTransactionCount')}</span>
          <i className="fas fa-exchange-alt text-purple-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">24</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.transactions')}</div>
      </div>

      {/* 平台总佣金 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.platformTotalCommission')}</span>
          <i className="fas fa-dollar-sign text-yellow-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">62,290</div>
        <div className="text-sm text-gray-500 mt-1">eHKD {t('marketTrading.today')}</div>
      </div>

      {/* 24小时市场变化 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.marketChange24h')}</span>
          <i className="fas fa-arrow-up text-green-500"></i>
        </div>
        <div className="text-2xl font-bold text-green-600">+2.4%</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.comparedToYesterday')}</div>
      </div>
    </div>
  )
}

export default MarketOverview
