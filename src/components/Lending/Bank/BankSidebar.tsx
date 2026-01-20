import { BankLoan } from '../BankView'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useLanguage } from '../../../hooks/useLanguage'

interface BankSidebarProps {
  totalLentAmount: number
  totalInterest: number
  badDebtRate: number
  loans: BankLoan[]
  onViewWarningLoans?: () => void
}

function BankSidebar({ totalLentAmount, totalInterest, badDebtRate, loans, onViewWarningLoans }: BankSidebarProps) {
  const { t, language } = useLanguage()

  // 按状态分组
  const normalLoans = loans.filter(l => l.status === '正常' || l.status === 'Normal')
  const warningLoans = loans.filter(l => l.status === '预警' || l.status === 'Warning')
  const overdueLoans = loans.filter(l => l.status === '逾期' || l.status === 'Overdue')

  const statusData = [
    { 
      name: language === 'zh' ? '正常' : 'Normal', 
      value: normalLoans.length, 
      color: '#10b981',
      percentage: loans.length > 0 ? Math.round((normalLoans.length / loans.length) * 100) : 0
    },
    { 
      name: language === 'zh' ? '预警' : 'Warning', 
      value: warningLoans.length, 
      color: '#f59e0b',
      percentage: loans.length > 0 ? Math.round((warningLoans.length / loans.length) * 100) : 0
    },
    { 
      name: language === 'zh' ? '逾期' : 'Overdue', 
      value: overdueLoans.length, 
      color: '#ef4444',
      percentage: loans.length > 0 ? Math.round((overdueLoans.length / loans.length) * 100) : 0
    },
  ]

  // 计算抵押品健康度
  const calculateOverallLTV = () => {
    // 模拟计算整体抵押率
    return 68 // 示例值
  }

  const overallLTV = calculateOverallLTV()
  const warningLoanCount = warningLoans.length
  const highestLTVLoan = loans.length > 0 ? loans[0] : null // 简化，实际应该计算最高LTV

  // 模拟趋势数据
  const trends = {
    totalLentAmount: { value: 2.5, direction: 'up' },
    totalInterest: { value: 1.8, direction: 'up' },
    badDebtRate: { value: 0.3, direction: 'down' },
  }

  const TrendArrow = ({ value, direction }: { value: number; direction: 'up' | 'down' }) => (
    <span className={`ml-2 text-xs font-medium ${direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
      {direction === 'up' ? '↑' : '↓'}{value}%
    </span>
  )

  return (
    <div className="space-y-6">
      {/* 贷款统计 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
          {language === 'zh' ? '贷款统计' : 'Loan Statistics'}
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              {language === 'zh' ? '累计放贷总额' : 'Total Lent Amount'}
              <TrendArrow value={trends.totalLentAmount.value} direction={trends.totalLentAmount.direction} />
            </div>
            <div className="text-2xl font-bold text-gray-800 font-mono">
              {totalLentAmount.toLocaleString('en-US')} eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              {language === 'zh' ? '累计利息收入' : 'Total Interest Income'}
              <TrendArrow value={trends.totalInterest.value} direction={trends.totalInterest.direction} />
            </div>
            <div className="text-2xl font-bold text-green-600 font-mono">
              {totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              {language === 'zh' ? '坏账率' : 'Bad Debt Rate'}
              <TrendArrow value={trends.badDebtRate.value} direction={trends.badDebtRate.direction} />
            </div>
            <div className="text-2xl font-bold text-gray-800 font-mono">
              {badDebtRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* 贷款分布环形图 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
          {language === 'zh' ? '贷款分布' : 'Loan Distribution'}
        </h3>
        {loans.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <i className="fas fa-chart-pie text-2xl text-gray-300 mb-2"></i>
            <p>{language === 'zh' ? '暂无数据' : 'No data'}</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">{item.value} {language === 'zh' ? '笔' : 'loans'}</span>
                    <span className="text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 抵押品健康度监控 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-shield-alt mr-2 text-blue-600"></i>
          {language === 'zh' ? '抵押品健康度监控' : 'Collateral Health Monitor'}
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">
              {language === 'zh' ? '当前整体抵押率' : 'Current Overall LTV'}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-800 font-mono">{overallLTV}%</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                overallLTV > 80 ? 'bg-red-100 text-red-700' :
                overallLTV > 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {overallLTV > 80 ? (language === 'zh' ? '危险' : 'Danger') :
                 overallLTV > 70 ? (language === 'zh' ? '警告' : 'Warning') :
                 (language === 'zh' ? '安全' : 'Safe')}
              </span>
            </div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-gray-600 mb-1">
              {language === 'zh' ? '触发预警的贷款' : 'Warning Loans'}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800 font-mono">
                {warningLoanCount} {language === 'zh' ? '笔' : 'loans'}
              </div>
              {warningLoanCount > 0 && onViewWarningLoans && (
                <button
                  onClick={onViewWarningLoans}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {language === 'zh' ? '查看' : 'View'} →
                </button>
              )}
            </div>
          </div>
          {highestLTVLoan && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm text-gray-600 mb-1">
                {language === 'zh' ? '最高抵押率贷款' : 'Highest LTV Loan'}
              </div>
              <div className="text-sm font-semibold text-gray-800 font-mono mb-1">
                {highestLTVLoan.id}
              </div>
              <div className="text-xs text-gray-600">
                LTV: <span className="font-semibold text-red-600">82%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BankSidebar
