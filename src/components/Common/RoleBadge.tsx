import { useRole } from '../../hooks/useRole'

interface RoleBadgeProps {
  className?: string
  showIcon?: boolean
}

function RoleBadge({ className = '', showIcon = true }: RoleBadgeProps) {
  const { displayName, roleColor } = useRole()

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-sm ${className}`}
      style={{
        backgroundColor: `${roleColor}15`,
        color: roleColor,
        border: `1px solid ${roleColor}40`,
      }}
    >
      {showIcon && (
        <i
          className="fas fa-user-tag"
          style={{ color: roleColor }}
        ></i>
      )}
      <span>{displayName}</span>
    </div>
  )
}

export default RoleBadge
