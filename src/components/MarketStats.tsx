interface MarketStatsProps {
  activeUsers: number
  totalTrades: number
}

function MarketStats({ activeUsers, totalTrades }: MarketStatsProps) {
  const formatNumber = (value: number): string => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`
    }
    return value.toString()
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-slate-400 text-sm font-medium mb-4">市场统计</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">活跃用户</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatNumber(activeUsers)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeUsers.toLocaleString('en-US')} 用户在线
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">总交易数</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatNumber(totalTrades)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalTrades.toLocaleString('en-US')} 笔交易
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketStats
