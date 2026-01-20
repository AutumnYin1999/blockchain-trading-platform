import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

interface Role {
  id: string
  nameKey: string
  englishName: string
  icon: string
  color: string
  bgGradient: string
  responsibilities: string[]
  permissions: { textKey: string; allowed: boolean }[]
  buttonTextKey: string
  descriptionKey: string
}

function RoleSelection() {
  const navigate = useNavigate()
  const { language, t, toggleLanguage } = useLanguage()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const roles: Role[] = [
    {
      id: '核心企业',
      nameKey: 'roles.coreEnterprise',
      englishName: 'Core Enterprise',
      icon: 'fa-building',
      color: '#EA580C',
      bgGradient: 'from-orange-600 to-orange-800',
      responsibilities: language === 'zh'
        ? ['应收账款代币发行', '供应链融资管理', '投资者关系维护']
        : ['Accounts Receivable Token Issuance', 'Supply Chain Financing Management', 'Investor Relations Maintenance'],
      permissions: [
        { textKey: language === 'zh' ? '创建应收账款代币' : 'Create Receivable Tokens', allowed: true },
        { textKey: language === 'zh' ? '查看融资成本分析' : 'View Financing Cost Analysis', allowed: true },
        { textKey: language === 'zh' ? '监控资产流动性' : 'Monitor Asset Liquidity', allowed: true },
        { textKey: language === 'zh' ? '无ABS打包权限' : 'No ABS Packaging Permission', allowed: false },
      ],
      buttonTextKey: language === 'zh' ? '进入企业工作台' : 'Enter Enterprise Workspace',
      descriptionKey: language === 'zh' ? '应收账款代币化与融资' : 'Receivable Tokenization & Financing',
    },
    {
      id: '建筑公司',
      nameKey: 'roles.construction',
      englishName: 'Construction Company',
      icon: 'fa-hammer',
      color: '#0D9488',
      bgGradient: 'from-teal-600 to-teal-800',
      responsibilities: language === 'zh'
        ? ['库存代币发行', '库存融资管理', '市场需求分析']
        : ['Inventory Token Issuance', 'Inventory Financing Management', 'Market Demand Analysis'],
      permissions: [
        { textKey: language === 'zh' ? '创建库存代币' : 'Create Inventory Tokens', allowed: true },
        { textKey: language === 'zh' ? '库存估值更新' : 'Inventory Valuation Update', allowed: true },
        { textKey: language === 'zh' ? '融资历史查询' : 'Financing History Query', allowed: true },
        { textKey: language === 'zh' ? '无桥接权限' : 'No Bridge Permission', allowed: false },
      ],
      buttonTextKey: language === 'zh' ? '进入库存工作台' : 'Enter Inventory Workspace',
      descriptionKey: language === 'zh' ? '库存代币化与融资管理' : 'Inventory Tokenization & Financing Management',
    },
    {
      id: '银行',
      nameKey: 'roles.bank',
      englishName: 'Bank',
      icon: 'fa-building-columns',
      color: '#1E40AF',
      bgGradient: 'from-blue-700 to-blue-900',
      responsibilities: language === 'zh'
        ? ['ABS打包与发行', '提供流动性', '风险管理']
        : ['ABS Packaging & Issuance', 'Liquidity Provision', 'Risk Management'],
      permissions: [
        { textKey: language === 'zh' ? '创建ABS产品' : 'Create ABS Products', allowed: true },
        { textKey: language === 'zh' ? '直接Circle兑换' : 'Direct Circle Exchange', allowed: true },
        { textKey: language === 'zh' ? '外汇池流动性提供' : 'Forex Pool Liquidity Provision', allowed: true },
        { textKey: language === 'zh' ? '向NBFI放贷' : 'Lend to NBFI', allowed: true },
      ],
      buttonTextKey: language === 'zh' ? '进入银行工作台' : 'Enter Bank Workspace',
      descriptionKey: language === 'zh' ? 'ABS产品创建与流动性管理' : 'ABS Product Creation & Liquidity Management',
    },
    {
      id: 'NBFI',
      nameKey: 'roles.nbfi',
      englishName: 'NBFI',
      icon: 'fa-chart-line',
      color: '#059669',
      bgGradient: 'from-emerald-600 to-emerald-800',
      responsibilities: language === 'zh'
        ? ['投资代币资产', '抵押借贷操作', '跨链收益获取']
        : ['Invest in Token Assets', 'Collateralized Lending Operations', 'Cross-Chain Yield Acquisition'],
      permissions: [
        { textKey: language === 'zh' ? '购买ABS代币' : 'Purchase ABS Tokens', allowed: true },
        { textKey: language === 'zh' ? '抵押借款功能' : 'Collateralized Borrowing', allowed: true },
        { textKey: language === 'zh' ? '跨链桥接权限' : 'Cross-Chain Bridge Permission', allowed: true },
        { textKey: language === 'zh' ? '外汇池兑换' : 'Forex Pool Exchange', allowed: true },
      ],
      buttonTextKey: language === 'zh' ? '进入投资工作台' : 'Enter Investment Workspace',
      descriptionKey: language === 'zh' ? '资产投资与跨链操作' : 'Asset Investment & Cross-Chain Operations',
    },
    {
      id: 'admin',
      nameKey: 'roles.admin',
      englishName: 'Administrator',
      icon: 'fa-crown',
      color: '#7C3AED',
      bgGradient: 'from-purple-600 to-purple-800',
      responsibilities: language === 'zh' 
        ? ['平台监控与配置', '用户管理与审核', '全局数据洞察']
        : ['Platform Monitoring & Configuration', 'User Management & Review', 'Global Data Insights'],
      permissions: [
        { textKey: language === 'zh' ? '访问所有功能' : 'Access All Features', allowed: true },
        { textKey: language === 'zh' ? '系统参数配置' : 'System Parameter Configuration', allowed: true },
        { textKey: language === 'zh' ? '审计日志查看' : 'Audit Log Viewing', allowed: true },
        { textKey: language === 'zh' ? '风险监控干预' : 'Risk Monitoring Intervention', allowed: true },
      ],
      buttonTextKey: language === 'zh' ? '进入管理控制台' : 'Enter Admin Console',
      descriptionKey: language === 'zh' ? '全面掌控平台运营与配置' : 'Full Control of Platform Operations & Configuration',
    },
  ]

  // 模拟平台数据
  const [platformStats, setPlatformStats] = useState({
    totalAssets: 2.8,
    dailyVolume: 325,
    activeUsers: 142,
    bridgeVolume: 890,
  })

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformStats((prev) => ({
        totalAssets: prev.totalAssets + (Math.random() - 0.5) * 0.1,
        dailyVolume: prev.dailyVolume + (Math.random() - 0.5) * 5,
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 2),
        bridgeVolume: prev.bridgeVolume + (Math.random() - 0.5) * 2,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    localStorage.setItem('userRole', roleId)
    // 触发角色变更事件
    window.dispatchEvent(new CustomEvent('userRoleChanged', { detail: roleId }))
    
    // 根据角色跳转到不同页面
    setTimeout(() => {
      navigate('/app/dashboard')
    }, 300)
  }


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      {/* 动态背景 - 区块链节点网络效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
        {/* 连接线效果 */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {Array.from({ length: 15 }).map((_, i) => {
            const x1 = Math.random() * 100
            const y1 = Math.random() * 100
            const x2 = Math.random() * 100
            const y2 = Math.random() * 100
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#3b82f6"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            )
          })}
        </svg>
      </div>

      <div className="relative z-10">
        {/* 语言切换按钮 */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleLanguage}
            className={`px-4 py-2 rounded-lg shadow-md border font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100'
            }`}
          >
            {language === 'zh' ? '切换到 English' : 'Switch to 中文'}
          </button>
        </div>

        {/* 区域A：顶部品牌区 */}
        <header className="text-center py-12 px-4">
          <div className="mb-6 inline-block">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-pulse">
              <i className="fas fa-cube text-white text-5xl"></i>
            </div>
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {t('roleSelection.title')}
          </h1>
          <p className={`text-2xl mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('roleSelection.subtitle')}
          </p>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('roleSelection.description')}
          </p>
        </header>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 区域B：中央角色选择面板 */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map((role, index) => (
                  <div
                    key={role.id}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedRole === role.id ? 'scale-105' : ''
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div
                      className={`bg-gradient-to-br ${role.bgGradient} rounded-2xl p-6 shadow-xl border-2 ${
                        selectedRole === role.id ? 'border-white ring-4 ring-white/50' : 'border-transparent'
                      } transition-all duration-300`}
                    >
                      {/* 角色图标 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <i className={`fas ${role.icon} text-white text-2xl`}></i>
                        </div>
                        {selectedRole === role.id && (
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-pulse">
                            <i className="fas fa-check text-purple-600"></i>
                          </div>
                        )}
                      </div>

                      {/* 角色名称 */}
                      <h3 className="text-2xl font-bold text-white mb-1">{t(role.nameKey)}</h3>
                      <p className="text-white/80 text-sm mb-4">{role.englishName}</p>

                      {/* 核心职责 */}
                      <div className="mb-4">
                        <p className="text-white/90 text-sm font-semibold mb-2">{t('roleSelection.responsibilities')}:</p>
                        <ul className="space-y-1">
                          {role.responsibilities.map((resp, i) => (
                            <li key={i} className="text-white/80 text-xs flex items-start">
                              <i className="fas fa-circle text-white/60 text-[6px] mt-1.5 mr-2"></i>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 权限亮点 */}
                      <div className="mb-4">
                        <p className="text-white/90 text-sm font-semibold mb-2">{t('roleSelection.permissions')}:</p>
                        <div className="space-y-1">
                          {role.permissions.map((perm, i) => (
                            <div key={i} className="flex items-center text-xs">
                              {perm.allowed ? (
                                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                              ) : (
                                <i className="fas fa-times-circle text-red-300 mr-2"></i>
                              )}
                              <span className={`${perm.allowed ? 'text-white/90' : 'text-white/60'}`}>
                                {perm.textKey}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 入口按钮 */}
                      <button
                        className="w-full py-3 px-4 bg-white rounded-lg font-semibold hover:bg-white/90 transition-colors mt-4"
                        style={{ color: role.color }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRoleSelect(role.id)
                        }}
                      >
                        {role.buttonTextKey}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 区域C：右侧演示控制面板 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 平台数据概览 */}
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <i className="fas fa-chart-bar mr-2 text-green-500"></i>
                  {t('roleSelection.platformStats')}
                </h3>
                <div className="space-y-4">
                  {[
                    { labelKey: 'roleSelection.totalAssets', value: `$${platformStats.totalAssets.toFixed(1)}B`, icon: 'fa-wallet', color: '#3b82f6' },
                    { labelKey: 'roleSelection.dailyVolume', value: `$${platformStats.dailyVolume.toFixed(0)}M`, icon: 'fa-exchange-alt', color: '#10b981' },
                    { labelKey: 'roleSelection.activeUsers', value: platformStats.activeUsers.toString(), icon: 'fa-users', color: '#8b5cf6' },
                    { labelKey: 'roleSelection.bridgeVolume', value: `$${platformStats.bridgeVolume.toFixed(0)}M`, icon: 'fa-bridge', color: '#f97316' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center">
                        <i className={`fas ${stat.icon} mr-3`} style={{ color: stat.color }}></i>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t(stat.labelKey)}
                        </span>
                      </div>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 区域D：底部流程图导航 */}
          <div className={`mt-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-project-diagram mr-2 text-blue-500"></i>
              {t('roleSelection.businessFlow')}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* 流程节点 */}
              {[
                { icon: 'fa-coins', labelKey: 'roleSelection.assetIssuance', color: '#3b82f6' },
                { icon: 'fa-exchange-alt', labelKey: 'roleSelection.marketTrading', color: '#10b981' },
                { icon: 'fa-box', labelKey: 'roleSelection.absPackaging', color: '#8b5cf6' },
                { icon: 'fa-hand-holding-usd', labelKey: 'roleSelection.lending', color: '#f97316' },
                { icon: 'fa-bridge', labelKey: 'roleSelection.bridge', color: '#14b8a6' },
                { icon: 'fa-recycle', labelKey: 'roleSelection.fundRecovery', color: '#ec4899' },
              ].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={`flex flex-col items-center ${i > 0 ? 'ml-8' : ''}`}>
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: step.color }}
                    >
                      <i className={`fas ${step.icon} text-white text-xl`}></i>
                    </div>
                    <span className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t(step.labelKey)}
                    </span>
                  </div>
                  {i < 5 && (
                    <div className="ml-8">
                      <i className="fas fa-arrow-right text-gray-400 text-xl"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
