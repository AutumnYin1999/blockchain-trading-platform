import { useLanguage } from '../../hooks/useLanguage'

interface SuccessModalProps {
  tokenId: string
  tokenHash: string
  onClose: () => void
}

function SuccessModal({ tokenId, tokenHash, onClose }: SuccessModalProps) {
  const { t } = useLanguage()
  const copyHash = () => {
    navigator.clipboard.writeText(tokenHash)
    // 可以添加一个提示消息
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* 成功图标和标题 */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-3xl text-green-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('assetIssuance.issuanceSuccess')}</h3>
          <p className="text-gray-600">{t('assetIssuance.tokenIssuedSuccessfully')}</p>
        </div>

        {/* 代币信息 */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('assetIssuance.tokenId')}
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <i className="fas fa-hashtag text-gray-400"></i>
              <span className="font-mono text-sm text-gray-800">{tokenId}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('assetIssuance.transactionHash')}
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <i className="fas fa-link text-gray-400"></i>
              <span className="font-mono text-xs text-blue-600 flex-1 break-all">
                {tokenHash}
              </span>
              <button
                onClick={copyHash}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title={t('assetIssuance.copyHash')}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t('assetIssuance.nextSteps')}</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>{t('assetIssuance.tokenRecordedOnBlockchain')}</li>
                  <li>{t('assetIssuance.canViewInMarketTrading')}</li>
                  <li>{t('assetIssuance.hashCanQueryDetails')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 按钮 */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('assetIssuance.confirm')}
          </button>
          <button
            onClick={() => {
              copyHash()
              // 可以添加一个提示
            }}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            {t('assetIssuance.viewTransaction')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
