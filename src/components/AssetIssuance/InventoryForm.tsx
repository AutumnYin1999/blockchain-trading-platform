import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import SuccessModal from './SuccessModal'

interface InventoryFormProps {
  onSuccess: (issuance: any) => void
}

function InventoryForm({ onSuccess }: InventoryFormProps) {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    inventoryType: '',
    itemDescription: '',
    valuation: '',
    location: '',
    photoFile: null as File | null,
    quantity: '1',
    autoList: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tokenHash, setTokenHash] = useState('')
  const [tokenId, setTokenId] = useState('')

  // 生成库存编号
  const [invNumber] = useState(() => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 999) + 1
    return `INV-${year}-${random.toString().padStart(3, '0')}`
  })

  const inventoryTypes = [
    { value: 'raw', label: t('assetIssuance.rawMaterial') },
    { value: 'wip', label: t('assetIssuance.workInProgress') },
    { value: 'finished', label: t('assetIssuance.finishedProduct') },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, inventoryType: value }))
    if (errors.inventoryType) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.inventoryType
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, photoFile: file }))
        if (errors.photoFile) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.photoFile
            return newErrors
          })
        }
      } else {
        setErrors(prev => ({ ...prev, photoFile: t('assetIssuance.errors.onlyImageFiles') }))
      }
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, autoList: e.target.checked }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.inventoryType) {
      newErrors.inventoryType = t('assetIssuance.errors.selectInventoryType')
    }

    if (!formData.itemDescription.trim()) {
      newErrors.itemDescription = t('assetIssuance.errors.enterItemDescription')
    }

    if (!formData.valuation.trim()) {
      newErrors.valuation = t('assetIssuance.errors.enterValuationAmount')
    } else if (isNaN(Number(formData.valuation)) || Number(formData.valuation) <= 0) {
      newErrors.valuation = t('assetIssuance.errors.enterValidValuation')
    }

    if (!formData.location.trim()) {
      newErrors.location = t('assetIssuance.errors.enterWarehouseLocation')
    }

    if (!formData.photoFile) {
      newErrors.photoFile = t('assetIssuance.errors.uploadPhotoOrReport')
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
    setTokenId(invNumber)

    // 触发成功回调
    onSuccess({
      id: invNumber,
      type: t('assetIssuance.inventoryTab'),
      amount: Number(formData.valuation),
      status: formData.autoList ? t('assetIssuance.listed') : t('assetIssuance.issued'),
      timestamp: new Date().toLocaleString(),
      hash: hash,
      creditor: language === 'zh' ? '核心企业' : 'Core Enterprise',
      dueDate: '',
      description: formData.itemDescription,
      location: formData.location,
      quantity: formData.quantity,
      inventoryType: formData.inventoryType,
    })

    setShowSuccessModal(true)

    // 重置表单
    setFormData({
      inventoryType: '',
      itemDescription: '',
      valuation: '',
      location: '',
      photoFile: null,
      quantity: '1',
      autoList: true,
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 库存编号 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('assetIssuance.inventoryNumber')}
          </label>
          <div className="flex items-center space-x-2">
            <i className="fas fa-hashtag text-blue-600"></i>
            <span className="text-lg font-semibold text-blue-700">{invNumber}</span>
            <span className="text-xs text-gray-500">{t('assetIssuance.autoGenerated')}</span>
          </div>
        </div>

        {/* 库存类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.inventoryType')} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            {inventoryTypes.map(type => (
              <label
                key={type.value}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.inventoryType === type.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="inventoryType"
                  value={type.value}
                  checked={formData.inventoryType === type.value}
                  onChange={() => handleRadioChange(type.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <i className={`fas ${
                    type.value === 'raw' ? 'fa-cube' : 
                    type.value === 'wip' ? 'fa-cogs' : 'fa-check-circle'
                  } text-2xl mb-2`}></i>
                  <div className="font-medium">{type.label}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.inventoryType && (
            <p className="mt-1 text-sm text-red-500">{errors.inventoryType}</p>
          )}
        </div>

        {/* 物品描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.itemDescription')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="itemDescription"
            value={formData.itemDescription}
            onChange={handleChange}
            placeholder={t('assetIssuance.enterItemDescription')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.itemDescription ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.itemDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.itemDescription}</p>
          )}
        </div>

        {/* 估值金额 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.valuationAmount')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-dollar-sign absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="text"
              name="valuation"
              value={formData.valuation}
              onChange={handleChange}
              placeholder={t('assetIssuance.enterValuation')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.valuation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-3.5 text-gray-500 text-sm">eHKD</span>
          </div>
          {errors.valuation && (
            <p className="mt-1 text-sm text-red-500">{errors.valuation}</p>
          )}
        </div>

        {/* 所在仓库/位置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.warehouseLocation')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t('assetIssuance.enterWarehouse')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        {/* 照片/质检报告上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('assetIssuance.photoQualityReport')} <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="photoFile"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="photoFile"
              className="cursor-pointer flex flex-col items-center"
            >
              <i className="fas fa-image text-4xl text-gray-400 mb-2"></i>
              <span className="text-sm text-gray-600 mb-1">
                {t('assetIssuance.clickToUploadImage')}
              </span>
              <span className="text-xs text-gray-500">
                {t('assetIssuance.imageFormats')}
              </span>
            </label>
            {formData.photoFile && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
                <i className="fas fa-file-image"></i>
                <span>{formData.photoFile.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photoFile: null }))}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
          {errors.photoFile && (
            <p className="mt-1 text-sm text-red-500">{errors.photoFile}</p>
          )}
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

export default InventoryForm
