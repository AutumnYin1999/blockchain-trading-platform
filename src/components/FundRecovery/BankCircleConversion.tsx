import { useState, useMemo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface BankCircleConversionProps {
  usdcBalance: number
  exchangeRate: number
  forexPoolRate: number
  onConversion: (data: any) => void
}

function BankCircleConversion({ 
  usdcBalance, 
  exchangeRate, 
  forexPoolRate,
  onConversion 
}: BankCircleConversionProps) {
  const { t, language } = useLanguage()
  const [conversionAmount, setConversionAmount] = useState('')
  const [circleAccountStatus, setCircleAccountStatus] = useState<'verified' | 'pending' | 'unverified'>('verified')
  const [circleAccountAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')

  // 计算预计接收的eHKD（银行免手续费）
  const estimatedEHKD = useMemo(() => {
    if (!conversionAmount) return 0
    const amount = parseFloat(conversionAmount)
    if (isNaN(amount) || amount <= 0) return 0
    return amount * exchangeRate
  }, [conversionAmount, exchangeRate])

  const handleMaxAmount = () => {
    setConversionAmount(usdcBalance.toString())
  }

  const handleConvert = () => {
    if (!conversionAmount || parseFloat(conversionAmount) <= 0) {
      alert(language === 'zh' ? '请输入有效的兑换金额' : 'Please enter a valid conversion amount')
      return
    }

    onConversion({
      amount: parseFloat(conversionAmount),
      estimatedEHKD,
      fee: 0,
      exchangeRate,
      channel: 'circle'
    })
  }

  const getStatusLabel = () => {
    if (circleAccountStatus === 'verified') {
      return language === 'zh' ? '已验证' : 'Verified'
    } else if (circleAccountStatus === 'pending') {
      return language === 'zh' ? '验证中' : 'Pending'
    } else {
      return language === 'zh' ? '未验证' : 'Unverified'
    }
  }

  const getStatusColor = () => {
    if (circleAccountStatus === 'verified') return 'bg-green-100 text-green-700 border-green-200'
    if (circleAccountStatus === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="space-y-6">
      {/* 当前USDC余额（突出显示） */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">
              {language === 'zh' ? '当前USDC余额' : 'Current USDC Balance'}
            </div>
            <div className="text-4xl font-bold">
              {usdcBalance.toLocaleString('en-US')} USDC
            </div>
          </div>
          <i className="fas fa-wallet text-5xl opacity-20"></i>
        </div>
      </div>

      {/* Circle账户绑定状态 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-link mr-2 text-blue-600"></i>
          {language === 'zh' ? 'Circle账户绑定状态' : 'Circle Account Binding Status'}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                {getStatusLabel()}
              </div>
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '账户地址' : 'Account Address'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-gray-800">
                {circleAccountAddress.slice(0, 10)}...{circleAccountAddress.slice(-8)}
              </span>
              <button className="text-blue-600 hover:text-blue-700">
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          {circleAccountStatus === 'verified' && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <i className="fas fa-check-circle"></i>
              <span>{language === 'zh' ? '账户已验证，可进行Circle通道兑换' : 'Account verified, Circle channel conversion available'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 兑换操作表单 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-exchange-alt mr-2 text-blue-600"></i>
          {language === 'zh' ? 'Circle通道兑换' : 'Circle Channel Conversion'}
        </h3>

        <div className="space-y-4">
          {/* 兑换金额 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fundRecovery.conversionAmount')} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
                <input
                  type="text"
                  inputMode="decimal"
                  value={conversionAmount}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setConversionAmount(value)
                    }
                  }}
                  placeholder={t('fundRecovery.enterConversionAmount')}
                  className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-3.5 text-gray-500 text-sm">USDC</span>
              </div>
              <button
                onClick={handleMaxAmount}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {t('common.all')}
              </button>
            </div>
          </div>

          {/* 实时汇率对比 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">
              {language === 'zh' ? '实时汇率对比' : 'Real-time Exchange Rate Comparison'}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  {language === 'zh' ? 'Circle通道汇率' : 'Circle Channel Rate'}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  1 USDC = {exchangeRate.toFixed(4)} eHKD
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  {language === 'zh' ? '外汇池汇率' : 'Forex Pool Rate'}
                </div>
                <div className="text-lg font-bold text-gray-600">
                  1 USDC = {forexPoolRate.toFixed(4)} eHKD
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {language === 'zh' ? '汇率优势' : 'Rate Advantage'}
                </span>
                <span className={`font-semibold ${
                  exchangeRate >= forexPoolRate ? 'text-green-600' : 'text-red-600'
                }`}>
                  {exchangeRate >= forexPoolRate ? '+' : ''}
                  {((exchangeRate - forexPoolRate) / forexPoolRate * 100).toFixed(3)}%
                </span>
              </div>
            </div>
          </div>

          {/* 预计接收eHKD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fundRecovery.estimatedReceiveEHKD')}
            </label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">
                {estimatedEHKD.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'zh' ? '免手续费（银行特权）' : 'Fee-free (Bank Privilege)'}
              </div>
            </div>
          </div>

          {/* 兑换说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-gray-700">
                {language === 'zh' 
                  ? 'Circle通道兑换免手续费，实时到账，适合大额兑换。'
                  : 'Circle channel conversion is fee-free with instant settlement, suitable for large amounts.'}
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handleConvert}
            disabled={!conversionAmount || parseFloat(conversionAmount) <= 0 || parseFloat(conversionAmount) > usdcBalance || circleAccountStatus !== 'verified'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            {language === 'zh' ? '立即兑换' : 'Convert Now'}
          </button>
        </div>
      </div>

      {/* Circle通道兑换历史 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-history mr-2 text-blue-600"></i>
            {language === 'zh' ? 'Circle通道兑换历史' : 'Circle Channel Conversion History'}
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {language === 'zh' ? '交易ID' : 'Transaction ID'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {language === 'zh' ? '金额' : 'Amount'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {language === 'zh' ? '汇率' : 'Exchange Rate'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {language === 'zh' ? '状态' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {language === 'zh' ? '时间' : 'Time'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 模拟Circle通道历史记录 */}
                {[
                  { id: 'CIRCLE-001', amount: 50000, rate: 7.82, status: 'completed', time: '2025-01-10 10:30' },
                  { id: 'CIRCLE-002', amount: 100000, rate: 7.81, status: 'completed', time: '2025-01-09 14:20' },
                  { id: 'CIRCLE-003', amount: 30000, rate: 7.83, status: 'inProgress', time: '2025-01-11 09:15' },
                ].map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.amount.toLocaleString('en-US')} USDC
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      1 USDC = {record.rate.toFixed(4)} eHKD
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status === 'completed' 
                          ? (language === 'zh' ? '完成' : 'Completed')
                          : (language === 'zh' ? '处理中' : 'Processing')
                        }
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankCircleConversion
