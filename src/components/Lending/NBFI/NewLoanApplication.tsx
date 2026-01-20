import { useState, useMemo } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { Loan } from '../NBFIView'

interface NewLoanApplicationProps {
  onNewLoan: (loan: Loan) => void
}

interface MyToken {
  id: string
  type: 'receivable' | 'inventory'
  currentValue: number
}

function NewLoanApplication({ onNewLoan }: NewLoanApplicationProps) {
  const { t } = useLanguage()
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [loanAmount, setLoanAmount] = useState('')
  const [term, setTerm] = useState('90')

  // 模拟我的代币列表
  const myTokens: MyToken[] = [
    { id: 'AR-2025-004', type: 'receivable', currentValue: 300000 },
    { id: 'AR-2025-005', type: 'receivable', currentValue: 600000 },
    { id: 'INV-2025-019', type: 'inventory', currentValue: 250000 },
    { id: 'INV-2025-020', type: 'inventory', currentValue: 400000 },
  ]

  // 计算总抵押价值
  const totalCollateralValue = useMemo(() => {
    return selectedTokens.reduce((sum, tokenId) => {
      const token = myTokens.find(t => t.id === tokenId)
      return sum + (token?.currentValue || 0)
    }, 0)
  }, [selectedTokens, myTokens])

  // 最大可借金额（70%）
  const maxLoanAmount = totalCollateralValue * 0.7

  // 计算预估利息
  const estimatedInterest = useMemo(() => {
    if (!loanAmount || !term) return 0
    const amount = parseFloat(loanAmount)
    const days = parseInt(term)
    const annualRate = 6.5 // 假设年化利率6.5%
    return (amount * annualRate / 100 * days / 365)
  }, [loanAmount, term])

  const handleTokenToggle = (tokenId: string) => {
    setSelectedTokens(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedTokens.length === 0) {
      alert(t('lending.selectAtLeastOneToken'))
      return
    }

    const amount = parseFloat(loanAmount)
    if (amount > maxLoanAmount) {
      alert(t('lending.loanAmountExceeded').replace('{amount}', maxLoanAmount.toLocaleString('en-US')))
      return
    }

    // 生成借款ID
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 999) + 1
    const loanId = `LN-${year}-${random.toString().padStart(3, '0')}`

    const newLoan: Loan = {
      id: loanId,
      collateralTokens: selectedTokens.map(tokenId => {
        const token = myTokens.find(t => t.id === tokenId)!
        return {
          id: token.id,
          type: token.type === 'receivable' ? t('lending.receivable') : t('lending.inventory'),
          value: token.currentValue,
        }
      }),
      collateralValue: totalCollateralValue,
      loanAmount: amount,
      interestRate: 6.5, // 默认利率，实际应该从市场获取
      term: parseInt(term),
      status: t('lending.inReview'),
      createdAt: new Date().toLocaleDateString('zh-CN'),
      borrower: 'NBFI-A',
    }

    onNewLoan(newLoan)

    // 重置表单
    setSelectedTokens([])
    setLoanAmount('')
    setTerm('90')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        <i className="fas fa-plus-circle mr-2 text-blue-600"></i>
        {t('lending.applyForNewLoan')}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 选择抵押代币 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('lending.selectCollateralToken')} <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            {myTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <i className="fas fa-inbox text-2xl text-gray-300 mb-2"></i>
                <p>{t('lending.noAvailableTokens')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myTokens.map(token => (
                  <label
                    key={token.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTokens.includes(token.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTokens.includes(token.id)}
                        onChange={() => handleTokenToggle(token.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800">{token.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            token.type === 'receivable'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {token.type === 'receivable' ? 'AR' : 'INV'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {t('lending.currentValue')} {token.currentValue.toLocaleString('en-US')} eHKD
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          {selectedTokens.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <span className="text-gray-600">{t('lending.totalCollateralValue')}：</span>
                <span className="font-semibold text-blue-700 ml-2">
                  {totalCollateralValue.toLocaleString('en-US')} eHKD
                </span>
              </div>
              <div className="text-sm mt-1">
                <span className="text-gray-600">{t('lending.maxBorrowableAmount')}（70%）：</span>
                <span className="font-semibold text-blue-700 ml-2">
                  {maxLoanAmount.toLocaleString('en-US')} eHKD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 借款金额 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('lending.loanAmount')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder={t('lending.enterLoanAmount')}
              max={maxLoanAmount}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <span className="absolute right-3 top-3.5 text-gray-500 text-sm">eHKD</span>
          </div>
          {loanAmount && parseFloat(loanAmount) > maxLoanAmount && (
            <p className="mt-1 text-sm text-red-500">
              {t('lending.loanAmountExceeded').replace('{amount}', maxLoanAmount.toLocaleString('en-US'))}
            </p>
          )}
        </div>

        {/* 借款期限 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('lending.loanTerm')} <span className="text-red-500">*</span>
          </label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="7">{t('lending.days7')}</option>
            <option value="30">{t('lending.days30')}</option>
            <option value="90">{t('lending.days90')}</option>
            <option value="180">{t('lending.days180')}</option>
          </select>
        </div>

        {/* 预估利息 */}
        {loanAmount && term && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">{t('lending.estimatedInterestLabel')}</span>
              <span className="font-semibold text-gray-800">
                {estimatedInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {t('lending.basedOnMarketRate').replace('{rate}', '6.5')}
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={selectedTokens.length === 0 || !loanAmount || parseFloat(loanAmount) > maxLoanAmount}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-paper-plane mr-2"></i>
          {t('lending.submitApplication')}
        </button>
      </form>
    </div>
  )
}

export default NewLoanApplication
