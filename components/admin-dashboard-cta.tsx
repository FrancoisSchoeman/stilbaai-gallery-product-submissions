import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminDashboardCta() {
  return (
    <Card className="border-stone-200 bg-white">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-medium text-stone-900">Admin dashboard</h3>
          <p className="text-sm text-stone-600 mt-1">
            View all artist profiles and product submissions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin">
            <Shield className="mr-2 h-4 w-4" />
            Open admin dashboard
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
