'use server';

import { registerSchema } from '@/lib/validations/auth';
import prisma from '../db/prisma';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line react-doctor/server-auth-actions
export async function registerUser(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: 'Please correct the following details',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName, role } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: 'User already exists' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: role === 'VENDOR' ? 'VENDOR' : 'USER',
      vendorProfile: role === 'VENDOR' ? {
        create: {
          name: fullName || 'New Vendor',
          category: 'other',
          city: 'Pending',
          state: 'Pending',
          slug: email.split('@')[0] + '-' + Math.random().toString(36).substring(2, 7),
        }
      } : undefined
    }
  });

  return { success: true };
}
