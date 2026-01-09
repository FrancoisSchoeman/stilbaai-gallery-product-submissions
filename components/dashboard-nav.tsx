'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Package, User, LogOut, Menu, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  profileComplete: boolean;
  onRestartTutorial?: () => void;
}

const navItems = [
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    requiresProfile: false,
  },
  {
    href: '/products',
    label: 'Products',
    icon: Package,
    requiresProfile: true,
  },
];

export function DashboardNav({
  user,
  profileComplete,
  onRestartTutorial,
}: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/sign-in');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-stone-900">
              Stilbaai Gallery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = item.requiresProfile && !profileComplete;

              return (
                <Link
                  key={item.href}
                  href={isDisabled ? '#' : item.href}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                      toast.error('Please complete your profile first');
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {onRestartTutorial && (
              <button
                onClick={onRestartTutorial}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-stone-200 text-stone-700 font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-stone-100">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = item.requiresProfile && !profileComplete;

                return (
                  <Link
                    key={item.href}
                    href={isDisabled ? '#' : item.href}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                        toast.error('Please complete your profile first');
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {onRestartTutorial && (
                <button
                  onClick={() => {
                    onRestartTutorial();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
