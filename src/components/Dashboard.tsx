import { useState, useEffect } from 'react'
import PriceCard from './PriceCard'
import VolumeCard from './VolumeCard'
import PriceChart from './PriceChart'
import TransactionList from './TransactionList'
import MarketStats from './MarketStats'

interface MarketData {
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  time: string
  hash: string
}

function Dashboard() {
  const [marketData, setMarketData] = useState<MarketData>({
    price: 45230.50,
    change24h: 2.45,
    volume24h: 1250000000,
    marketCap: 850000000000,
    transactions: []
  })

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 100,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.1,
        volume24h: prev.volume24h + (Math.random() - 0.5) * 1000000,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 模拟交易数据
  useEffect(() => {
    const generateTransactions = (): Transaction[] => {
      const transactions: Transaction[] = []
      const types: ('buy' | 'sell')[] = ['buy', 'sell']
      
      for (let i = 0; i < 10; i++) {
        transactions.push({
          id: `tx-${Date.now()}-${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          amount: Math.random() * 10 + 0.1,
          price: marketData.price + (Math.random() - 0.5) * 200,
          time: new Date(Date.now() - i * 60000).toLocaleTimeString('zh-CN'),
          hash: `0x${Math.random().toString(16).substr(2, 64)}`
        })
      }
      
      return transactions
    }

    const loadTransactions = () => {
      setMarketData(prev => ({
        ...prev,
        transactions: generateTransactions()
      }))
    }

    loadTransactions()
    const interval = setInterval(loadTransactions, 5000)
    return () => clearInterval(interval)
  }, [marketData.price])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 头部导航 */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-white">区块链交易数据面板</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                最后更新: {new Date().toLocaleTimeString('zh-CN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 关键指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PriceCard 
            price={marketData.price} 
            change24h={marketData.change24h} 
          />
          <VolumeCard 
            volume={marketData.volume24h} 
            label="24小时交易量" 
          />
          <VolumeCard 
            volume={marketData.marketCap} 
            label="市值" 
          />
          <MarketStats 
            activeUsers={125000}
            totalTrades={3420000}
          />
        </div>

        {/* 图表和交易列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 价格图表 - 占据2列 */}
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
          
          {/* 交易列表 - 占据1列 */}
          <div className="lg:col-span-1">
            <TransactionList transactions={marketData.transactions} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
