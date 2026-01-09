import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ProductForm } from '@/components/product-form';

export default async function NewProductPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Submit New Artwork
        </h1>
        <p className="text-stone-600 mt-1">
          Fill in the details below to submit your artwork for review
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
