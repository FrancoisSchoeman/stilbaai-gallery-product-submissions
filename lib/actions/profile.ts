'use server';

import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { getServerSession } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  idNumber: z.string().min(6, 'ID number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolder: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  branchCode: z.string().min(1, 'Branch code is required'),
  deliveryAddress: z.string().min(10, 'Delivery address is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export async function getProfile() {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  return { profile };
}

export async function updateProfile(data: ProfileFormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const existingProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id),
    });

    if (existingProfile) {
      await db
        .update(userProfiles)
        .set({
          ...validation.data,
          isComplete: true,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, session.user.id));
    } else {
      await db.insert(userProfiles).values({
        userId: session.user.id,
        ...validation.data,
        isComplete: true,
      });
    }

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}
