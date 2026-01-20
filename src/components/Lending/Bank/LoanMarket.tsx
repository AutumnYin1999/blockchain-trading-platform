import { LoanApplication } from '../BankView'
import { useLanguage } from '../../../hooks/useLanguage'

interface LoanMarketProps {
  applications: LoanApplication[]
  onBid: (application: LoanApplication) => void
  onViewDetail: (application: LoanApplication) => void
  onReject: (application: LoanApplication) => void
}

function LoanMarket({ applications, onBid, onViewDetail, onReject }: LoanMarketProps) {
  const { t, language } = useLanguage()

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 90) return language === 'zh' ? '低风险' : 'Low Risk'
    if (score >= 70) return language === 'zh' ? '中风险' : 'Medium Risk'
    return language === 'zh' ? '高风险' : 'High Risk'
  }

  const calculateLTV = (collateralValue: number, loanAmount: number) => {
    return ((loanAmount / collateralValue) * 100).toFixed(1)
  }

  const getSuggestedRateRange = (riskScore: number) => {
    if (riskScore >= 90) return language === 'zh' ? '5.5% - 7.0%' : '5.5% - 7.0%'
    if (riskScore >= 70) return language === 'zh' ? '7.0% - 9.0%' : '7.0% - 9.0%'
    return language === 'zh' ? '9.0% - 12.0%' : '9.0% - 12.0%'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fas fa-hand-holding-usd mr-2 text-blue-600"></i>
          {language === 'zh' ? '可审批的贷款申请' : 'Loan Applications for Approval'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {language === 'zh' ? '查看并审批新的贷款申请' : 'Review and approve new loan applications'}
        </p>
      </div>

      <div className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
            <p>{language === 'zh' ? '暂无待审批的贷款申请' : 'No pending loan applications'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applications.map(application => {
              const ltv = calculateLTV(application.collateralValue, application.loanAmount)
              return (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all hover:border-blue-300"
                >
                  {/* 第一行：申请编号 + 借款人 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800 text-lg">{application.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        application.status === '待投标' || application.status === 'Pending Bid'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {application.status === '待投标' ? (language === 'zh' ? '待审批' : 'Pending') : 
                         application.status === '投标中' ? (language === 'zh' ? '审批中' : 'In Review') :
                         application.status === '已匹配' ? (language === 'zh' ? '已匹配' : 'Matched') : application.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'zh' ? '借款人：' : 'Borrower: '}
                      <span className="font-medium text-gray-800">{application.borrower}</span>
                    </div>
                  </div>

                  {/* 第二行：关键指标 */}
                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {language === 'zh' ? '抵押品总值' : 'Total Collateral'}
                      </div>
                      <div className="font-semibold text-gray-800 font-mono">
                        {application.collateralValue.toLocaleString('en-US')} eHKD
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {language === 'zh' ? '申请金额' : 'Loan Amount'}
                      </div>
                      <div className="font-semibold text-gray-800 font-mono">
                        {application.loanAmount.toLocaleString('en-US')} eHKD
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {language === 'zh' ? '抵押率 (LTV)' : 'LTV Ratio'}
                      </div>
                      <div className={`font-semibold font-mono ${
                        parseFloat(ltv) > 80 ? 'text-red-600' : parseFloat(ltv) > 70 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {ltv}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {language === 'zh' ? '期限' : 'Term'}
                      </div>
                      <div className="font-semibold text-gray-800 font-mono">
                        {application.term} {language === 'zh' ? '天' : 'days'}
                      </div>
                    </div>
                  </div>

                  {/* 第三行：风险信息 */}
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        {language === 'zh' ? '风险评分' : 'Risk Score'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(application.riskScore)}`}>
                        {application.riskScore} ({getRiskLabel(application.riskScore)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {language === 'zh' ? '建议利率范围' : 'Suggested Rate Range'}
                      </span>
                      <span className="font-semibold text-blue-600 text-sm">
                        {getSuggestedRateRange(application.riskScore)}
                      </span>
                    </div>
                    {application.currentLowestRate > 0 && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          {language === 'zh' ? '当前最低报价' : 'Current Lowest Bid'}
                        </span>
                        <span className="font-medium text-gray-700 text-xs">
                          {application.currentLowestRate}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 第四行：操作按钮 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetail(application)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      {language === 'zh' ? '查看详情' : 'View Details'}
                    </button>
                    <button
                      onClick={() => onBid(application)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      <i className="fas fa-check-circle mr-2"></i>
                      {language === 'zh' ? '批准并报价' : 'Approve & Quote'}
                    </button>
                    <button
                      onClick={() => onReject(application)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoanMarket
