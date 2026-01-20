import { useState, useEffect } from 'react'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'
import PermissionGuard from '../components/Common/PermissionGuard'
import BankCircleConversion from '../components/FundRecovery/BankCircleConversion'
import LiquidityManagement from '../components/FundRecovery/LiquidityManagement'
import MarketData from '../components/FundRecovery/MarketData'
import ConversionConfirmModal from '../components/FundRecovery/ConversionConfirmModal'
import LiquidityModal from '../components/FundRecovery/LiquidityModal'

function FundRecovery() {
  const { currentRole, permissions } = useRole()
  const { t, language } = useLanguage()
  
  // 从localStorage获取用户角色（用于组件内部逻辑）
  const [userRole] = useState(() => {
    const role = localStorage.getItem('userRole') || 'NBFI'
    // 标准化角色名称
    if (role === 'admin') return 'Bank' // 系统管理员可以使用银行功能
    if (role === '银行') return 'Bank'
    return role
  })

  const [usdcBalance, setUsdcBalance] = useState(1250000)
  const [circleExchangeRate, setCircleExchangeRate] = useState(7.82) // Circle通道汇率
  const [forexPoolRate, setForexPoolRate] = useState(7.80) // 外汇池汇率
  const [showConversionModal, setShowConversionModal] = useState(false)
  const [showLiquidityModal, setShowLiquidityModal] = useState(false)
  const [conversionData, setConversionData] = useState<any>(null)

  const isAdmin = currentRole === 'admin' || userRole === 'admin' || userRole === '系统管理员'
  const isBank = userRole === 'Bank' || userRole === '银行' || (isAdmin && permissions.fundRecoveryDirect)
  const isNBFI = userRole === 'NBFI' || (isAdmin && permissions.fundRecoveryForexPool)

  // 模拟实时汇率更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟Circle通道汇率波动 ±0.1%
      const circleChange = (Math.random() - 0.5) * 0.002
      setCircleExchangeRate(prev => Math.max(7.75, Math.min(7.90, prev + circleChange)))
      
      // 模拟外汇池汇率波动（略低于Circle通道）
      const poolChange = (Math.random() - 0.5) * 0.002
      setForexPoolRate(prev => Math.max(7.73, Math.min(7.88, prev + poolChange)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleConversion = (data: any) => {
    setConversionData(data)
    setShowConversionModal(true)
  }

  const handleConversionConfirm = () => {
    // 模拟兑换处理
    setShowConversionModal(false)
    setConversionData(null)
    // 更新余额等
  }

  return (
    <PermissionGuard permission="fundRecovery" fallback={
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <i className="fas fa-exclamation-triangle text-yellow-600 text-3xl mb-3"></i>
          <p className="text-yellow-800 font-medium">
            {language === 'zh' ? '您没有权限访问此功能' : 'You do not have permission to access this feature'}
          </p>
        </div>
      </div>
    }>
      <div className="p-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* 角色标识横幅 */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="flex items-center space-x-3">
            <i className="fas fa-user-shield text-2xl text-purple-600"></i>
            <div>
              <h3 className="font-semibold text-gray-800">
                {t('roles.admin')} - {t('fundRecovery.fullAccess')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('fundRecovery.adminDescription')}
              </p>
            </div>
          </div>
        </div>
      )}
      {!isAdmin && (
        <div className={`mb-6 p-4 rounded-lg ${
          isBank ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
        }`}>
          <div className="flex items-center space-x-3">
            <i className={`fas ${isBank ? 'fa-university' : 'fa-building'} text-2xl ${
              isBank ? 'text-blue-600' : 'text-purple-600'
            }`}></i>
            <div>
              <h3 className="font-semibold text-gray-800">
                {isBank ? `${t('roles.bank')} - ${t('fundRecovery.bankDirectConversion')}` : `${t('roles.nbfi')} - ${t('fundRecovery.nbfiForexPoolConversion')}`}
              </h3>
              <p className="text-sm text-gray-600">
                {isBank
                  ? t('fundRecovery.noHandlingFee')
                  : t('fundRecovery.handlingFeeNote')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('fundRecovery.title')}</h2>
        <p className="text-gray-600">{t('fundRecovery.description')}</p>
      </div>

      {/* 三模块布局：60% - 40% */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 模块A：银行特权兑换（Circle通道）- 左侧主面板（60%宽度） */}
        <div className="lg:col-span-3">
          {isBank ? (
            <BankCircleConversion
              usdcBalance={usdcBalance}
              exchangeRate={circleExchangeRate}
              forexPoolRate={forexPoolRate}
              onConversion={handleConversion}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
              <i className="fas fa-lock text-3xl text-gray-400 mb-3"></i>
              <p className="text-gray-600">
                {language === 'zh' 
                  ? '此功能仅限银行角色使用' 
                  : 'This feature is only available for Bank role'}
              </p>
            </div>
          )}
        </div>

        {/* 右侧面板（40%宽度） */}
        <div className="lg:col-span-2 space-y-6">
          {/* 模块B：外汇池流动性管理 - 右侧上方面板 */}
          {isBank && (
            <LiquidityManagement
              onLiquidityManage={() => setShowLiquidityModal(true)}
            />
          )}

          {/* 模块C：外汇池市场数据 - 右侧下方面板 */}
          <MarketData />
        </div>
      </div>

      {/* 兑换确认模态框 */}
      {showConversionModal && conversionData && (
        <ConversionConfirmModal
          conversionData={conversionData}
          exchangeRate={circleExchangeRate}
          userRole={userRole}
          onConfirm={handleConversionConfirm}
          onClose={() => {
            setShowConversionModal(false)
            setConversionData(null)
          }}
        />
      )}

      {/* 流动性管理模态框（银行或系统管理员） */}
      {showLiquidityModal && (isBank || isAdmin) && (
        <LiquidityModal
          onClose={() => setShowLiquidityModal(false)}
        />
      )}
    </div>
    </PermissionGuard>
  )
}

export default FundRecovery
