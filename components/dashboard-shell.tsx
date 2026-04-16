'use client';

import { DashboardNav } from '@/components/dashboard-nav';
import { OnboardingOverlay } from '@/components/onboarding-overlay';
import { useOnboarding } from '@/hooks/use-onboarding';

interface DashboardShellProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  profileComplete: boolean;
  /** Show Admin nav + highlight when on /admin */
  isAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({
  user,
  profileComplete,
  isAdmin,
  children,
}: DashboardShellProps) {
  const {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
  } = useOnboarding();

  return (
    <div className="min-h-screen bg-stone-50">
      <DashboardNav
        user={user}
        profileComplete={profileComplete}
        isAdmin={isAdmin}
        onRestartTutorial={restartOnboarding}
      />
      <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
      <OnboardingOverlay
        open={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    </div>
  );
}
