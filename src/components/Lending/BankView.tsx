import { useState, useMemo } from 'react'
import LoanMarket from './Bank/LoanMarket'
import MyLending from './Bank/MyLending'
import BankSidebar from './Bank/BankSidebar'
import LoanDetailModal from './LoanDetailModal'
import BidModal from './BidModal'
import { useLanguage } from '../../hooks/useLanguage'

export interface LoanApplication {
  id: string
  collateralTokens: Array<{ id: string; type: string; value: number; discountRate: number }>
  collateralValue: number
  loanAmount: number
  term: number
  borrower: string
  riskScore: number
  currentLowestRate: number
  status: '待投标' | '投标中' | '已匹配'
  createdAt: string
}

export interface BankLoan {
  id: string
  borrower: string
  loanAmount: number
  interestRate: number
  issueDate: string
  dueDate: string
  status: '正常' | '预警' | '逾期'
  collateralTokens: Array<{ id: string; type: string; value: number }>
}

function BankView() {
  const { language } = useLanguage()
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([
    {
      id: 'LA-2025-001',
      collateralTokens: [
        { id: 'AR-2025-006', type: '应收账款', value: 500000, discountRate: 0.3 },
        { id: 'INV-2025-021', type: '库存', value: 300000, discountRate: 0.5 },
      ],
      collateralValue: 800000,
      loanAmount: 560000,
      term: 90,
      borrower: 'NBFI-B',
      riskScore: 85,
      currentLowestRate: 6.2,
      status: '投标中',
      createdAt: '2025-01-10',
    },
    {
      id: 'LA-2025-002',
      collateralTokens: [
        { id: 'AR-2025-007', type: '应收账款', value: 1000000, discountRate: 0.2 },
      ],
      collateralValue: 1000000,
      loanAmount: 700000,
      term: 180,
      borrower: 'NBFI-C',
      riskScore: 92,
      currentLowestRate: 5.8,
      status: '投标中',
      createdAt: '2025-01-11',
    },
    {
      id: 'LA-2025-003',
      collateralTokens: [
        { id: 'AR-2025-008', type: '应收账款', value: 600000, discountRate: 0.25 },
        { id: 'INV-2025-022', type: '库存', value: 400000, discountRate: 0.4 },
      ],
      collateralValue: 1000000,
      loanAmount: 820000,
      term: 120,
      borrower: 'NBFI-A',
      riskScore: 75,
      currentLowestRate: 7.5,
      status: '待投标',
      createdAt: '2025-01-12',
    },
    {
      id: 'LA-2025-004',
      collateralTokens: [
        { id: 'AR-2025-009', type: '应收账款', value: 800000, discountRate: 0.3 },
      ],
      collateralValue: 800000,
      loanAmount: 500000,
      term: 60,
      borrower: 'NBFI-D',
      riskScore: 88,
      currentLowestRate: 0,
      status: '待投标',
      createdAt: '2025-01-13',
    },
  ])

  const [myLoans, setMyLoans] = useState<BankLoan[]>([
    {
      id: 'BL-2025-001',
      borrower: 'NBFI-A',
      loanAmount: 560000,
      interestRate: 6.5,
      issueDate: '2025-01-01',
      dueDate: '2025-04-01',
      status: '正常',
      collateralTokens: [
        { id: 'AR-2025-001', type: '应收账款', value: 500000 },
        { id: 'INV-2025-015', type: '库存', value: 300000 },
      ],
    },
    {
      id: 'BL-2025-002',
      borrower: 'NBFI-B',
      loanAmount: 750000,
      interestRate: 7.2,
      issueDate: '2024-12-15',
      dueDate: '2025-03-15',
      status: '正常',
      collateralTokens: [
        { id: 'AR-2024-098', type: '应收账款', value: 900000 },
      ],
    },
    {
      id: 'BL-2025-003',
      borrower: 'NBFI-C',
      loanAmount: 920000,
      interestRate: 6.8,
      issueDate: '2024-11-20',
      dueDate: '2025-02-20',
      status: '预警',
      collateralTokens: [
        { id: 'AR-2024-087', type: '应收账款', value: 1100000 },
      ],
    },
    {
      id: 'BL-2025-004',
      borrower: 'NBFI-D',
      loanAmount: 480000,
      interestRate: 8.5,
      issueDate: '2024-10-10',
      dueDate: '2025-01-10',
      status: '逾期',
      collateralTokens: [
        { id: 'AR-2024-076', type: '应收账款', value: 600000 },
        { id: 'INV-2024-045', type: '库存', value: 200000 },
      ],
    },
    {
      id: 'BL-2025-005',
      borrower: 'NBFI-E',
      loanAmount: 650000,
      interestRate: 7.0,
      issueDate: '2024-12-01',
      dueDate: '2025-05-01',
      status: '正常',
      collateralTokens: [
        { id: 'AR-2024-105', type: '应收账款', value: 750000 },
      ],
    },
    {
      id: 'BL-2025-006',
      borrower: 'NBFI-F',
      loanAmount: 380000,
      interestRate: 6.2,
      issueDate: '2024-11-05',
      dueDate: '2025-02-05',
      status: '正常',
      collateralTokens: [
        { id: 'INV-2024-038', type: '库存', value: 450000 },
      ],
    },
    {
      id: 'BL-2025-007',
      borrower: 'NBFI-G',
      loanAmount: 550000,
      interestRate: 7.8,
      issueDate: '2024-09-20',
      dueDate: '2024-12-20',
      status: '逾期',
      collateralTokens: [
        { id: 'AR-2024-065', type: '应收账款', value: 700000 },
      ],
    },
    {
      id: 'BL-2025-008',
      borrower: 'NBFI-H',
      loanAmount: 720000,
      interestRate: 6.9,
      issueDate: '2024-12-10',
      dueDate: '2025-06-10',
      status: '预警',
      collateralTokens: [
        { id: 'AR-2024-112', type: '应收账款', value: 850000 },
        { id: 'INV-2024-052', type: '库存', value: 300000 },
      ],
    },
  ])

  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null)
  const [selectedLoan, setSelectedLoan] = useState<BankLoan | null>(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleBid = (application: LoanApplication) => {
    setSelectedApplication(application)
    setShowBidModal(true)
  }

  const handleViewDetail = (loan: BankLoan) => {
    setSelectedLoan(loan)
    setShowDetailModal(true)
  }

  const handleViewApplicationDetail = (application: LoanApplication) => {
    setSelectedApplication(application)
    // 可以打开一个详情弹窗
    console.log('View application detail:', application.id)
  }

  const handleReject = (application: LoanApplication) => {
    if (confirm(language === 'zh' ? `确定要拒绝贷款申请 ${application.id} 吗？` : `Are you sure you want to reject loan application ${application.id}?`)) {
      setLoanApplications(prev => prev.filter(app => app.id !== application.id))
    }
  }

  const handleContact = (loan: BankLoan) => {
    console.log('Contact borrower:', loan.borrower)
    // 可以打开联系弹窗或跳转到消息页面
  }

  const handleLiquidate = (loan: BankLoan) => {
    if (confirm(language === 'zh' ? `确定要清算贷款 ${loan.id} 的抵押品吗？` : `Are you sure you want to liquidate collateral for loan ${loan.id}?`)) {
      console.log('Liquidate loan:', loan.id)
      // 执行清算逻辑
    }
  }

  const handleGenerateRiskReport = () => {
    // 模拟生成PDF报告
    const reportData = {
      totalLoans: myLoans.length,
      totalAmount: myLoans.reduce((sum, loan) => sum + loan.loanAmount, 0),
      normalLoans: myLoans.filter(l => l.status === '正常').length,
      warningLoans: myLoans.filter(l => l.status === '预警').length,
      overdueLoans: myLoans.filter(l => l.status === '逾期').length,
      generatedAt: new Date().toLocaleString(),
    }

    // 创建下载链接
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `risk-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert(language === 'zh' ? '风险报告已生成并下载' : 'Risk report generated and downloaded')
  }

  const handleBidSubmit = (applicationId: string, rate: number, amount: number) => {
    // 更新申请状态和最低利率
    setLoanApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, currentLowestRate: Math.min(app.currentLowestRate || 999, rate), status: '投标中' }
          : app
      )
    )
    setShowBidModal(false)
    setSelectedApplication(null)
  }

  // 计算统计数据
  const totalLentAmount = useMemo(() => {
    return myLoans.reduce((sum, loan) => sum + loan.loanAmount, 0)
  }, [myLoans])

  const totalInterest = useMemo(() => {
    return myLoans.reduce((sum, loan) => {
      const days = Math.floor((new Date(loan.dueDate).getTime() - new Date(loan.issueDate).getTime()) / (1000 * 60 * 60 * 24))
      const interest = loan.loanAmount * loan.interestRate / 100 * days / 365
      return sum + interest
    }, 0)
  }, [myLoans])

  const badDebtRate = useMemo(() => {
    const overdueLoans = myLoans.filter(loan => loan.status === '逾期')
    return myLoans.length > 0 ? (overdueLoans.length / myLoans.length) * 100 : 0
  }, [myLoans])

  return (
    <div>
      {/* 风险报告按钮 */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleGenerateRiskReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-chart-line"></i>
          <span>{language === 'zh' ? '生成风险报告' : 'Generate Risk Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：主要内容 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 贷款市场 */}
          <LoanMarket
            applications={loanApplications}
            onBid={handleBid}
            onViewDetail={handleViewApplicationDetail}
            onReject={handleReject}
          />

          {/* 我的贷款管理 */}
          <MyLending 
            loans={myLoans} 
            onViewDetail={handleViewDetail}
            onContact={handleContact}
            onLiquidate={handleLiquidate}
          />
        </div>

        {/* 右侧：统计面板 */}
        <div className="lg:col-span-1">
          <BankSidebar
            totalLentAmount={totalLentAmount}
            totalInterest={totalInterest}
            badDebtRate={badDebtRate}
            loans={myLoans}
            onViewWarningLoans={() => {
              // 可以跳转到筛选后的列表
              console.log('View warning loans')
            }}
          />
        </div>
      </div>

      {/* 投标模态框 */}
      {showBidModal && selectedApplication && (
        <BidModal
          application={selectedApplication}
          onConfirm={handleBidSubmit}
          onClose={() => {
            setShowBidModal(false)
            setSelectedApplication(null)
          }}
        />
      )}

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

export default BankView
