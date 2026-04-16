import { requireAdminSession } from '@/lib/auth-server';
import { DashboardShell } from '@/components/dashboard-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <DashboardShell
      user={session.user}
      profileComplete
      isAdmin
    >
      {children}
    </DashboardShell>
  );
}
