'use server';

import { db } from '@/lib/db';
import { user, userProfiles, productSubmissions } from '@/lib/db/schema';
import { desc, eq, count } from 'drizzle-orm';
import { getServerSession } from '@/lib/auth-server';
import { isAdminEmail } from '@/lib/admin';
import type { UserProfile, ProductSubmission } from '@/lib/db/schema';

type GuardError = 'Unauthorized' | 'Forbidden';

async function requireAdmin(): Promise<
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof getServerSession>>> }
  | { ok: false; error: GuardError }
> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: 'Unauthorized' };
  if (!isAdminEmail(session.user.email)) return { ok: false, error: 'Forbidden' };
  return { ok: true, session };
}

export type AdminUserListRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  profile: null | {
    isComplete: boolean;
    name: string;
    surname: string;
  };
  submissionCount: number;
};

export async function getAdminUserList(): Promise<
  { error: GuardError; users: [] } | { error: null; users: AdminUserListRow[] }
> {
  const guard = await requireAdmin();
  if (!guard.ok) return { error: guard.error, users: [] };

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      profileIsComplete: userProfiles.isComplete,
      profileName: userProfiles.name,
      profileSurname: userProfiles.surname,
    })
    .from(user)
    .leftJoin(userProfiles, eq(userProfiles.userId, user.id));

  const countRows = await db
    .select({
      userId: productSubmissions.userId,
      submissionCount: count(productSubmissions.id).as('submissionCount'),
    })
    .from(productSubmissions)
    .groupBy(productSubmissions.userId);

  const countByUser = new Map(
    countRows.map((r) => [r.userId, Number(r.submissionCount)]),
  );

  const users: AdminUserListRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    createdAt: r.createdAt,
    profile:
      r.profileName != null &&
      r.profileSurname != null &&
      r.profileIsComplete != null
        ? {
            isComplete: r.profileIsComplete,
            name: r.profileName,
            surname: r.profileSurname,
          }
        : null,
    submissionCount: countByUser.get(r.id) ?? 0,
  }));

  return { error: null, users };
}

export type AdminUserDetail = {
  user: typeof user.$inferSelect;
  profile: UserProfile | null;
  submissions: ProductSubmission[];
};

export async function getAdminUserDetail(
  userId: string,
): Promise<
  | { error: GuardError; data: null }
  | { error: null; data: null }
  | { error: null; data: AdminUserDetail }
> {
  const guard = await requireAdmin();
  if (!guard.ok) return { error: guard.error, data: null };

  const [u] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (!u) return { error: null, data: null };

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });

  const submissions = await db
    .select()
    .from(productSubmissions)
    .where(eq(productSubmissions.userId, userId))
    .orderBy(desc(productSubmissions.createdAt));

  return {
    error: null,
    data: { user: u, profile: profile ?? null, submissions },
  };
}
