import { useLanguage } from '../../hooks/useLanguage'

interface Issuance {
  id: string
  type: string
  amount: number
  status: string
  timestamp: string
  hash: string
  creditor?: string
  dueDate?: string
}

interface RecentIssuancesProps {
  issuances: Issuance[]
}

function RecentIssuances({ issuances }: RecentIssuancesProps) {
  const { t, language } = useLanguage()

  // 演示用示例数据
  const demoIssuances: Issuance[] = [
    {
      id: 'AR-2025-001',
      type: 'AR',
      amount: 1200000,
      status: language === 'zh' ? '已发行' : 'Issued',
      timestamp: '2025-01-10 14:32:10',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      creditor: language === 'zh' ? 'ABC建筑有限公司' : 'ABC Construction Co., Ltd.',
      dueDate: '2025-06-30',
    },
    {
      id: 'AR-2025-002',
      type: 'AR',
      amount: 800000,
      status: language === 'zh' ? '已转让' : 'Transferred',
      timestamp: '2025-01-08 10:15:45',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      creditor: language === 'zh' ? 'XYZ工程集团' : 'XYZ Engineering Group',
      dueDate: '2025-07-15',
    },
    {
      id: 'AR-2024-120',
      type: 'AR',
      amount: 500000,
      status: language === 'zh' ? '已付款' : 'Paid',
      timestamp: '2024-12-20 09:05:12',
      hash: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      creditor: language === 'zh' ? 'DEF建设股份公司' : 'DEF Construction Corp.',
      dueDate: '2025-03-31',
    },
  ]

  const dataToRender = (issuances && issuances.length > 0) ? issuances : demoIssuances
  const formatAmount = (amount: number): string => {
    if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)}M`
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(2)}K`
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const truncateHash = (hash: string): string => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <i className="fas fa-history mr-2 text-blue-600"></i>
          {t('assetIssuance.recentIssuances')}
        </h3>
      </div>

      <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="space-y-3">
          {dataToRender.map((issuance, index) => {
              const isReceivable = issuance.type === t('assetIssuance.receivableTab') || 
                                   issuance.type.includes('应收账款') || 
                                   issuance.type.includes('Accounts Receivable')
              const isListed = issuance.status === t('assetIssuance.listed') || 
                              issuance.status === '已上架' || 
                              issuance.status === 'Listed'
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{issuance.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          isReceivable ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {isReceivable ? 'AR' : 'INV'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatAmount(issuance.amount)} eHKD
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isListed ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {issuance.status}
                  </span>
                </div>

                {/* 关键信息行：债权人、到期日 */}
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-500 mr-1">
                      {language === 'zh' ? '债权人' : 'Creditor'}:
                    </span>
                    <span>{issuance.creditor || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 mr-1">
                      {language === 'zh' ? '到期日' : 'Due Date'}:
                    </span>
                    <span>{issuance.dueDate || '-'}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{issuance.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-link text-gray-400"></i>
                    <span className="font-mono text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                      {truncateHash(issuance.hash)}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(issuance.hash)}
                      className="text-gray-400 hover:text-gray-600"
                      title={t('assetIssuance.copyHash')}
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RecentIssuances
