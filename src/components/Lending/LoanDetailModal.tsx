import { useLanguage } from '../../hooks/useLanguage'
import { Loan } from './NBFI/NBFIView'
import { BankLoan } from './Bank/BankView'

interface LoanDetailModalProps {
  loan: Loan | BankLoan
  onClose: () => void
}

function LoanDetailModal({ loan, onClose }: LoanDetailModalProps) {
  const { t } = useLanguage()
  const isBankLoan = 'borrower' in loan && !('collateralValue' in loan)
  
  const getStatusText = (status: string) => {
    if (status === '正常' || status === 'Normal') return t('lending.normal')
    if (status === '预警' || status === 'Warning') return t('lending.warning')
    if (status === '逾期' || status === 'Overdue') return t('lending.overdue')
    if (status === '审核中' || status === 'In Review') return t('lending.inReview')
    if (status === '已放款' || status === 'Loan Granted') return t('lending.loanGranted')
    if (status === '还款中' || status === 'Repaying') return t('lending.repaying')
    return status
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('lending.loanDetails')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{t('lending.basicInfo')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('lending.loanId')}：</span>
                <span className="font-medium text-gray-800 ml-2">{loan.id}</span>
              </div>
              {isBankLoan && (
                <div>
                  <span className="text-gray-600">{t('lending.borrower')}：</span>
                  <span className="font-medium text-gray-800 ml-2">{loan.borrower}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">{t('lending.loanAmount')}：</span>
                <span className="font-medium text-gray-800 ml-2">
                  {loan.loanAmount.toLocaleString('en-US')} eHKD
                </span>
              </div>
              <div>
                <span className="text-gray-600">{t('lending.interestRate')}：</span>
                <span className="font-medium text-gray-800 ml-2">{loan.interestRate}% {t('lending.annualized')}</span>
              </div>
              {!isBankLoan && 'collateralValue' in loan && (
                <div>
                  <span className="text-gray-600">{t('lending.collateralValue')}：</span>
                  <span className="font-medium text-gray-800 ml-2">
                    {loan.collateralValue.toLocaleString('en-US')} eHKD
                  </span>
                </div>
              )}
              {!isBankLoan && 'term' in loan && (
                <div>
                  <span className="text-gray-600">{t('lending.loanTerm')}：</span>
                  <span className="font-medium text-gray-800 ml-2">{loan.term} {t('lending.daysUnit')}</span>
                </div>
              )}
              {isBankLoan && (
                <>
                  <div>
                    <span className="text-gray-600">{t('lending.issueDate')}：</span>
                    <span className="font-medium text-gray-800 ml-2">{loan.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('lending.dueDate')}：</span>
                    <span className="font-medium text-gray-800 ml-2">{loan.dueDate}</span>
                  </div>
                </>
              )}
              {!isBankLoan && 'createdAt' in loan && (
                <div>
                  <span className="text-gray-600">{t('lending.applicationDate')}：</span>
                  <span className="font-medium text-gray-800 ml-2">{loan.createdAt}</span>
                </div>
              )}
              {!isBankLoan && 'dueDate' in loan && loan.dueDate && (
                <div>
                  <span className="text-gray-600">{t('lending.dueDate')}：</span>
                  <span className="font-medium text-gray-800 ml-2">{loan.dueDate}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">{t('lending.status')}：</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                  loan.status === '正常' || loan.status === 'Normal' || 
                  loan.status === t('lending.normal') ||
                  loan.status === '已放款' || loan.status === 'Loan Granted' || 
                  loan.status === t('lending.loanGranted') ||
                  loan.status === '还款中' || loan.status === 'Repaying' || 
                  loan.status === t('lending.repaying')
                    ? 'bg-green-100 text-green-700'
                    : loan.status === '预警' || loan.status === 'Warning' || 
                      loan.status === t('lending.warning') ||
                      loan.status === '审核中' || loan.status === 'In Review' || 
                      loan.status === t('lending.inReview')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getStatusText(loan.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 抵押代币详情 */}
          {('collateralTokens' in loan) && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">{t('lending.collateralToken')}</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('lending.tokenId')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('lending.type')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('lending.value')}</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">{t('lending.realTimeValue')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loan.collateralTokens.map((token, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-gray-800">{token.id}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            token.type === '应收账款'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {token.type === '应收账款' ? 'AR' : 'INV'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {token.value.toLocaleString('en-US')} eHKD
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {/* 模拟实时价值（实际应该从API获取） */}
                          {(token.value * (0.98 + Math.random() * 0.04)).toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 还款计划表 */}
          {!isBankLoan && 'term' in loan && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">{t('lending.repaymentPlan')}</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('lending.principal')}</span>
                    <span className="font-medium text-gray-800">
                      {loan.loanAmount.toLocaleString('en-US')} eHKD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('lending.interestEstimated')}</span>
                    <span className="font-medium text-gray-800">
                      {(loan.loanAmount * loan.interestRate / 100 * loan.term / 365).toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-800">{t('lending.total')}</span>
                      <span className="text-blue-600">
                        {(loan.loanAmount * (1 + loan.interestRate / 100 * loan.term / 365)).toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 交易记录 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{t('lending.transactionRecords')}</h4>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3 text-sm">
                {!isBankLoan && 'createdAt' in loan && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-file-alt text-blue-600"></i>
                      <span className="text-gray-600">{t('lending.applicationSubmitted')}</span>
                    </div>
                    <span className="text-gray-800">{loan.createdAt}</span>
                  </div>
                )}
                {isBankLoan && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      <span className="text-gray-600">{t('lending.loanGranted2')}</span>
                    </div>
                    <span className="text-gray-800">{loan.issueDate}</span>
                  </div>
                )}
                {(loan.status === '已放款' || loan.status === 'Loan Granted' || 
                  loan.status === t('lending.loanGranted') ||
                  loan.status === '正常' || loan.status === 'Normal' || 
                  loan.status === t('lending.normal') ||
                  loan.status === '还款中' || loan.status === 'Repaying' || 
                  loan.status === t('lending.repaying')) && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-money-bill-wave text-green-600"></i>
                      <span className="text-gray-600">{t('lending.fundsReceived')}</span>
                    </div>
                    <span className="text-gray-800">
                      {isBankLoan ? loan.issueDate : t('lending.loanGranted')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          {loan.status === '逾期' && isBankLoan && (
            <div className="border-t border-gray-200 pt-4">
              <button className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                <i className="fas fa-gavel mr-2"></i>
                {t('lending.initiateLiquidation')}
              </button>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('lending.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoanDetailModal
