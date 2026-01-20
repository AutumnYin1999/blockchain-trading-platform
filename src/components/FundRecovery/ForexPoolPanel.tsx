import { useLanguage } from '../../hooks/useLanguage'

interface ForexPoolPanelProps {
  userRole: string
  exchangeRate: number
  onLiquidityManage: () => void
}

function ForexPoolPanel({ userRole, exchangeRate, onLiquidityManage }: ForexPoolPanelProps) {
  const { t } = useLanguage()
  const isAdmin = userRole === 'admin' || userRole === '系统管理员'
  const isBank = userRole === 'Bank' || userRole === '银行' || isAdmin

  return (
    <div className="space-y-6">
      {/* 池子概览 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-swimming-pool mr-2 text-blue-600"></i>
          {t('fundRecovery.forexPoolStatus')}
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.totalLiquidity')}</div>
            <div className="text-2xl font-bold text-gray-800">
              15,800,000 eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.dailyTradingVolume')}</div>
            <div className="text-2xl font-bold text-blue-600">
              3,250,000 eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.currentExchangeRate')}</div>
            <div className="text-2xl font-bold text-green-600">
              1 USDC = {exchangeRate.toFixed(2)} eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.dailyRateFluctuation')}</div>
            <div className="text-lg font-semibold text-gray-800">
              <span className="text-green-600">±0.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 流动性提供者视图（银行） */}
      {isBank && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-chart-line mr-2 text-green-600"></i>
            {t('fundRecovery.myLiquidity')}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.myLiquidityContribution')}</div>
              <div className="text-2xl font-bold text-gray-800">
                2,500,000 eHKD
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.todayFeeRevenue')}</div>
              <div className="text-2xl font-bold text-green-600">
                850 eHKD
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.annualizedYield')}</div>
              <div className="text-2xl font-bold text-blue-600">
                3.7%
              </div>
            </div>
            <button
              onClick={onLiquidityManage}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-4"
            >
              <i className="fas fa-sliders-h mr-2"></i>
              {t('fundRecovery.addRemoveLiquidity')}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

// 导出池子深度数据和实时活动数据，供主页面使用
export function getDepthData() {
  return [
    { price: 7.75, buy: 500000, sell: 0 },
    { price: 7.76, buy: 450000, sell: 0 },
    { price: 7.77, buy: 400000, sell: 0 },
    { price: 7.78, buy: 350000, sell: 0 },
    { price: 7.79, buy: 300000, sell: 0 },
    { price: 7.80, buy: 250000, sell: 0 },
    { price: 7.81, buy: 200000, sell: 0 },
    { price: 7.82, buy: 0, sell: 0 },
    { price: 7.83, buy: 0, sell: 200000 },
    { price: 7.84, buy: 0, sell: 250000 },
    { price: 7.85, buy: 0, sell: 300000 },
    { price: 7.86, buy: 0, sell: 350000 },
    { price: 7.87, buy: 0, sell: 400000 },
    { price: 7.88, buy: 0, sell: 450000 },
    { price: 7.89, buy: 0, sell: 500000 },
  ]
}

export function getRecentActivity(t: (key: string) => string) {
  return [
    { id: 'TXN-001', type: 'buy', amount: 50000, time: `2 ${t('fundRecovery.minutesAgo')}` },
    { id: 'TXN-002', type: 'sell', amount: 30000, time: `5 ${t('fundRecovery.minutesAgo')}` },
    { id: 'TXN-003', type: 'buy', amount: 80000, time: `8 ${t('fundRecovery.minutesAgo')}` },
    { id: 'TXN-004', type: 'sell', amount: 45000, time: `12 ${t('fundRecovery.minutesAgo')}` },
  ]
}

export default ForexPoolPanel
