import { useState } from 'react'
import { BankLoan } from '../BankView'
import { useLanguage } from '../../../hooks/useLanguage'

interface MyLendingProps {
  loans: BankLoan[]
  onViewDetail: (loan: BankLoan) => void
  onContact: (loan: BankLoan) => void
  onLiquidate: (loan: BankLoan) => void
}

type StatusFilter = 'all' | '正常' | '预警' | '逾期'

function MyLending({ loans, onViewDetail, onContact, onLiquidate }: MyLendingProps) {
  const { t, language } = useLanguage()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case '正常':
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-200'
      case '预警':
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case '逾期':
      case 'Overdue':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  
  const getStatusText = (status: string) => {
    if (status === '正常') return language === 'zh' ? '正常' : 'Normal'
    if (status === '预警') return language === 'zh' ? '预警' : 'Warning'
    if (status === '逾期') return language === 'zh' ? '逾期' : 'Overdue'
    return status
  }

  const filteredLoans = statusFilter === 'all' 
    ? loans 
    : loans.filter(loan => loan.status === statusFilter)

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-list mr-2 text-blue-600"></i>
            {language === 'zh' ? '我的贷款管理' : 'My Loan Management'}
          </h3>
          {/* 状态筛选器 */}
          <div className="flex space-x-2">
            {(['all', '正常', '预警', '逾期'] as StatusFilter[]).map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' && (language === 'zh' ? '全部' : 'All')}
                {filter === '正常' && (language === 'zh' ? '正常' : 'Normal')}
                {filter === '预警' && (language === 'zh' ? '预警' : 'Warning')}
                {filter === '逾期' && (language === 'zh' ? '逾期' : 'Overdue')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '贷款ID' : 'Loan ID'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.borrower')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '贷款金额' : 'Loan Amount'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.interestRate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.issueDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.dueDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('lending.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '操作' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <i className="fas fa-inbox text-3xl text-gray-300 mb-3"></i>
                  <p>{language === 'zh' ? '暂无贷款记录' : 'No loan records'}</p>
                </td>
              </tr>
            ) : (
              filteredLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">{loan.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loan.borrower}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 font-mono">
                      {loan.loanAmount.toLocaleString('en-US')} eHKD
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      <span className="font-semibold">{loan.interestRate}%</span>
                      <span className="text-gray-500 text-xs ml-1">{t('lending.annualized')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loan.issueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loan.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                      {getStatusText(loan.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetail(loan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={language === 'zh' ? '查看' : 'View'}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => onContact(loan)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={language === 'zh' ? '联系' : 'Contact'}
                      >
                        <i className="fas fa-comment"></i>
                      </button>
                      {(loan.status === '逾期' || loan.status === 'Overdue' || loan.status === '预警' || loan.status === 'Warning') && (
                        <button
                          onClick={() => onLiquidate(loan)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'zh' ? '清算' : 'Liquidate'}
                        >
                          <i className="fas fa-bolt"></i>
                        </button>
                      )}
                    </div>
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

export default MyLending
