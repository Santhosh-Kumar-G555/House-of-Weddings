'use server';

import prisma from '@/server/db/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Reuse your strict password rules
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters.')
  .max(16, 'Password cannot exceed 16 characters.')
  .regex(/[A-Z]/, 'Must contain one uppercase letter.')
  .regex(/[0-9]/, 'Must contain one number.')
  .regex(/[^a-zA-Z0-9]/, 'Must contain one special character.');

// react-doctor-disable-next-line react-doctor/server-auth-actions -- Public action: password reset does not require authentication
export async function requestOtpAction(email: string) {
  try {
    // 1. Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security best practice: Don't reveal if an email exists or not
      return { success: true };
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Clear old OTPs and save the new one
    await prisma.passwordResetOtp.deleteMany({ where: { email } });
    await prisma.passwordResetOtp.create({
      data: { email, otp, expiresAt }
    });

    // 4. Send Email
    await sendPasswordResetEmail(email, otp);
    return { success: true };
  } catch (error) {
    console.error('OTP Error:', error);
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
}

// react-doctor-disable-next-line react-doctor/server-auth-actions -- Public action: password reset does not require authentication
export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;
  const newPassword = formData.get('newPassword') as string;

  try {
    // 1. Validate new password strictness
    const parsedPassword = passwordSchema.safeParse(newPassword);
    if (!parsedPassword.success) {
      return { success: false, error: parsedPassword.error.issues[0].message };
    }

    // 2. Verify OTP exists and is valid
    const record = await prisma.passwordResetOtp.findFirst({
      where: { email, otp }
    });

    if (!record) return { success: false, error: 'Invalid verification code.' };
    if (record.expiresAt < new Date()) return { success: false, error: 'Verification code has expired.' };

    // 3. Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword } // Note: passwordHash is the correct schema field
    });

    // 4. Delete the OTP so it cannot be reused
    await prisma.passwordResetOtp.deleteMany({ where: { email } });

    return { success: true };
  } catch (error) {
    console.error('Reset Error:', error);
    return { success: false, error: 'An error occurred while resetting your password.' };
  }
}
