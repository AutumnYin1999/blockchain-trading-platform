import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface RecoveryHistoryProps {
  userRole: string
}

interface HistoryRecord {
  id: string
  type: 'usdcDeposit' | 'forexExchange' // 改为英文键值
  amount: number
  currency: 'USDC' | 'eHKD'
  exchangeRate?: number
  fee?: number
  status: 'completed' | 'inProgress' | 'failed' // 改为英文键值
  timestamp: string
  hash?: string
}

function RecoveryHistory({ userRole }: RecoveryHistoryProps) {
  const { t, language } = useLanguage()
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // 模拟历史记录数据
  const historyRecords: HistoryRecord[] = [
    {
      id: 'TXN-2025-001',
      type: 'usdcDeposit',
      amount: 50000,
      currency: 'USDC',
      status: 'completed',
      timestamp: '2025-01-10 10:30:00',
      hash: '0x1234...5678',
    },
    {
      id: 'TXN-2025-002',
      type: 'forexExchange',
      amount: 391000,
      currency: 'eHKD',
      exchangeRate: 7.82,
      fee: 4680,
      status: 'completed',
      timestamp: '2025-01-10 10:35:00',
      hash: '0x2345...6789',
    },
    {
      id: 'TXN-2025-003',
      type: 'usdcDeposit',
      amount: 30000,
      currency: 'USDC',
      status: 'inProgress',
      timestamp: '2025-01-10 11:00:00',
    },
    {
      id: 'TXN-2025-004',
      type: 'forexExchange',
      amount: 234600,
      currency: 'eHKD',
      exchangeRate: 7.82,
      fee: 2808,
      status: 'inProgress',
      timestamp: '2025-01-10 11:05:00',
    },
  ]

  const getTypeLabel = (type: string) => {
    if (type === 'usdcDeposit') return t('fundRecovery.usdcDeposit')
    if (type === 'forexExchange') return t('fundRecovery.forexExchange')
    return type
  }

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return t('fundRecovery.completed')
    if (status === 'inProgress') return t('fundRecovery.inProgress')
    if (status === 'failed') return t('fundRecovery.failed')
    return status
  }

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700'
    if (status === 'inProgress') return 'bg-yellow-100 text-yellow-700'
    if (status === 'failed') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return 'fa-check-circle text-green-600'
    if (status === 'inProgress') return 'fa-spinner fa-spin text-yellow-600'
    if (status === 'failed') return 'fa-times-circle text-red-600'
    return 'fa-question-circle text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-history mr-2 text-blue-600"></i>
            {t('fundRecovery.recoveryHistory')}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-stream mr-1"></i>
              {t('fundRecovery.timeline')}
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-table mr-1"></i>
              {t('fundRecovery.table')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'timeline' ? (
          /* 时间线视图 */
          <div className="space-y-6">
            {historyRecords.map((record, index) => (
              <div key={record.id} className="relative">
                {/* 连接线 */}
                {index < historyRecords.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                )}

                <div className="flex items-start space-x-4">
                  {/* 状态图标 */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    record.status === 'completed' ? 'bg-green-100' :
                    record.status === 'inProgress' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <i className={`fas ${getStatusIcon(record.status)} text-xl`}></i>
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">{record.id}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{record.timestamp}</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t('fundRecovery.type')}:</span>
                          <span className="font-medium text-gray-800 ml-2">{getTypeLabel(record.type)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t('fundRecovery.amount')}:</span>
                          <span className="font-semibold text-gray-800 ml-2">
                            {record.amount.toLocaleString('en-US')} {record.currency}
                          </span>
                        </div>
                        {record.exchangeRate && (
                          <div>
                            <span className="text-gray-600">{t('fundRecovery.exchangeRate')}</span>
                            <span className="font-medium text-gray-800 ml-2">
                              1 USDC = {record.exchangeRate} eHKD
                            </span>
                          </div>
                        )}
                        {record.fee && (
                          <div>
                            <span className="text-gray-600">{t('fundRecovery.feeAmount')}</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {record.fee.toLocaleString('en-US')} eHKD
                            </span>
                          </div>
                        )}
                        {record.hash && (
                          <div className="col-span-2">
                            <span className="text-gray-600">{t('fundRecovery.transactionHash')}:</span>
                            <span className="font-mono text-xs text-blue-600 ml-2">{record.hash}</span>
                            <button className="ml-2 text-blue-600 hover:text-blue-700">
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 表格视图 */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {language === 'zh' ? '交易ID' : 'Transaction ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {t('fundRecovery.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {t('fundRecovery.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {t('fundRecovery.exchangeRate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {t('fundRecovery.feeAmount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {language === 'zh' ? '状态' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {language === 'zh' ? '操作' : 'Operations'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getTypeLabel(record.type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {record.amount.toLocaleString('en-US')} {record.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.exchangeRate ? `1 USDC = ${record.exchangeRate} eHKD` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.fee ? `${record.fee.toLocaleString('en-US')} eHKD` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        {language === 'zh' ? '查看' : 'View'}
                      </button>
                      {record.status === 'failed' && (
                        <button className="text-yellow-600 hover:text-yellow-900 mr-4">
                          {language === 'zh' ? '重试' : 'Retry'}
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        {language === 'zh' ? '报告问题' : 'Report Issue'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecoveryHistory
