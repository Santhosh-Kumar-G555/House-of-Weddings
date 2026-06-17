'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Action 1: For Users to Request an Appointment
export async function createAppointment(data: { vendorId: string, date: Date, time: string, message?: string }) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'USER') {
    return { error: 'You must be logged in as a user to book an appointment.' };
  }

  try {
    await prisma.appointment.create({
      data: {
        userId: session.user.id,
        vendorId: data.vendorId,
        date: data.date,
        time: data.time,
        message: data.message,
        status: 'PENDING'
      }
    });

    revalidatePath('/profile/appointments');
    revalidatePath(`/vendors/${data.vendorId}`);
    return { success: true };
  } catch (error) {
    console.error('Booking Error:', error);
    return { error: 'Failed to request appointment. Please try again.' };
  }
}

// Action 2: For Vendors to Update the Status
export async function updateAppointmentStatus(appointmentId: string, newStatus: 'CONFIRMED' | 'CANCELLED') {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'VENDOR') return { error: 'Unauthorized' };

  try {
    // Ensure the vendor actually owns this appointment before updating
    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    if (!vendor) return { error: 'Vendor profile not found.' };

    await prisma.appointment.update({
      where: { id: appointmentId, vendorId: vendor.id },
      data: { status: newStatus }
    });

    revalidatePath('/vendor/appointments');
    revalidatePath('/vendor/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update appointment status.' };
  }
}

export async function rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized.' };
  }

  try {
    let whereClause = {};

    // Determine the correct ownership check based on role
    if ((session.user as any).role === 'USER') {
      whereClause = { id: appointmentId, userId: session.user.id };
    } else if ((session.user as any).role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
      if (!vendor) return { error: 'Vendor profile not found.' };
      whereClause = { id: appointmentId, vendorId: vendor.id };
    } else {
      return { error: 'Invalid role.' };
    }

    await prisma.appointment.updateMany({
      where: whereClause,
      data: {
        date: newDate,
        time: newTime,
        status: 'PENDING' // Pushes it back to pending for the other party to review
      }
    });

    revalidatePath('/profile/appointments');
    revalidatePath('/vendor/dashboard');
    revalidatePath('/vendor/appointments');
    return { success: true };
  } catch (error) {
    console.error('Reschedule Error:', error);
    return { error: 'Failed to reschedule appointment.' };
  }
}
