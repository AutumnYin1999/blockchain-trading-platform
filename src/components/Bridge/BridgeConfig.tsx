import { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface BridgeableAsset {
  id: string
  absId: string
  type: 'receivable' | 'inventory'
  tranche: 'Senior' | 'Mezzanine' | 'Junior'
  value: number
  quantity: number
  riskRating: string
  selected: boolean
  bridgeQuantity: number
}

interface BridgeConfigProps {
  selectedAssets: BridgeableAsset[]
  totalValue: number
  bridgeFee: number
  estimatedReceived: number
  targetChain: string
  onTargetChainChange: (chain: string) => void
  recipientAddress: string
  onRecipientAddressChange: (address: string) => void
  onPreview: () => void
}

interface ChainProtocol {
  name: string
  apyRange: string
  description: string
}

function BridgeConfig({
  selectedAssets,
  totalValue,
  bridgeFee,
  estimatedReceived,
  targetChain,
  onTargetChainChange,
  recipientAddress,
  onRecipientAddressChange,
  onPreview,
}: BridgeConfigProps) {
  const { t, language } = useLanguage()
  const [showPostBridgeActions, setShowPostBridgeActions] = useState(false)
  const [autoAddLiquidity, setAutoAddLiquidity] = useState(false)
  const [autoDepositAave, setAutoDepositAave] = useState(false)
  const [gasEstimate, setGasEstimate] = useState('~0.002 ETH')

  // 动态更新Gas费（模拟）
  useEffect(() => {
    const updateGasEstimate = () => {
      const chainGasMap: Record<string, string[]> = {
        ethereum: ['~0.0018 ETH', '~0.002 ETH', '~0.0022 ETH'],
        polygon: ['~0.008 MATIC', '~0.01 MATIC', '~0.012 MATIC'],
        arbitrum: ['~0.0004 ETH', '~0.0005 ETH', '~0.0006 ETH'],
        optimism: ['~0.0002 ETH', '~0.0003 ETH', '~0.0004 ETH'],
      }
      const estimates = chainGasMap[targetChain] || chainGasMap.ethereum
      const randomEstimate = estimates[Math.floor(Math.random() * estimates.length)]
      setGasEstimate(randomEstimate)
    }

    updateGasEstimate()
    const interval = setInterval(updateGasEstimate, 10000) // 每10秒更新一次
    return () => clearInterval(interval)
  }, [targetChain])

  // 使用 useMemo 确保语言变化时更新
  const chainInfo: Record<string, { 
    name: string
    networkId: string
    protocols?: ChainProtocol[]
  }> = useMemo(() => ({
    ethereum: {
      name: 'Ethereum Mainnet',
      networkId: '1',
      protocols: [
        { name: 'Uniswap V3', apyRange: '3.5-5.2%', description: language === 'zh' ? '去中心化交易所流动性池' : 'DEX Liquidity Pool' },
        { name: 'Aave', apyRange: '4.2-6.8%', description: language === 'zh' ? '借贷协议' : 'Lending Protocol' },
        { name: 'Compound', apyRange: '3.8-5.5%', description: language === 'zh' ? '借贷协议' : 'Lending Protocol' },
      ],
    },
    polygon: {
      name: 'Polygon PoS',
      networkId: '137',
      protocols: [
        { name: 'QuickSwap', apyRange: '5.0-7.5%', description: language === 'zh' ? '去中心化交易所' : 'DEX' },
        { name: 'Aave Polygon', apyRange: '4.5-6.2%', description: language === 'zh' ? '借贷协议' : 'Lending Protocol' },
      ],
    },
    arbitrum: {
      name: 'Arbitrum One',
      networkId: '42161',
      protocols: [
        { name: 'Uniswap V3', apyRange: '4.0-6.0%', description: language === 'zh' ? '去中心化交易所流动性池' : 'DEX Liquidity Pool' },
        { name: 'GMX', apyRange: '5.5-8.0%', description: language === 'zh' ? '去中心化交易平台' : 'DEX Platform' },
      ],
    },
    optimism: {
      name: 'Optimism',
      networkId: '10',
      protocols: [
        { name: 'Uniswap V3', apyRange: '3.8-5.5%', description: language === 'zh' ? '去中心化交易所流动性池' : 'DEX Liquidity Pool' },
        { name: 'Velodrome', apyRange: '4.5-7.0%', description: language === 'zh' ? '流动性协议' : 'Liquidity Protocol' },
      ],
    },
  }), [language])

  // 计算费用明细
  const outboundFee = useMemo(() => {
    return totalValue * 0.0015 // 0.15%
  }, [totalValue])

  const inboundFee = useMemo(() => {
    return estimatedReceived * 0.001 // 0.1% (基于预估接收金额)
  }, [estimatedReceived])

  const totalFee = useMemo(() => {
    return outboundFee + inboundFee
  }, [outboundFee, inboundFee])

  const isValidAddress = recipientAddress.length >= 20 && recipientAddress.startsWith('0x')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{t('bridge.bridgeConfig')}</h3>

      {/* 桥接概览 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t('bridge.selectedValue')}:</span>
            <span className="font-semibold text-gray-800">
              {totalValue.toLocaleString()} eHKD
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">{t('bridge.estimatedTime')}:</span>
            <span className="font-semibold text-gray-800">10-30 {language === 'zh' ? '分钟' : 'minutes'}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">{t('bridge.estimatedReceived')}:</span>
            <span className="font-bold text-lg text-blue-600">
              ~{estimatedReceived.toLocaleString()} eHKD
            </span>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">{t('bridge.status')}: {language === 'zh' ? '正常' : 'Normal'}</span>
          </div>
        </div>
      </div>

      {/* 费用明细分段显示 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-medium text-gray-800 mb-3 text-sm">
          {language === 'zh' ? '费用明细' : 'Fee Breakdown'}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {language === 'zh' ? '出桥费' : 'Outbound Fee'}: 
              <span className="text-gray-500 ml-1">0.15%</span>
              <span className="text-xs text-gray-500 ml-1">
                ({language === 'zh' ? '本次收取' : 'Charged Now'})
              </span>
            </span>
            <span className="font-semibold text-gray-800 font-mono">
              {outboundFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {language === 'zh' ? '入桥费' : 'Inbound Fee'}: 
              <span className="text-gray-500 ml-1">0.1%</span>
              <span className="text-xs text-gray-500 ml-1">
                ({language === 'zh' ? 'USDC回链时预提示' : 'Pre-notice when USDC returns'})
              </span>
            </span>
            <span className="font-semibold text-gray-800 font-mono">
              {inboundFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
            <span className="font-medium text-gray-800">
              {language === 'zh' ? '预估总费用' : 'Estimated Total Fee'}:
            </span>
            <span className="font-bold text-blue-600 font-mono">
              {totalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} eHKD
            </span>
          </div>
        </div>
      </div>

      {/* 目标链配置 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('bridge.targetChain')}
        </label>
        <select
          value={targetChain}
          onChange={(e) => onTargetChainChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ethereum">Ethereum Mainnet</option>
          <option value="polygon">Polygon PoS</option>
          <option value="arbitrum">Arbitrum One</option>
          <option value="optimism">Optimism</option>
        </select>
        {chainInfo[targetChain] && (
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
              <div className="text-gray-700 space-y-1">
                <div className="font-medium text-gray-800">
                  {language === 'zh' ? '网络ID' : 'Network ID'}: {chainInfo[targetChain].networkId}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {language === 'zh' ? 'Gas费预估' : 'Gas Estimate'}:
                  </span>
                  <span className="font-medium text-gray-800 font-mono">{gasEstimate}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({language === 'zh' ? '基于当前网络情况' : 'Based on current network'})
                  </span>
                </div>
              </div>
            </div>

            {/* 推荐流动性协议（仅Ethereum显示） */}
            {targetChain === 'ethereum' && chainInfo[targetChain].protocols && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <h5 className="font-medium text-gray-800 mb-2 text-sm">
                  {language === 'zh' ? '推荐流动性协议' : 'Recommended Liquidity Protocols'}
                </h5>
                <div className="space-y-2">
                  {chainInfo[targetChain].protocols!.map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{protocol.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{protocol.description}</span>
                      </div>
                      <span className="font-semibold text-green-600 font-mono">
                        APY: {protocol.apyRange}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 其他链的协议信息 */}
            {targetChain !== 'ethereum' && chainInfo[targetChain].protocols && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <h5 className="font-medium text-gray-800 mb-2 text-sm">
                  {language === 'zh' ? '可用协议' : 'Available Protocols'}
                </h5>
                <div className="space-y-2">
                  {chainInfo[targetChain].protocols!.map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{protocol.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{protocol.description}</span>
                      </div>
                      <span className="font-semibold text-green-600 font-mono">
                        APY: {protocol.apyRange}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 接收地址 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('bridge.recipientAddress')}
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => onRecipientAddressChange(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            {language === 'zh' ? '地址簿' : 'Address Book'}
          </button>
        </div>
        {recipientAddress && (
          <div className={`mt-2 text-sm ${isValidAddress ? 'text-green-600' : 'text-red-600'}`}>
            {isValidAddress ? (
              <i className="fas fa-check-circle mr-1"></i>
            ) : (
              <i className="fas fa-times-circle mr-1"></i>
            )}
            {isValidAddress ? t('bridge.addressValid') : t('bridge.addressInvalid')}
          </div>
        )}
      </div>

      {/* 桥接后操作引导 */}
      <div className="mb-6">
        <details 
          className="group"
          open={showPostBridgeActions}
          onToggle={(e) => setShowPostBridgeActions((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
            <span>
              {language === 'zh' ? '桥接后自动操作' : 'Post-Bridge Auto Actions'}
            </span>
            <i className={`fas fa-chevron-${showPostBridgeActions ? 'up' : 'down'} text-xs transition-transform`}></i>
          </summary>
          <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {targetChain === 'ethereum' ? (
              <>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAddLiquidity}
                    onChange={(e) => setAutoAddLiquidity(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">
                      {language === 'zh' ? '自动跳转到Uniswap添加流动性' : 'Auto navigate to Uniswap to add liquidity'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {language === 'zh' 
                        ? '桥接完成后自动打开Uniswap V3界面，方便您添加流动性'
                        : 'Automatically open Uniswap V3 interface after bridging for liquidity provision'}
                    </div>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDepositAave}
                    onChange={(e) => setAutoDepositAave(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">
                      {language === 'zh' ? '自动存入Aave借贷池' : 'Auto deposit to Aave lending pool'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {language === 'zh' 
                        ? '桥接完成后自动跳转到Aave，将资产存入借贷池获得收益'
                        : 'Automatically navigate to Aave after bridging to deposit assets into lending pool'}
                    </div>
                  </div>
                </label>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                {language === 'zh' 
                  ? '当前链暂不支持自动操作，请手动操作'
                  : 'Auto actions not available for this chain, please operate manually'}
              </div>
            )}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="postBridgeAction"
                checked={!autoAddLiquidity && !autoDepositAave}
                onChange={() => {
                  setAutoAddLiquidity(false)
                  setAutoDepositAave(false)
                }}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">
                  {language === 'zh' ? '仅完成桥接，手动操作' : 'Complete bridge only, manual operation'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'zh' 
                    ? '桥接完成后不执行任何自动操作，由您手动决定后续操作'
                    : 'No automatic actions after bridging, you decide the next steps manually'}
                </div>
              </div>
            </label>
          </div>
        </details>
      </div>

      {/* 高级选项 */}
      <div className="mb-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '高级选项' : 'Advanced Options'} <i className="fas fa-chevron-down text-xs ml-1"></i>
          </summary>
          <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{language === 'zh' ? '滑点保护' : 'Slippage Protection'}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                defaultValue="0.5"
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{language === 'zh' ? '默认' : 'Default'}: 0.5%</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{language === 'zh' ? 'Gas策略' : 'Gas Strategy'}</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>{language === 'zh' ? '标准' : 'Standard'}</option>
                <option>{language === 'zh' ? '快速' : 'Fast'}</option>
                <option>{language === 'zh' ? '自定义' : 'Custom'}</option>
              </select>
            </div>
          </div>
        </details>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <button
          onClick={onPreview}
          disabled={selectedAssets.length === 0 || !isValidAddress}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {t('bridge.previewBridge')}
        </button>
        <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          {language === 'zh' ? '重置' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

export default BridgeConfig
