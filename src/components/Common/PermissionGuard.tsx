import { ReactNode } from 'react'
import { useRole } from '../../hooks/useRole'
import { hasPermission } from '../../utils/rolePermissions'

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { currentRole } = useRole()
  const hasAccess = hasPermission(currentRole, permission as any)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default PermissionGuard
