export type UserRole = 'admin' | '银行' | 'NBFI' | '核心企业' | '建筑公司'

export interface RolePermissions {
  dashboard: boolean
  assetIssuance: boolean
  assetIssuanceReceivable: boolean // 应收账款发行
  assetIssuanceInventory: boolean // 库存发行
  marketTrading: boolean
  marketTradingPurchase: boolean // 购买权限
  marketTradingViewOwn: boolean // 仅查看自己的
  absPackaging: boolean
  absPackagingCreate: boolean // 创建ABS
  absPackagingPurchase: boolean // 购买ABS
  lending: boolean
  lendingBorrow: boolean // 借款
  lendingLend: boolean // 放贷
  bridge: boolean
  bridgeOwnABS: boolean // 桥接自己的ABS
  bridgePurchasedABS: boolean // 桥接购买的ABS
  fundRecovery: boolean
  fundRecoveryDirect: boolean // 直接兑换（Circle）
  fundRecoveryForexPool: boolean // 外汇池兑换
  userManagement: boolean // 用户管理（仅管理员）
  systemConfig: boolean // 系统配置（仅管理员）
}

const rolePermissionsMap: Record<UserRole, RolePermissions> = {
  admin: {
    dashboard: true,
    assetIssuance: true,
    assetIssuanceReceivable: true,
    assetIssuanceInventory: true,
    marketTrading: true,
    marketTradingPurchase: true,
    marketTradingViewOwn: false,
    absPackaging: true,
    absPackagingCreate: true,
    absPackagingPurchase: true,
    lending: true,
    lendingBorrow: true,
    lendingLend: true,
    bridge: true,
    bridgeOwnABS: true,
    bridgePurchasedABS: true,
    fundRecovery: true,
    fundRecoveryDirect: true,
    fundRecoveryForexPool: true,
    userManagement: true,
    systemConfig: true,
  },
  银行: {
    dashboard: true,
    assetIssuance: false, // Create Tokens: No
    assetIssuanceReceivable: false,
    assetIssuanceInventory: false,
    marketTrading: true, // Buy Tokens: Yes
    marketTradingPurchase: true,
    marketTradingViewOwn: false,
    absPackaging: true, // Bundle ABS: Yes
    absPackagingCreate: true,
    absPackagingPurchase: false, // Buy ABS: N/A (表格显示N/A，理解为不能购买)
    lending: true, // Collateral Lending: Yes (Lender)
    lendingBorrow: false,
    lendingLend: true,
    bridge: true, // Bridge ABS: Yes
    bridgeOwnABS: true,
    bridgePurchasedABS: false,
    fundRecovery: true,
    fundRecoveryDirect: true,
    fundRecoveryForexPool: true,
    userManagement: false,
    systemConfig: false,
  },
  NBFI: {
    dashboard: true,
    assetIssuance: false,
    assetIssuanceReceivable: false,
    assetIssuanceInventory: false,
    marketTrading: true,
    marketTradingPurchase: true,
    marketTradingViewOwn: false,
    absPackaging: true,
    absPackagingCreate: false,
    absPackagingPurchase: true,
    lending: true,
    lendingBorrow: true,
    lendingLend: false,
    bridge: true,
    bridgeOwnABS: false,
    bridgePurchasedABS: true,
    fundRecovery: true,
    fundRecoveryDirect: false,
    fundRecoveryForexPool: true,
    userManagement: false,
    systemConfig: false,
  },
  核心企业: {
    dashboard: true,
    assetIssuance: true, // Create Tokens (Receivables): Yes
    assetIssuanceReceivable: true,
    assetIssuanceInventory: false,
    marketTrading: false, // Buy Tokens: No (根据表格，核心企业不能购买代币)
    marketTradingPurchase: false,
    marketTradingViewOwn: false,
    absPackaging: false, // Bundle ABS: No
    absPackagingCreate: false,
    absPackagingPurchase: false, // Buy ABS: No
    lending: false, // Collateral Lending: No
    lendingBorrow: false,
    lendingLend: false,
    bridge: false, // Bridge ABS: No
    bridgeOwnABS: false,
    bridgePurchasedABS: false,
    fundRecovery: false,
    fundRecoveryDirect: false,
    fundRecoveryForexPool: false,
    userManagement: false,
    systemConfig: false,
  },
  建筑公司: {
    dashboard: true,
    assetIssuance: true, // 可以发行库存代票，也可以查看应收账款（从核心企业收到的）
    assetIssuanceReceivable: true, // 可以查看从核心企业收到的应收账款代票
    assetIssuanceInventory: true, // 可以发行库存代票
    marketTrading: true, // 可以在市场出售应收账款和库存代票
    marketTradingPurchase: false,
    marketTradingViewOwn: true, // 可以查看自己的代票
    absPackaging: false, // Bundle ABS: No
    absPackagingCreate: false,
    absPackagingPurchase: false, // Buy ABS: No
    lending: false, // Collateral Lending: No
    lendingBorrow: false,
    lendingLend: false,
    bridge: false, // Bridge ABS: No
    bridgeOwnABS: false,
    bridgePurchasedABS: false,
    fundRecovery: false,
    fundRecoveryDirect: false,
    fundRecoveryForexPool: false,
    userManagement: false,
    systemConfig: false,
  },
}

export function getRolePermissions(role: string): RolePermissions {
  // 标准化角色名称
  let normalizedRole = role
  if (role === 'Bank') normalizedRole = '银行'
  if (role === 'admin' || role === '系统管理员') normalizedRole = 'admin'
  
  return rolePermissionsMap[normalizedRole as UserRole] || rolePermissionsMap['核心企业']
}

export function hasPermission(role: string, permission: keyof RolePermissions): boolean {
  const permissions = getRolePermissions(role)
  return permissions[permission] || false
}

export function getRoleThemeClass(role: string): string {
  const roleMap: Record<string, string> = {
    admin: 'role-admin',
    银行: 'role-bank',
    Bank: 'role-bank',
    NBFI: 'role-nbfi',
    核心企业: 'role-core-enterprise',
    建筑公司: 'role-construction',
  }
  return roleMap[role] || 'role-default'
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '系统管理员',
    银行: '银行',
    Bank: '银行',
    NBFI: '非银行金融机构',
    核心企业: '核心企业',
    建筑公司: '建筑公司',
  }
  return roleMap[role] || role
}

export function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    admin: '#7C3AED', // 紫色
    银行: '#1E40AF', // 深蓝色
    Bank: '#1E40AF',
    NBFI: '#059669', // 翡翠绿
    核心企业: '#EA580C', // 深橙色
    建筑公司: '#0D9488', // 深青色
  }
  return colorMap[role] || '#6B7280'
}
