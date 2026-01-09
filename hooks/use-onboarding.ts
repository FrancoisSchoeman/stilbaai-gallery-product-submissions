'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

const ONBOARDING_KEY = 'stilbaai-gallery-onboarding-completed';

function getSnapshot(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

function getServerSnapshot(): boolean {
  return false; // SSR: assume not completed
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useOnboarding() {
  const hasCompletedOnboarding = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_KEY) !== 'true';
  });

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const skipOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const restartOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  return {
    hasCompletedOnboarding,
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
    setShowOnboarding,
  };
}
