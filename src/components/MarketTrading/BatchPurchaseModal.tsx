import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { Token } from '../../pages/MarketTrading'

interface BatchPurchaseModalProps {
  tokens: Token[]
  selectedTokenIds: string[]
  onConfirm: (purchases: { tokenId: string; quantity: number }[]) => void
  onClose: () => void
}

function BatchPurchaseModal({ tokens, selectedTokenIds, onConfirm, onClose }: BatchPurchaseModalProps) {
  const { language } = useLanguage()
  const selectedTokens = tokens.filter(t => selectedTokenIds.includes(t.id))
  const [quantities, setQuantities] = useState<Record<string, number>>(
    selectedTokens.reduce((acc, token) => ({ ...acc, [token.id]: 1 }), {})
  )

  const handleQuantityChange = (tokenId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [tokenId]: Math.max(1, quantity) }))
  }

  const totalAmount = selectedTokens.reduce((sum, token) => {
    return sum + (token.currentPrice * (quantities[token.id] || 1))
  }, 0)

  const platformFee = totalAmount * 0.01
  const finalTotal = totalAmount + platformFee

  const handleConfirm = () => {
    const purchases = selectedTokens.map(token => ({
      tokenId: token.id,
      quantity: quantities[token.id] || 1
    }))
    onConfirm(purchases)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {language === 'zh' ? '批量采购' : 'Batch Purchase'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {selectedTokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-info-circle text-4xl mb-3 text-gray-300"></i>
              <p>{language === 'zh' ? '请先选择要购买的代币' : 'Please select tokens to purchase first'}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedTokens.map(token => (
                  <div key={token.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-800">{token.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            token.type === 'receivable' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {token.type === 'receivable' 
                              ? (language === 'zh' ? '应收账款' : 'Receivable')
                              : (language === 'zh' ? '库存' : 'Inventory')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'zh' ? '单价：' : 'Unit Price: '}
                          <span className="font-medium text-gray-800">
                            {token.currentPrice.toLocaleString()} eHKD
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">
                          {language === 'zh' ? '数量：' : 'Quantity: '}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantities[token.id] || 1}
                          onChange={(e) => handleQuantityChange(token.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'zh' ? '小计：' : 'Subtotal: '}
                      <span className="font-semibold text-gray-800">
                        {((token.currentPrice * (quantities[token.id] || 1))).toLocaleString()} eHKD
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'zh' ? '总金额：' : 'Total Amount: '}</span>
                  <span className="font-medium text-gray-800">{totalAmount.toLocaleString()} eHKD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'zh' ? '平台费（1%）：' : 'Platform Fee (1%): '}</span>
                  <span className="font-medium text-gray-800">{platformFee.toLocaleString()} eHKD</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-gray-800">{language === 'zh' ? '总计：' : 'Final Total: '}</span>
                  <span className="text-blue-600">{finalTotal.toLocaleString()} eHKD</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {language === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedTokens.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {language === 'zh' ? '确认批量购买' : 'Confirm Batch Purchase'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BatchPurchaseModal
