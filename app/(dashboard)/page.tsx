import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/lib/db';
import { userProfiles, productSubmissions } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Package, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  const [productCount] = await db
    .select({ count: count() })
    .from(productSubmissions)
    .where(eq(productSubmissions.userId, session.user.id));

  const profileComplete = profile?.isComplete ?? false;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Welcome back, {session.user.name.split(' ')[0]}
        </h1>
        <p className="text-stone-600 mt-1">
          Manage your artwork submissions and profile
        </p>
      </div>

      {/* Profile Status Alert */}
      {!profileComplete && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">
                Complete Your Profile
              </h3>
              <p className="text-sm text-amber-700">
                Please complete your profile with banking details and delivery
                address before submitting artwork.
              </p>
            </div>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Profile Status
            </CardTitle>
            {profileComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-stone-900">
              {profileComplete ? 'Complete' : 'Incomplete'}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {profileComplete ? 'You can submit artwork' : 'Action required'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Products Submitted
            </CardTitle>
            <Package className="h-5 w-5 text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-stone-900">
              {productCount.count}
            </div>
            <p className="text-xs text-stone-500 mt-1">Artwork submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Commission Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-stone-900">55%</div>
            <p className="text-xs text-stone-500 mt-1">Your payout per sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your artwork</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {profileComplete ? (
            <>
              <Button asChild>
                <Link href="/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Artwork
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">View My Products</Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/profile">Complete Your Profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
