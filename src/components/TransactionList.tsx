interface Transaction {
  id: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  time: string
  hash: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

function TransactionList({ transactions }: TransactionListProps) {
  const truncateHash = (hash: string, start: number = 6, end: number = 4): string => {
    return `${hash.slice(0, start)}...${hash.slice(-end)}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-400 text-sm font-medium">最近交易</h3>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            暂无交易数据
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors border border-slate-600/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  tx.type === 'buy' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tx.type === 'buy' ? '买入' : '卖出'}
                </div>
                <span className="text-xs text-slate-400">{tx.time}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">数量</span>
                  <span className="text-white font-semibold text-sm">
                    {tx.amount.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">价格</span>
                  <span className="text-white font-semibold text-sm">
                    ${tx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">总值</span>
                  <span className="text-white font-semibold text-sm">
                    ${(tx.amount * tx.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">交易哈希</span>
                    <span className="text-blue-400 font-mono text-xs hover:text-blue-300 cursor-pointer">
                      {truncateHash(tx.hash)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TransactionList
