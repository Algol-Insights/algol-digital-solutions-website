import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, normalizeRole } from '@/lib/rbac';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session || !session.user) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  // Check if user has admin role
  const userRole = normalizeRole((session.user as any).role);
  if (!hasPermission(userRole, 'admin:access')) {
    // Non-admin users get redirected to home page
    redirect('/');
  }

  return <AdminShell userRole={userRole}>{children}</AdminShell>;
}
