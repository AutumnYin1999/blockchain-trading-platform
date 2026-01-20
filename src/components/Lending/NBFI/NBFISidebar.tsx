import { useLanguage } from '../../../hooks/useLanguage'
import { Loan } from '../NBFIView'

interface NBFISidebarProps {
  totalLoanAmount: number
  availableCollateral: number
  averageRate: number
  upcomingLoans: Loan[]
}

function NBFISidebar({ totalLoanAmount, availableCollateral, averageRate, upcomingLoans }: NBFISidebarProps) {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
          {t('lending.loanStatistics2')}
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">{t('lending.myTotalLoanAmount')}</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalLoanAmount.toLocaleString('en-US')} eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t('lending.availableCollateral')}</div>
            <div className="text-2xl font-bold text-blue-600">
              {availableCollateral.toLocaleString('en-US')} eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t('lending.currentAverageRate')}</div>
            <div className="text-2xl font-bold text-gray-800">
              {averageRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* 还款日历 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-calendar-alt mr-2 text-green-600"></i>
          {t('lending.repaymentCalendar')}
        </h3>
        {upcomingLoans.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <i className="fas fa-check-circle text-2xl text-gray-300 mb-2"></i>
            <p>{t('lending.noUpcomingLoans')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingLoans.map(loan => (
              <div
                key={loan.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{loan.id}</span>
                  <span className="text-xs text-gray-500">{loan.dueDate}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {t('lending.repaymentRequired')} <span className="font-semibold text-gray-800">
                    {loan.loanAmount.toLocaleString('en-US')} eHKD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NBFISidebar
