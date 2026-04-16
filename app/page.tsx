import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { isAdminEmail } from '@/lib/admin';

export default async function HomePage() {
  const session = await getServerSession();

  if (session) {
    if (isAdminEmail(session.user.email)) {
      redirect('/admin');
    }
    redirect('/profile');
  }
  redirect('/sign-in');
}
