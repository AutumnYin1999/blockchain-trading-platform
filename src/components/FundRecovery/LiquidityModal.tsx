import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface LiquidityModalProps {
  onClose: () => void
}

function LiquidityModal({ onClose }: LiquidityModalProps) {
  const { t, language } = useLanguage()
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理流动性操作
    alert(`${action === 'add' ? t('fundRecovery.addLiquidity') : t('fundRecovery.removeLiquidity')} ${t('fundRecovery.success')}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{t('fundRecovery.liquidityManagement')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 操作类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fundRecovery.operationType')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAction('add')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  action === 'add'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-plus mr-2"></i>
                {t('fundRecovery.addLiquidity')}
              </button>
              <button
                type="button"
                onClick={() => setAction('remove')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  action === 'remove'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-minus mr-2"></i>
                {t('fundRecovery.removeLiquidity')}
              </button>
            </div>
          </div>

          {/* 金额 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fundRecovery.liquidityAmount')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('fundRecovery.enterLiquidityAmount')}
                min="0"
                step="100"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-3.5 text-gray-500 text-sm">eHKD</span>
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                {action === 'add' ? (
                  <>
                    <div className="font-medium mb-1">{t('fundRecovery.addLiquidity')} {language === 'zh' ? '说明' : 'Description'}:</div>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>{t('fundRecovery.addLiquidityNote')}</li>
                      <li>{t('fundRecovery.annualizedYieldNote')}</li>
                      <li>{t('fundRecovery.canRemoveAnytime')}</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="font-medium mb-1">{t('fundRecovery.removeLiquidity')} {language === 'zh' ? '说明' : 'Description'}:</div>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>{t('fundRecovery.removeLiquidityNote')}</li>
                      <li>{t('fundRecovery.fundsReturned')}</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {language === 'zh' ? '取消' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <i className={`fas ${action === 'add' ? 'fa-plus' : 'fa-minus'} mr-2`}></i>
              {action === 'add' ? t('fundRecovery.addLiquidity') : t('fundRecovery.removeLiquidity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LiquidityModal
