import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { Token } from '../../pages/MarketTrading'

interface PurchaseModalProps {
  token: Token
  onConfirm: (tokenId: string, quantity: number, totalPrice: number) => void
  onClose: () => void
}

function PurchaseModal({ token, onConfirm, onClose }: PurchaseModalProps) {
  const { t } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  const platformFee = 0.01 // 1% 平台费
  const subtotal = token.currentPrice * quantity
  const fee = subtotal * platformFee
  const total = subtotal + fee

  const handleConfirm = async () => {
    setIsProcessing(true)
    
    // 模拟交易处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const hash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    setTransactionHash(hash)
    setIsProcessing(false)
    setIsSuccess(true)
    
    // 延迟关闭并触发回调
    setTimeout(() => {
      onConfirm(token.id, quantity, total)
      onClose()
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('marketTrading.purchaseModal.transactionSuccess')}</h3>
            <p className="text-gray-600">{t('marketTrading.purchaseModal.tokenPurchaseCompleted')}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('marketTrading.purchaseModal.transactionHash')}
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="font-mono text-xs text-blue-600 flex-1 break-all">
                  {transactionHash}
                </span>
                <button
                  onClick={copyHash}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title={t('marketTrading.purchaseModal.copyHash')}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
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
            <h3 className="text-xl font-bold text-gray-800">{t('marketTrading.purchaseModal.confirmPurchaseTitle')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* 代币详情摘要 */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800">{token.id}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                token.type === 'receivable'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {token.type === 'receivable' ? t('marketTrading.receivable') : t('marketTrading.inventory')}
              </span>
            </div>
            {token.type === 'receivable' && (
              <div className="text-sm text-gray-600">
                {t('marketTrading.debtor')}：{token.debtor} | {t('marketTrading.dueDate')}：{token.dueDate}
              </div>
            )}
            {token.type === 'inventory' && (
              <div className="text-sm text-gray-600">
                {token.inventoryType} - {token.inventoryItem}
              </div>
            )}
          </div>

          {/* 购买数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.purchaseModal.purchaseQuantity')}
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <i className="fas fa-minus"></i>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          {/* 价格明细 */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('marketTrading.purchaseModal.unitPrice')}</span>
              <span className="text-gray-800 font-medium">
                {token.currentPrice.toLocaleString('en-US')} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('marketTrading.purchaseModal.quantity')}</span>
              <span className="text-gray-800 font-medium">{quantity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('marketTrading.purchaseModal.subtotal')}</span>
              <span className="text-gray-800 font-medium">
                {subtotal.toLocaleString('en-US')} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('marketTrading.purchaseModal.platformFee')}</span>
              <span className="text-gray-800 font-medium">
                {fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-800">{t('marketTrading.purchaseModal.total')}</span>
              <span className="text-blue-600">
                {total.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </span>
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
            {t('marketTrading.purchaseModal.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('marketTrading.purchaseModal.processing')}
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                {t('marketTrading.purchaseModal.confirmPurchase')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal
