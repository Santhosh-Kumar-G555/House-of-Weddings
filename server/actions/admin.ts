'use server';

import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// Helper to verify standard Admin or Super Admin status
async function requireAuth() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

export async function deleteUserAccount(userId: string) {
  await requireAuth();
  try {
    // Failsafe: Never allow deletion of a Super Admin
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === 'SUPER_ADMIN') {
      return { error: 'Cannot delete a Super Admin account.' };
    }

    await prisma.user.delete({
      where: { id: userId }
    });
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User account permanently deleted.' };
  } catch (error) {
    console.error('Delete User Error:', error);
    return { error: 'Failed to delete user account.' };
  }
}

export async function deleteVendorProfile(vendorId: string) {
  await requireAuth();
  try {
    await prisma.vendor.delete({
      where: { id: vendorId }
    });
    
    revalidatePath('/admin/vendors');
    revalidatePath('/admin/dashboard'); // Update dashboard metrics too
    return { success: true, message: 'Vendor profile permanently deleted.' };
  } catch (error) {
    console.error('Delete Vendor Error:', error);
    return { error: 'Failed to delete vendor profile.' };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
  await requireAuth(); 
  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status }
    });
    
    revalidatePath('/admin/appointments');
    revalidatePath('/admin/dashboard'); 
    return { success: true, message: `Appointment marked as ${status}.` };
  } catch (error) {
    console.error('Update Appointment Error:', error);
    return { error: 'Failed to update appointment status.' };
  }
}

// --- VENDOR ACTIONS ---
export async function upsertVendor(formData: FormData, vendorId?: string) {
  await requireAuth();
  
  const data = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    description: (formData.get('description') as string) || '',
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    serviceCounty: formData.get('serviceCounty') as string | null,
    price: parseFloat((formData.get('price') as string) || '0'),
    experience: parseInt((formData.get('experience') as string) || '0', 10),
    profilePic: formData.get('profilePic') as string | null,
    coverImage: formData.get('coverImage') as string | null,
    signatureStyle: formData.get('signatureStyle') as string | null,
    brandsUsed: formData.get('brandsUsed') as string | null,
    serviceCities: formData.get('serviceCities') as string | null,
    serviceCountries: formData.get('serviceCountries') as string | null,
    idealBooking: formData.get('idealBooking') as string | null,
    clientsCount: parseInt((formData.get('clientsCount') as string) || '0', 10),
    communitiesCount: parseInt((formData.get('communitiesCount') as string) || '0', 10),
    citiesCount: parseInt((formData.get('citiesCount') as string) || '0', 10),
    countriesCount: parseInt((formData.get('countriesCount') as string) || '0', 10),
  };

  try {
    if (vendorId && vendorId !== 'new') {
      // Update existing vendor
      await prisma.vendor.update({ where: { id: vendorId }, data });
      revalidatePath('/admin/vendors');
      return { success: true, message: 'Vendor updated successfully.' };
    } else {
      // Create new vendor
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await prisma.vendor.create({ data: { ...data, slug } });
      revalidatePath('/admin/vendors');
      return { success: true, message: 'New vendor created.' };
    }
  } catch (error) {
    console.error('Upsert Vendor Error:', error);
    return { error: 'Failed to save vendor details.' };
  }
}

// --- USER ACTIONS ---
export async function upsertUser(formData: FormData, userId?: string) {
  await requireAuth();
  
  // Fetch session to check if they are specifically a SUPER_ADMIN
  const session = await auth();
  const currentUserRole = (session?.user as any)?.role;

  const targetRole = formData.get('role') as 'USER' | 'ADMIN' | 'VENDOR';

  // STRICT SECURITY CHECK: Block standard admins from assigning the ADMIN role
  if (targetRole === 'ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized: Only Super Admins can grant Admin privileges.' };
  }
  
  const data = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    role: targetRole,
  };

  try {
    if (userId && userId !== 'new') {
      await prisma.user.update({ where: { id: userId }, data });
      revalidatePath('/admin/users');
      return { success: true, message: 'User updated successfully.' };
    } else {
      const password = formData.get('password') as string;
      if (!password) {
        return { error: 'Initial password is required for new users.' };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.create({ 
        data: {
          ...data,
          passwordHash: hashedPassword,
        }
      }); 
      revalidatePath('/admin/users');
      return { success: true, message: 'New user created.' };
    }
  } catch (error) {
    return { error: 'Failed to save user details.' };
  }
}
