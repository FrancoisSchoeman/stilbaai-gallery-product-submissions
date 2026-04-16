import { auth } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/** Use on `/admin` routes: signed-in users not in ADMIN_EMAILS go to artist area. */
export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session) redirect('/sign-in');
  if (!isAdminEmail(session.user.email)) redirect('/profile');
  return session;
}
