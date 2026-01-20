import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { useLanguage } from '../../hooks/useLanguage'
import SuccessModal from './SuccessModal'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import 'react-day-picker/style.css'

interface AccountsReceivableFormProps {
  onSuccess: (issuance: any) => void
}

function AccountsReceivableForm({ onSuccess }: AccountsReceivableFormProps) {
  const { t, language } = useLanguage()
  const debtorDisplayName = language === 'zh' ? '核心企业（债务人）' : 'Core Enterprise (Debtor)'
  const [formData, setFormData] = useState({
    constructionCompany: '', // 收款建筑公司
    amount: '',
    dueDate: '',
    contractFile: null as File | null,
    description: '',
    quantity: '1',
    autoList: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tokenHash, setTokenHash] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // 生成应收账款编号
  const [arNumber] = useState(() => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 999) + 1
    return `AR-${year}-${random.toString().padStart(3, '0')}`
  })

  // 建筑公司列表（核心企业发行应收账款时选择收款建筑公司）
  const constructionCompanyOptions = [
    { id: 'abc', zh: 'ABC建筑有限公司', en: 'ABC Construction Co., Ltd.' },
    { id: 'xyz', zh: 'XYZ工程集团', en: 'XYZ Engineering Group' },
    { id: 'def', zh: 'DEF建设股份公司', en: 'DEF Construction Corp.' },
    { id: 'ghi', zh: 'GHI基础设施公司', en: 'GHI Infrastructure Co.' },
  ]

  const getConstructionCompanyDisplayName = () => {
    const found = constructionCompanyOptions.find(opt => opt.id === formData.constructionCompany)
    if (!found) return ''
    return language === 'zh' ? found.zh : found.en
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: format(date, 'yyyy-MM-dd') }))
      setShowDatePicker(false)
      if (errors.dueDate) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.dueDate
          return newErrors
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, contractFile: file }))
        if (errors.contractFile) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.contractFile
            return newErrors
          })
        }
      } else {
        setErrors(prev => ({ ...prev, contractFile: t('assetIssuance.errors.onlyPdfOrImage') }))
      }
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, autoList: e.target.checked }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.constructionCompany.trim()) {
      newErrors.constructionCompany = language === 'zh' ? '请选择收款建筑公司' : 'Please select a construction company'
    }

    if (!formData.amount.trim()) {
      newErrors.amount = t('assetIssuance.errors.enterReceivableAmount')
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = t('assetIssuance.errors.enterValidAmount')
    }

    if (!formData.dueDate) {
      newErrors.dueDate = t('assetIssuance.errors.selectDueDate')
    } else {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (dueDate < today) {
        newErrors.dueDate = t('assetIssuance.errors.dueDateCannotBePast') || t('assetIssuance.dueDateCannotBePast')
      }
    }

    if (!formData.contractFile) {
      newErrors.contractFile = t('assetIssuance.errors.uploadContractInvoice')
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = t('assetIssuance.errors.enterIssueQuantity')
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      newErrors.quantity = t('assetIssuance.errors.quantityMustBeAtLeastOne')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // 模拟生成代币哈希
    const hash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    setTokenHash(hash)
    setTokenId(arNumber)

    // 触发成功回调
    onSuccess({
      id: arNumber,
      type: t('assetIssuance.receivableTab'),
      amount: Number(formData.amount),
      status: formData.autoList ? t('assetIssuance.listed') : t('assetIssuance.issued'),
      timestamp: new Date().toLocaleString(),
      hash: hash,
      creditor: getConstructionCompanyDisplayName(),
      dueDate: formData.dueDate,
    })

    setShowSuccessModal(true)

    // 重置表单
    setFormData({
      constructionCompany: '',
      amount: '',
      dueDate: '',
      contractFile: null,
      description: '',
      quantity: '1',
      autoList: true,
    })
    setSelectedDate(undefined)
    setShowDatePicker(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 业务提示 */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start space-x-3">
          <i className="fas fa-info-circle mt-1"></i>
          <p className="text-sm leading-relaxed">
            {language === 'zh'
              ? '您正在创建代表您付款义务的代币，该代币将立即转移给指定的建筑公司。'
              : 'You are creating a token that represents your payment obligation, which will be immediately transferred to the designated construction company.'}
          </p>
        </div>

        {/* 应收账款编号 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('assetIssuance.receivableNumber')}
          </label>
          <div className="flex items-center space-x-2">
            <i className="fas fa-hashtag text-blue-600"></i>
            <span className="text-lg font-semibold text-blue-700">{arNumber}</span>
            <span className="text-xs text-gray-500">{t('assetIssuance.autoGenerated')}</span>
          </div>
        </div>

        {/* 债务人信息（自动填充） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.debtorName')}
          </label>
          <div className="relative">
            <i className="fas fa-user-tie absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="text"
              value={debtorDisplayName}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {language === 'zh'
              ? '系统自动识别当前核心企业作为债务人'
              : 'Automatically sets the current core enterprise as the debtor'}
          </p>
        </div>

        {/* 收款建筑公司 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '收款建筑公司' : 'Construction Company (Payee)'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-building absolute left-3 top-3.5 text-gray-400"></i>
              <select
                name="constructionCompany"
                value={formData.constructionCompany}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                  errors.constructionCompany ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'zh' ? '请选择收款建筑公司' : 'Please select a construction company'}</option>
                {constructionCompanyOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {language === 'zh' ? option.zh : option.en}
                  </option>
                ))}
              </select>
            <i className="fas fa-chevron-down absolute right-3 top-3.5 text-gray-400 pointer-events-none"></i>
          </div>
          {errors.constructionCompany && (
            <p className="mt-1 text-sm text-red-500">{errors.constructionCompany}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {language === 'zh' ? '发行后应收账款将自动转给指定的建筑公司' : 'The receivable will be automatically transferred to the selected construction company after issuance'}
          </p>
        </div>

        {/* 应收账款金额 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.receivableAmount')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder={t('assetIssuance.enterAmount')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-3.5 text-gray-500 text-sm">eHKD</span>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* 到期日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.dueDate')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-calendar-alt absolute left-3 top-3.5 text-gray-400 z-10 pointer-events-none"></i>
            <input
              type="text"
              readOnly
              value={selectedDate ? format(selectedDate, language === 'zh' ? 'yyyy-MM-dd' : 'MM/dd/yyyy', { locale: language === 'zh' ? zhCN : enUS }) : ''}
              placeholder={t('assetIssuance.selectDueDate')}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showDatePicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDatePicker(false)}
                ></div>
                <div className="absolute top-full left-0 mt-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    locale={language === 'zh' ? zhCN : enUS}
                    className="rdp"
                  />
                </div>
              </>
            )}
          </div>
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
          )}
        </div>

        {/* 合同/发票文件上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.contractInvoiceFile')} <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="contractFile"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="contractFile"
              className="cursor-pointer flex flex-col items-center"
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
              <span className="text-sm text-gray-600 mb-1">
                {t('assetIssuance.clickToUpload')}
              </span>
              <span className="text-xs text-gray-500">
                {t('assetIssuance.pdfImageFormats')}
              </span>
            </label>
            {formData.contractFile && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
                <i className="fas fa-file"></i>
                <span>{formData.contractFile.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, contractFile: null }))}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
          {errors.contractFile && (
            <p className="mt-1 text-sm text-red-500">{errors.contractFile}</p>
          )}
        </div>

        {/* 附加说明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.additionalNotes')}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder={t('assetIssuance.enterNotes')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* 发行数量和自动上架 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assetIssuance.issueQuantity')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoList}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('assetIssuance.autoListMarket')}</span>
            </label>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {t('assetIssuance.issueToken')}
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {t('assetIssuance.batchIssue')}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          tokenId={tokenId}
          tokenHash={tokenHash}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  )
}

export default AccountsReceivableForm
