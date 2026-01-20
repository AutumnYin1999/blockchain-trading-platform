import { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'

function DashboardPage() {
  const { currentRole } = useRole()
  const { t, language } = useLanguage()

  // 获取角色名称的翻译键
  const getRoleTranslationKey = (role: string): string => {
    const roleMap: Record<string, string> = {
      admin: 'roles.admin',
      银行: 'roles.bank',
      Bank: 'roles.bank',
      NBFI: 'roles.nbfi',
      核心企业: 'roles.coreEnterprise',
      建筑公司: 'roles.construction',
    }
    return roleMap[role] || 'roles.coreEnterprise'
  }

  // 根据角色显示不同的KPI数据
  const kpiData = useMemo(() => {
    if (currentRole === '建筑公司') {
      // 建筑公司：显示应收的应收账款和自有的库存资产
      return [
        { nameKey: 'dashboard.receivableAssets', value: '1,600.0K', change: '+2.5%', icon: 'fa-file-invoice-dollar', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.inventoryAssets', value: '850.0K', change: '+1.8%', icon: 'fa-boxes', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.totalAssets', value: '2,450.0K', change: '+2.1%', icon: 'fa-wallet', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.pendingReceivables', value: '3', change: '+1', icon: 'fa-clock', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.activeInventory', value: '12', change: '+2', icon: 'fa-box', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.marketValue', value: '2,380.0K', change: '+1.5%', icon: 'fa-chart-line', bgColor: '#e0e7ff', iconColor: '#6366f1' },
      ]
    } else if (currentRole === '核心企业') {
      // 核心企业：显示已发行的应收账款（负债）和融资成本
      return [
        { nameKey: 'dashboard.issuedReceivables', value: '1,600.0K', change: '+150.0K', icon: 'fa-file-invoice', bgColor: '#fee2e2', iconColor: '#dc2626' },
        { nameKey: 'dashboard.fundingCost', value: '6.5%', change: '-0.2%', icon: 'fa-percent', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.totalLiabilities', value: '1,600.0K', change: '+150.0K', icon: 'fa-balance-scale', bgColor: '#fee2e2', iconColor: '#dc2626' },
        { nameKey: 'dashboard.activeIssuances', value: '5', change: '+1', icon: 'fa-coins', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.avgMaturity', value: '45天', change: '-2天', icon: 'fa-calendar-alt', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.costAnalysis', value: '良好', change: '稳定', icon: 'fa-chart-pie', bgColor: '#d1fae5', iconColor: '#10b981' },
      ]
    } else {
      // 其他角色：显示通用KPI
      return [
        { nameKey: 'dashboard.totalAssets', value: '1,245.8M', change: '+3.2%', icon: 'fa-wallet', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.dailyVolume', value: '325.0M', change: '+5.2%', icon: 'fa-exchange-alt', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.platformRevenue', value: '162.5K', change: '+3.8%', icon: 'fa-dollar-sign', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.activeAssets', value: '89', change: '+1.1%', icon: 'fa-coins', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.userActivity', value: '1,250', change: '-0.5%', icon: 'fa-users', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.avgFundingCost', value: '6.5%', change: '-0.2%', icon: 'fa-percent', bgColor: '#e0e7ff', iconColor: '#6366f1' },
      ]
    }
  }, [currentRole])

  // 交易趋势数据 - 使用翻译键作为 dataKey
  const transactionData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        buy: Math.floor(Math.random() * 100 + 50),
        sell: Math.floor(Math.random() * 80 + 30),
        lend: Math.floor(Math.random() * 60 + 20),
        bridge: Math.floor(Math.random() * 40 + 10),
      }
    })
  }, [language])

  // 根据角色显示不同的资产分布数据
  const assetDistribution = useMemo(() => {
    if (currentRole === '建筑公司') {
      // 建筑公司：应收账款和库存资产
      return [
        { nameKey: 'dashboard.receivable', value: 65, color: '#3b82f6' },
        { nameKey: 'dashboard.inventory', value: 35, color: '#10b981' },
      ]
    } else if (currentRole === '核心企业') {
      // 核心企业：已发行的应收账款（负债）
      return [
        { nameKey: 'dashboard.issuedReceivables', value: 100, color: '#dc2626' },
      ]
    } else {
      // 其他角色：通用资产分布
      return [
        { nameKey: 'dashboard.receivable', value: 65, color: '#3b82f6' },
        { nameKey: 'dashboard.inventory', value: 35, color: '#10b981' },
      ]
    }
  }, [currentRole])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.currentRole')}: <span className="font-semibold text-blue-600">{t(getRoleTranslationKey(currentRole))}</span>
          </p>
        </div>

        {/* KPI 卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: kpi.bgColor }}
                >
                  <i className={`fas ${kpi.icon}`} style={{ color: kpi.iconColor }}></i>
                </div>
                <span
                  className={`text-sm font-medium ${
                    kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600">{t(kpi.nameKey)}</div>
            </div>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 交易趋势图 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.transactionTrend')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    const legendMap: Record<string, string> = {
                      buy: t('dashboard.buy'),
                      sell: t('dashboard.sell'),
                      lend: t('dashboard.lend'),
                      bridge: t('dashboard.bridge'),
                    }
                    return legendMap[value] || value
                  }}
                />
                <Line type="monotone" dataKey="buy" name="buy" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="sell" name="sell" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="lend" name="lend" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="bridge" name="bridge" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 资产分布图 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.assetDistribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nameKey, percent }) => `${t(nameKey)} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => {
                    return [`${value}%`, t(props.payload.nameKey)]
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 交易类型对比 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.transactionComparison')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                formatter={(value) => {
                  const legendMap: Record<string, string> = {
                    buy: t('dashboard.buy'),
                    sell: t('dashboard.sell'),
                    lend: t('dashboard.lend'),
                    bridge: t('dashboard.bridge'),
                  }
                  return legendMap[value] || value
                }}
              />
              <Bar dataKey="buy" name="buy" fill="#3b82f6" />
              <Bar dataKey="sell" name="sell" fill="#f97316" />
              <Bar dataKey="lend" name="lend" fill="#8b5cf6" />
              <Bar dataKey="bridge" name="bridge" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
