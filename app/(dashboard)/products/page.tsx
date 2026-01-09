import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getUserProducts } from '@/lib/actions/products';

export default async function ProductsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Check if profile is complete
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  if (!profile?.isComplete) {
    redirect('/profile');
  }

  // Get products with WooCommerce sync
  const result = await getUserProducts();
  const products = 'products' in result ? result.products : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Listed
          </Badge>
        );
      case 'rejected':
        return <Badge variant="destructive">Removed</Badge>;
      case 'sold':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            My Products
          </h1>
          <p className="text-stone-600 mt-1">
            View and manage your submitted artwork
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Artwork
          </Link>
        </Button>
      </div>

      {products?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-stone-100 p-4 mb-4">
              <Package className="h-8 w-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              No artwork submitted yet
            </h3>
            <p className="text-stone-600 text-center mb-4 max-w-sm">
              Start by submitting your first artwork. It will be reviewed by our
              team before being listed.
            </p>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Artwork
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products?.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.artistName}
                      {product.exhibitionName && ` • ${product.exhibitionName}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(product.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-stone-500">Selling Price:</span>{' '}
                      <span className="font-medium text-stone-900">
                        R{parseFloat(product.sellingPrice).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500">Your Payout:</span>{' '}
                      <span className="font-medium text-green-700">
                        R{parseFloat(product.artistPayout).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-stone-500">
                    Submitted{' '}
                    {formatDistanceToNow(new Date(product.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
