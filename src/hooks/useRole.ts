import { useState, useEffect } from 'react'
import { getRolePermissions, getRoleThemeClass, getRoleDisplayName, getRoleColor, type UserRole } from '../utils/rolePermissions'

export function useRole() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole')
    // 标准化角色名称
    if (savedRole === 'Bank') return '银行'
    if (savedRole === 'admin') return 'admin'
    return (savedRole as UserRole) || '核心企业'
  })

  const permissions = getRolePermissions(currentRole)
  const themeClass = getRoleThemeClass(currentRole)
  const displayName = getRoleDisplayName(currentRole)
  const roleColor = getRoleColor(currentRole)

  useEffect(() => {
    // 保存角色到 localStorage
    localStorage.setItem('userRole', currentRole)
    
    // 触发角色变更事件
    window.dispatchEvent(new CustomEvent('userRoleChanged', { detail: currentRole }))
    
    // 设置主题类
    document.body.className = document.body.className
      .split(' ')
      .filter((cls) => !cls.startsWith('role-'))
      .join(' ')
    document.body.classList.add(themeClass)
  }, [currentRole, themeClass])

  const updateRole = (newRole: UserRole) => {
    setCurrentRole(newRole)
  }

  return {
    currentRole,
    permissions,
    themeClass,
    displayName,
    roleColor,
    updateRole,
  }
}
