import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
  const userRole = (session.user as any).role;
  if (userRole !== 'ADMIN') {
    // Non-admin users get redirected to home page
    redirect('/');
  }

  return <>{children}</>;
}
