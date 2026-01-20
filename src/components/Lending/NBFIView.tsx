import { useState, useMemo } from 'react'
import MyLoans from './NBFI/MyLoans'
import NewLoanApplication from './NBFI/NewLoanApplication'
import NBFISidebar from './NBFI/NBFISidebar'
import LoanDetailModal from './LoanDetailModal'

export interface Loan {
  id: string
  collateralTokens: Array<{ id: string; type: string; value: number }>
  collateralValue: number
  loanAmount: number
  interestRate: number
  term: number
  status: '审核中' | '已放款' | '还款中' | '已逾期'
  createdAt: string
  dueDate?: string
  borrower: string
}

function NBFIView() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 'LN-2025-001',
      collateralTokens: [
        { id: 'AR-2025-001', type: '应收账款', value: 500000 },
        { id: 'INV-2025-015', type: '库存', value: 300000 },
      ],
      collateralValue: 800000,
      loanAmount: 560000,
      interestRate: 6.5,
      term: 90,
      status: '还款中',
      createdAt: '2025-01-01',
      dueDate: '2025-04-01',
      borrower: 'NBFI-A',
    },
    {
      id: 'LN-2025-002',
      collateralTokens: [
        { id: 'AR-2025-003', type: '应收账款', value: 1200000 },
      ],
      collateralValue: 1200000,
      loanAmount: 840000,
      interestRate: 7.2,
      term: 180,
      status: '已放款',
      createdAt: '2025-01-05',
      dueDate: '2025-07-04',
      borrower: 'NBFI-A',
    },
  ])

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleViewDetail = (loan: Loan) => {
    setSelectedLoan(loan)
    setShowDetailModal(true)
  }

  const handleNewLoan = (newLoan: Loan) => {
    setLoans(prev => [newLoan, ...prev])
  }

  // 计算统计数据
  const totalLoanAmount = useMemo(() => {
    return loans
      .filter(loan => loan.status !== '审核中')
      .reduce((sum, loan) => sum + loan.loanAmount, 0)
  }, [loans])

  const availableCollateral = useMemo(() => {
    // 模拟可用抵押额度（基于持有代币）
    return 2000000 // 简化处理
  }, [])

  const averageRate = useMemo(() => {
    const activeLoans = loans.filter(loan => loan.status !== '审核中')
    if (activeLoans.length === 0) return 0
    return activeLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / activeLoans.length
  }, [loans])

  const upcomingLoans = useMemo(() => {
    return loans
      .filter(loan => loan.dueDate && loan.status === '还款中')
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
      .slice(0, 5)
  }, [loans])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧：主要内容 */}
      <div className="lg:col-span-3 space-y-6">
        {/* 我的抵押借款 */}
        <MyLoans loans={loans} onViewDetail={handleViewDetail} />

        {/* 申请新借款 */}
        <NewLoanApplication onNewLoan={handleNewLoan} />
      </div>

      {/* 右侧：统计面板 */}
      <div className="lg:col-span-1">
        <NBFISidebar
          totalLoanAmount={totalLoanAmount}
          availableCollateral={availableCollateral}
          averageRate={averageRate}
          upcomingLoans={upcomingLoans}
        />
      </div>

      {/* 详情模态框 */}
      {showDetailModal && selectedLoan && (
        <LoanDetailModal
          loan={selectedLoan}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedLoan(null)
          }}
        />
      )}
    </div>
  )
}

export default NBFIView
