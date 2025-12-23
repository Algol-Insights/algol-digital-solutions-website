export type Role = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'SUPPORT' | 'USER'
export type Permission =
  | 'admin:access'
  | 'admin:products:read'
  | 'admin:products:write'
  | 'admin:categories:read'
  | 'admin:categories:write'
  | 'admin:inventory:read'
  | 'admin:inventory:write'
  | 'admin:orders:read'
  | 'admin:orders:write'
  | 'admin:analytics:read'
  | 'admin:security:read'
  | 'admin:security:write'

type PermissionValue = Permission | '*'

const rolePermissions: Record<Role, PermissionValue[]> = {
  ADMIN: ['*'],
  MANAGER: [
    'admin:access',
    'admin:products:read',
    'admin:products:write',
    'admin:categories:read',
    'admin:categories:write',
    'admin:inventory:read',
    'admin:inventory:write',
    'admin:orders:read',
    'admin:orders:write',
    'admin:analytics:read',
    'admin:security:read',
  ],
  ANALYST: [
    'admin:access',
    'admin:products:read',
    'admin:categories:read',
    'admin:inventory:read',
    'admin:orders:read',
    'admin:analytics:read',
  ],
  SUPPORT: [
    'admin:access',
    'admin:products:read',
    'admin:categories:read',
    'admin:inventory:read',
    'admin:orders:read',
  ],
  USER: [],
}

export function normalizeRole(role?: string | null): Role {
  const normalized = role?.toString().toUpperCase() || 'USER'
  if (normalized === 'ADMIN' || normalized === 'MANAGER' || normalized === 'ANALYST' || normalized === 'SUPPORT') {
    return normalized
  }
  return 'USER'
}

export function hasPermission(roleInput: string | undefined | null, permission: Permission) {
  const role = normalizeRole(roleInput)
  const permissions = rolePermissions[role]
  return permissions.includes('*') || permissions.includes(permission)
}

export function listPermissions(roleInput: string | undefined | null): Permission[] {
  const role = normalizeRole(roleInput)
  const permissions = rolePermissions[role]
  if (permissions.includes('*')) {
    const allPermissions = Object.keys(rolePermissions)
      .flatMap((r) => rolePermissions[r as Role])
      .filter((value): value is Permission => value !== '*')
    return allPermissions.filter((value, index) => allPermissions.indexOf(value) === index)
  }
  return permissions.filter((value): value is Permission => value !== '*')
}
