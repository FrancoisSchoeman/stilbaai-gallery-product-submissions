import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';

export default async function HomePage() {
  const session = await getServerSession();

  if (session) {
    redirect('/profile');
  } else {
    redirect('/sign-in');
  }
}
