export const ADMIN_PERMISSIONS = [
  'MANAGE_REGISTRATION_REQUESTS',
  'MANAGE_LINK_REQUESTS',
  'MANAGE_DEATH_REQUESTS',
  'MANAGE_USERS',
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const hasAdminPermission = (
  role: string | undefined,
  permissions: string[] | undefined,
  permission: AdminPermission,
) => {
  if ((role || '').toLowerCase() === 'admin') return true;
  return Array.isArray(permissions) && permissions.includes(permission);
};

