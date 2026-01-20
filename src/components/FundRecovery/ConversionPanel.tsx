import { useState, useMemo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface ConversionPanelProps {
  userRole: string
  usdcBalance: number
  exchangeRate: number
  onConversion: (data: any) => void
}

function ConversionPanel({ userRole, usdcBalance, exchangeRate, onConversion }: ConversionPanelProps) {
  const { t, language } = useLanguage()
  const [conversionAmount, setConversionAmount] = useState('')
  const [slippageTolerance, setSlippageTolerance] = useState('0.5')

  const isAdmin = userRole === 'admin' || userRole === '系统管理员'
  const isBank = userRole === 'Bank' || userRole === '银行' || isAdmin
  const isNBFI = userRole === 'NBFI' || isAdmin

  // 计算预计接收的eHKD
  const estimatedEHKD = useMemo(() => {
    if (!conversionAmount) return 0
    const amount = parseFloat(conversionAmount)
    if (isNaN(amount) || amount <= 0) return 0

    if (isBank) {
      // 银行免手续费
      return amount * exchangeRate
    } else {
      // NBFI收取1.2%手续费
      return amount * exchangeRate * 0.988
    }
  }, [conversionAmount, exchangeRate, isBank])

  // 计算手续费
  const fee = useMemo(() => {
    if (!conversionAmount || isBank) return 0
    const amount = parseFloat(conversionAmount)
    return isNaN(amount) ? 0 : amount * exchangeRate * 0.012
  }, [conversionAmount, exchangeRate, isBank])

  // NBFI每日限额
  const dailyLimit = 500000
  const remainingLimit = dailyLimit - estimatedEHKD

  const handleMaxAmount = () => {
    setConversionAmount(usdcBalance.toString())
  }

  const handlePreview = () => {
    if (!conversionAmount || parseFloat(conversionAmount) <= 0) {
      alert(t('fundRecovery.enterValidAmount'))
      return
    }

    if (isNBFI && estimatedEHKD > dailyLimit) {
      alert(`${t('fundRecovery.exceedDailyLimit')} ${dailyLimit.toLocaleString('en-US')} eHKD`)
      return
    }

    onConversion({
      amount: parseFloat(conversionAmount),
      estimatedEHKD,
      fee,
      exchangeRate,
      slippageTolerance: isNBFI ? parseFloat(slippageTolerance) : undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* USDC余额概览 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-wallet mr-2 text-blue-600"></i>
          {t('fundRecovery.usdcBalanceOverview')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.currentBalance')}</div>
            <div className="text-2xl font-bold text-gray-800">
              {usdcBalance.toLocaleString('en-US')} USDC
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.todayConvertibleQuota')}</div>
            <div className="text-2xl font-bold text-blue-600">
              {isBank ? t('fundRecovery.unlimited') : `${dailyLimit.toLocaleString('en-US')} eHKD`}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">{t('fundRecovery.currentExchangeRate')}</div>
            <div className="text-2xl font-bold text-green-600">
              1 USDC = {exchangeRate.toFixed(2)} eHKD
            </div>
          </div>
        </div>
      </div>

      {/* 兑换表单 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className={`fas ${isBank ? 'fa-exchange-alt' : 'fa-swimming-pool'} mr-2 text-blue-600`}></i>
          {isBank ? t('fundRecovery.bankDirectConversion') : t('fundRecovery.nbfiForexPoolConversion')}
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
                    // 只允许数字和小数点
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
            {isNBFI && (
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max={usdcBalance}
                  step="100"
                  value={conversionAmount || 0}
                  onChange={(e) => setConversionAmount(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* 银行专用：Circle账户地址 */}
          {isBank && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fundRecovery.circleAccountAddress')}
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-800">
                    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NBFI专用：手续费和滑点 */}
          {isNBFI && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fundRecovery.estimatedHandlingFee')}
                </label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('fundRecovery.feeRate')}</span>
                    <span className="font-semibold text-yellow-700">1.2%</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">{t('fundRecovery.feeAmount')}</span>
                    <span className="font-semibold text-gray-800">
                      {fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fundRecovery.forexPoolSelection')}
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('fundRecovery.currentPoolDepth')}</span>
                    <span className="font-semibold text-blue-700">15,800,000 eHKD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('fundRecovery.exchangeRate')}</span>
                    <span className="font-semibold text-blue-700">
                      1 USDC = {exchangeRate.toFixed(2)} eHKD
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-check-circle text-green-500 mr-1"></i>
                    {t('fundRecovery.autoMatchOptimalPool')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.slippageProtection')} ({t('common.advancedOptions')})
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={slippageTolerance}
                    onChange={(e) => setSlippageTolerance(e.target.value)}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <span className="text-xs text-gray-500">{t('common.default')}: 0.5%</span>
                </div>
              </div>
            </>
          )}

          {/* 预计接收eHKD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fundRecovery.estimatedReceiveEHKD')}
            </label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">
                {estimatedEHKD.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </div>
              {isNBFI && (
                <div className="text-sm text-gray-600 mt-1">
                  {t('fundRecovery.afterDeduction')}
                </div>
              )}
            </div>
          </div>

          {/* 兑换说明 */}
          <div className={`rounded-lg p-3 ${
            isBank ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start space-x-2">
              <i className={`fas fa-info-circle mt-0.5 ${
                isBank ? 'text-blue-600' : 'text-gray-600'
              }`}></i>
              <div className="text-sm text-gray-700">
                {isBank ? (
                  <span>{t('fundRecovery.noHandlingFee')}</span>
                ) : (
                  <span>{t('fundRecovery.handlingFeeNote')}</span>
                )}
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handlePreview}
            disabled={!conversionAmount || parseFloat(conversionAmount) <= 0 || parseFloat(conversionAmount) > usdcBalance || (isNBFI && estimatedEHKD > dailyLimit)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${isBank ? 'fa-exchange-alt' : 'fa-eye'} mr-2`}></i>
            {isBank 
              ? (language === 'zh' ? '立即兑换' : 'Convert Now')
              : t('fundRecovery.previewConversion')
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConversionPanel
