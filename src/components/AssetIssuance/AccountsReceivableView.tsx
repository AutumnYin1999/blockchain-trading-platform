import { useLanguage } from '../../hooks/useLanguage'

// 建筑公司查看从核心企业收到的应收账款代票（只读模式）
function AccountsReceivableView() {
  const { language } = useLanguage()

  // 模拟数据：从核心企业收到的应收账款
  const receivables = [
    {
      id: 'AR-2024-001',
      issuer: '核心企业A',
      amount: 500000,
      dueDate: '2024-06-30',
      status: 'pending',
      receivedDate: '2024-01-15',
    },
    {
      id: 'AR-2024-002',
      issuer: '核心企业B',
      amount: 300000,
      dueDate: '2024-07-15',
      status: 'pending',
      receivedDate: '2024-01-20',
    },
    {
      id: 'AR-2024-003',
      issuer: '核心企业A',
      amount: 800000,
      dueDate: '2024-08-01',
      status: 'pending',
      receivedDate: '2024-02-01',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <i className="fas fa-info-circle text-blue-600"></i>
          <p className="text-sm text-blue-800">
            {language === 'zh' 
              ? '这些应收账款代票是从核心企业收到的，您可以在市场页面出售它们' 
              : 'These receivable tokens were received from core enterprises. You can sell them on the market page'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {receivables.map((receivable) => (
          <div
            key={receivable.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">{receivable.id}</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                    {language === 'zh' ? '待收款' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">
                      {language === 'zh' ? '发行方：' : 'Issuer: '}
                    </span>
                    <span className="font-medium text-gray-800">{receivable.issuer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      {language === 'zh' ? '金额：' : 'Amount: '}
                    </span>
                    <span className="font-medium text-gray-800">
                      {receivable.amount.toLocaleString()} eHKD
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      {language === 'zh' ? '到期日：' : 'Due Date: '}
                    </span>
                    <span className="font-medium text-gray-800">{receivable.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      {language === 'zh' ? '收到日期：' : 'Received Date: '}
                    </span>
                    <span className="font-medium text-gray-800">{receivable.receivedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {receivables.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-inbox text-4xl mb-4"></i>
          <p>{language === 'zh' ? '暂无应收账款代票' : 'No receivable tokens'}</p>
        </div>
      )}
    </div>
  )
}

export default AccountsReceivableView
