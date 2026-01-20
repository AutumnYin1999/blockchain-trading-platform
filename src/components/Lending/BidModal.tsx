import { useState, useMemo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { LoanApplication } from './Bank/BankView'

interface BidModalProps {
  application: LoanApplication
  onConfirm: (applicationId: string, rate: number, amount: number) => void
  onClose: () => void
}

function BidModal({ application, onConfirm, onClose }: BidModalProps) {
  const { t, language } = useLanguage()
  const [rate, setRate] = useState(application.currentLowestRate.toString())
  const [amount, setAmount] = useState(application.loanAmount.toString())
  const [isPartial, setIsPartial] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const bidRate = parseFloat(rate)
    const bidAmount = parseFloat(amount)

    if (bidRate < 0 || bidRate > 20) {
      alert(t('lending.rateRangeError'))
      return
    }

    if (bidAmount <= 0 || bidAmount > application.loanAmount) {
      alert(t('lending.amountRangeError').replace('{amount}', application.loanAmount.toLocaleString('en-US')))
      return
    }

    if (bidRate > application.currentLowestRate) {
      const confirmMsg = t('lending.rateTooHighConfirm')
        .replace('{rate}', bidRate.toString())
        .replace('{lowestRate}', application.currentLowestRate.toString())
      if (!confirm(confirmMsg)) {
        return
      }
    }

    onConfirm(application.id, bidRate, bidAmount)
  }

  const estimatedInterest = useMemo(() => {
    if (!rate || !amount) return 0
    const r = parseFloat(rate)
    const a = parseFloat(amount)
    return a * r / 100 * application.term / 365
  }, [rate, amount, application.term])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {language === 'zh' ? '批准并报价' : 'Approve & Quote'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 借款申请信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{t('lending.applicationInfo')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('lending.applicationId')}</span>
                <span className="font-medium text-gray-800">{application.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('lending.loanAmountLabel')}</span>
                <span className="font-medium text-gray-800">
                  {application.loanAmount.toLocaleString('en-US')} eHKD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('lending.loanTermLabel')}</span>
                <span className="font-medium text-gray-800">{application.term} {t('lending.daysUnit')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('lending.currentLowestRateLabel2')}</span>
                <span className="font-semibold text-blue-600">{application.currentLowestRate}%</span>
              </div>
            </div>
          </div>

          {/* 报价利率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '报价利率' : 'Quote Rate'} <span className="text-red-500">{t('lending.required')}</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                max="20"
                step="0.1"
                placeholder={t('lending.enterRate')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-3.5 text-gray-500 text-sm">{t('lending.annualizedUnit')}</span>
            </div>
            {rate && parseFloat(rate) > application.currentLowestRate && (
              <p className="mt-1 text-sm text-yellow-600">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {t('lending.rateTooHigh')}
              </p>
            )}
          </div>

          {/* 报价金额 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center justify-between">
                <span>{language === 'zh' ? '报价金额' : 'Quote Amount'} <span className="text-red-500">{t('lending.required')}</span></span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPartial}
                    onChange={(e) => setIsPartial(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">{t('lending.partialBid')}</span>
                </label>
              </div>
            </label>
            <div className="relative">
              <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={application.loanAmount}
                placeholder={t('lending.enterBidAmount')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-3.5 text-gray-500 text-sm">eHKD</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {t('lending.maxBidable')} {application.loanAmount.toLocaleString('en-US')} eHKD
            </div>
            {amount && parseFloat(amount) > application.loanAmount && (
              <p className="mt-1 text-sm text-red-500">
                {t('lending.bidAmountExceeded')}
              </p>
            )}
          </div>

          {/* 预估收益 */}
          {rate && amount && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('lending.bidAmountLabel')}：</span>
                  <span className="font-medium text-gray-800">
                    {parseFloat(amount).toLocaleString('en-US')} eHKD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('lending.estimatedInterestIncome')}</span>
                  <span className="font-semibold text-blue-600">
                    {estimatedInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-800">{t('lending.estimatedTotalRecovery')}</span>
                    <span className="text-blue-600">
                      {(parseFloat(amount) + estimatedInterest).toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!rate || !amount || parseFloat(amount) > application.loanAmount}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-check-circle mr-2"></i>
              {language === 'zh' ? '提交报价' : 'Submit Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BidModal
