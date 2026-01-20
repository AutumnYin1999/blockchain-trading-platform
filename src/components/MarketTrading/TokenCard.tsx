import { Token } from '../../pages/MarketTrading'
import { useLanguage } from '../../hooks/useLanguage'

interface TokenCardProps {
  token: Token
  onPurchase: () => void
  onToggleWatchlist: () => void
  isWatched: boolean
}

function TokenCard({ token, onPurchase, onToggleWatchlist, isWatched }: TokenCardProps) {
  const { t } = useLanguage()
  const isReceivable = token.type === 'receivable'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* 头部：代币ID和类型标签 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800">{token.id}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isReceivable
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {isReceivable ? t('marketTrading.receivable') : t('marketTrading.inventory')}
          </span>
        </div>
        <button
          onClick={onToggleWatchlist}
          className={`p-2 rounded-lg transition-colors ${
            isWatched
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={isWatched ? t('marketTrading.removeFromWatchlist') || '从观察列表移除' : t('marketTrading.addToWatchlist') || '添加到观察列表'}
        >
          <i className={`fas ${isWatched ? 'fa-star' : 'fa-star'}`}></i>
        </button>
      </div>

      {/* 应收账款代币内容 */}
      {isReceivable && (
        <>
          <div className="space-y-3 mb-4">
            <div>
              <span className="text-sm text-gray-600">{t('marketTrading.debtor') || '债务人'}:</span>
              <span className="text-sm font-medium text-gray-800 ml-1">{token.debtor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.faceValue') || '面值'}:</span>
              <span className="text-sm font-semibold text-gray-800">
                {token.faceValue.toLocaleString('en-US')} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.dueDate') || '到期日'}:</span>
              <span className="text-sm text-gray-800">{token.dueDate}</span>
              <span className="text-xs text-gray-500 ml-2">（{t('marketTrading.remaining') || '剩余'}{token.daysRemaining}{t('marketTrading.days') || '天'}）</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.annualYield') || '年化收益率'}:</span>
              <span className="text-sm font-semibold text-green-600">{token.annualYield}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.riskRating') || '风险评级'}:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                token.riskRating?.startsWith('A')
                  ? 'bg-green-100 text-green-700'
                  : token.riskRating?.startsWith('B')
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {token.riskRating}
              </span>
            </div>
          </div>
        </>
      )}

      {/* 库存代币内容 */}
      {!isReceivable && (
        <>
          <div className="space-y-3 mb-4">
            <div>
              <span className="text-sm text-gray-600">{t('marketTrading.inventoryType') || '库存类型'}:</span>
              <span className="text-sm font-medium text-gray-800 ml-1">{token.inventoryType}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">{t('marketTrading.item') || '物品'}:</span>
              <span className="text-sm font-medium text-gray-800 ml-1">{token.inventoryItem}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.valuation') || '估值'}:</span>
              <span className="text-sm font-semibold text-gray-800">
                {token.faceValue.toLocaleString('en-US')} eHKD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.storageLocation') || '存储位置'}:</span>
              <span className="text-sm text-gray-800">{token.storageLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('marketTrading.qualityStatus')}:</span>
              <span className={`text-sm font-medium ${
                token.qualityStatus === t('marketTrading.qualityStatuses.certified') || 
                token.qualityStatus === '已认证' || 
                token.qualityStatus === 'Certified'
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}>
                {token.qualityStatus === t('marketTrading.qualityStatuses.certified') || 
                 token.qualityStatus === '已认证' || 
                 token.qualityStatus === 'Certified'
                  ? `✅ ${t('marketTrading.certified')}` 
                  : `⏳ ${t('marketTrading.pendingCertification')}`}
              </span>
            </div>
          </div>
        </>
      )}

      {/* 价格信息 */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.currentPrice')}:</span>
          <span className="text-lg font-bold text-gray-800">
            {token.currentPrice.toLocaleString('en-US')} eHKD
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t('marketTrading.discount')}:</span>
          <span className={`text-sm font-semibold ${
            token.discount > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {token.discount > 0 ? '-' : '+'}{Math.abs(token.discount)}%
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{t('marketTrading.issuer')}:</span>
          <span className="text-xs text-gray-600">{token.issuer}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={onPurchase}
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          {t('marketTrading.buyNow')}
        </button>
        <button
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          title={t('marketTrading.setPriceAlert')}
        >
          <i className="fas fa-bell"></i>
        </button>
      </div>
    </div>
  )
}

export default TokenCard
