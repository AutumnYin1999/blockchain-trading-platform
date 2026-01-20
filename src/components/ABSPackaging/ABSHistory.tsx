import { useLanguage } from '../../hooks/useLanguage'
import { ABSProduct } from '../../pages/ABSPackaging'

interface ABSHistoryProps {
  absProducts: ABSProduct[]
}

function ABSHistory({ absProducts }: ABSHistoryProps) {
  const { t } = useLanguage()
  
  const getTypeIcon = (type: string) => {
    if (type === 'receivable') return 'fa-file-invoice-dollar text-blue-600'
    if (type === 'inventory') return 'fa-boxes text-green-600'
    return 'fa-layer-group text-purple-600'
  }

  const getTypeLabel = (type: string) => {
    if (type === 'receivable') return t('absPackaging.receivableTab')
    if (type === 'inventory') return t('absPackaging.inventoryTab')
    return t('absPackaging.mixedABS')
  }

  const getStatusColor = (status: string) => {
    if (status === t('absPackaging.soldOut')) return 'bg-green-100 text-green-700'
    if (status === t('absPackaging.inSale')) return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <i className="fas fa-history mr-2 text-blue-600"></i>
          {t('absPackaging.myAbsProducts')}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {absProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <i className="fas fa-inbox text-3xl text-gray-300 mb-3"></i>
            <p>{t('absPackaging.noAbsProducts')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('absPackaging.willShowAfterPackaging')}</p>
          </div>
        ) : (
          absProducts.map(product => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* 头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <i className={`fas ${getTypeIcon(product.type)}`}></i>
                    <span className="font-semibold text-gray-800">{product.id}</span>
                  </div>
                  <div className="text-sm text-gray-600">{product.name}</div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('absPackaging.totalScale')}：</span>
                  <span className="font-semibold text-gray-800">
                    {product.totalSize.toLocaleString('en-US')} eHKD
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('absPackaging.type')}：</span>
                  <span className="text-gray-800">{getTypeLabel(product.type)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('absPackaging.issuanceTime')}：</span>
                  <span className="text-gray-800 text-xs">{product.createdAt}</span>
                </div>
              </div>

              {/* 分层状态 */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">{t('absPackaging.layerStatus')}：</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t('absPackaging.seniorTranche')}：</span>
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(product.seniorTranche.status)}`}>
                    {product.seniorTranche.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t('absPackaging.mezzanineTranche')}：</span>
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(product.mezzanineTranche.status)}`}>
                    {product.mezzanineTranche.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t('absPackaging.juniorTranche')}：</span>
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(product.juniorTranche.status)}`}>
                    {product.juniorTranche.status}
                  </span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                <button className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100 transition-colors">
                  {t('absPackaging.viewDetail')}
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors">
                  {t('absPackaging.report')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ABSHistory
