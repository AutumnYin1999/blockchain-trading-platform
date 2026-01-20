import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface ConversionConfirmModalProps {
  conversionData: any
  exchangeRate: number
  userRole: string
  onConfirm: () => void
  onClose: () => void
}

function ConversionConfirmModal({
  conversionData,
  exchangeRate,
  userRole,
  onConfirm,
  onClose,
}: ConversionConfirmModalProps) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  const isBank = userRole === 'Bank'

  const handleConfirm = async () => {
    setIsProcessing(true)

    // 模拟兑换处理
    await new Promise(resolve => setTimeout(resolve, 2000))

    const hash = '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    setTransactionHash(hash)
    setIsProcessing(false)
    setIsSuccess(true)

    setTimeout(() => {
      onConfirm()
    }, 2000)
  }

  const copyHash = () => {
    navigator.clipboard.writeText(transactionHash)
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 text-center border-b border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('fundRecovery.conversionSuccess')}</h3>
            <p className="text-gray-600">{t('fundRecovery.eHKDReceived')}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('fundRecovery.transactionHash')}
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="font-mono text-xs text-blue-600 flex-1 break-all">
                  {transactionHash}
                </span>
                <button
                  onClick={copyHash}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title={t('fundRecovery.copyHash')}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('fundRecovery.confirmConversion')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isProcessing}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* 兑换路径 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">{t('fundRecovery.conversionPath')}</h4>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-800">USDC</span>
              <i className="fas fa-arrow-right text-gray-400"></i>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isBank ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {isBank ? t('fundRecovery.bankDirectConversion') : t('fundRecovery.nbfiForexPoolConversion')}
              </span>
              <i className="fas fa-arrow-right text-gray-400"></i>
              <span className="font-medium text-gray-800">eHKD</span>
            </div>
          </div>

          {/* 金额明细 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{t('fundRecovery.amountDetails')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('fundRecovery.conversionAmount')}:</span>
                <span className="font-medium text-gray-800">
                  {conversionData.amount.toLocaleString('en-US')} USDC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('fundRecovery.exchangeRate')}</span>
                <span className="font-medium text-gray-800">
                  1 USDC = {exchangeRate.toFixed(2)} eHKD
                </span>
              </div>
              {!isBank && conversionData.fee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('fundRecovery.feeRate')} 1.2%</span>
                  <span className="font-medium text-gray-800">
                    {conversionData.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-800">{t('fundRecovery.estimatedReceiveEHKD')}:</span>
                  <span className="text-blue-600 text-lg">
                    {conversionData.estimatedEHKD.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 预计到账时间 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-clock text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">{t('fundRecovery.estimatedArrivalTime')}</div>
                <div className="text-blue-700">
                  {isBank ? t('fundRecovery.instantArrival') : t('fundRecovery.forexPoolProcessing')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('fundRecovery.processing')}
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                {t('fundRecovery.confirmConversion')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConversionConfirmModal
