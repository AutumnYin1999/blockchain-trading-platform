import { useLanguage } from '../../../hooks/useLanguage'
import { Loan } from '../NBFIView'

interface MyLoansProps {
  loans: Loan[]
  onViewDetail: (loan: Loan) => void
}

function MyLoans({ loans, onViewDetail }: MyLoansProps) {
  const { t } = useLanguage()
  
  const getStatusColor = (status: string) => {
    if (status === t('lending.inReview') || status === '审核中' || status === 'In Review') {
      return 'bg-yellow-100 text-yellow-700'
    }
    if (status === t('lending.loanGranted') || status === '已放款' || status === 'Loan Granted') {
      return 'bg-blue-100 text-blue-700'
    }
    if (status === t('lending.repaying') || status === '还款中' || status === 'Repaying') {
      return 'bg-green-100 text-green-700'
    }
    if (status === t('lending.overdue') || status === '已逾期' || status === 'Overdue') {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-gray-100 text-gray-700'
  }
  
  const getStatusText = (status: string) => {
    if (status === '审核中' || status === 'In Review') return t('lending.inReview')
    if (status === '已放款' || status === 'Loan Granted') return t('lending.loanGranted')
    if (status === '还款中' || status === 'Repaying') return t('lending.repaying')
    if (status === '已逾期' || status === 'Overdue') return t('lending.overdue')
    return status
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fas fa-list mr-2 text-blue-600"></i>
          {t('lending.myCollateralizedLoans')}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.loanId')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.collateralToken')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.collateralValueLabel')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.loanAmount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.interestRate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.loanTerm')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.operations')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <i className="fas fa-inbox text-3xl text-gray-300 mb-3"></i>
                  <p>{t('lending.noLoanRecords')}</p>
                </td>
              </tr>
            ) : (
              loans.map(loan => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{loan.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      {loan.collateralTokens.map((token, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="font-medium">{token.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            token.type === '应收账款'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {token.type === '应收账款' ? 'AR' : 'INV'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {loan.collateralValue.toLocaleString('en-US')} eHKD
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {loan.loanAmount.toLocaleString('en-US')} eHKD
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{loan.interestRate}%</span>
                      <span className="text-gray-500 text-xs ml-1">{t('lending.annualized')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loan.term} {t('lending.daysUnit')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusText(loan.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(loan)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {t('lending.viewDetail')}
                    </button>
                    {(loan.status === t('lending.repaying') || loan.status === '还款中' || loan.status === 'Repaying') && (
                      <button className="text-green-600 hover:text-green-900">
                        {t('lending.earlyRepayment')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyLoans
