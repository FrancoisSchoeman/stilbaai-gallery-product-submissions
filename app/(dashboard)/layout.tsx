import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { DashboardShell } from '@/components/dashboard-shell';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Check if profile is complete
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  const profileComplete = profile?.isComplete ?? false;

  return (
    <DashboardShell user={session.user} profileComplete={profileComplete}>
      {children}
    </DashboardShell>
  );
}
