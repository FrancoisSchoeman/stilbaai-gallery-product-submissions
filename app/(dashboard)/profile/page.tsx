import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/profile-form';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  const { profile } = await getProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Your Profile
        </h1>
        <p className="text-stone-600 mt-1">
          Complete your profile to start submitting artwork
        </p>
      </div>

      <ProfileForm
        initialData={profile || undefined}
        userEmail={session.user.email}
      />
    </div>
  );
}
