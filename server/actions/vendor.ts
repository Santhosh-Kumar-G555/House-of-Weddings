'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

export async function updateVendorProfile(data: Partial<any>, targetVendorId?: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const isVendor = session?.user?.id && role === 'VENDOR';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  if (!isVendor && !isAdmin) {
    return { error: 'Unauthorized' };
  }

  let queryWhere: any;
  let isCreating = false;

  if (isAdmin && !targetVendorId) {
    // Admin is creating a completely new vendor
    isCreating = true;
  } else if (isAdmin && targetVendorId) {
    queryWhere = { id: targetVendorId };
  } else if (isVendor) {
    queryWhere = { userId: session?.user?.id };
  } else {
    return { error: 'Invalid update request context.' };
  }



  const safeInt = (val: any) => {
    if (val === undefined || val === null || val === '') return undefined;
    const parsed = parseInt(val);
    return isNaN(parsed) ? undefined : parsed;
  };

  try {
      let newVendorId: string | undefined = undefined;

      const mappedData = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.serviceCounty !== undefined && { serviceCounty: data.serviceCounty }),
        ...(data.price !== undefined && { price: safeInt(data.price) }),
        ...(data.experience !== undefined && { experience: safeInt(data.experience) }),
        ...(data.clientsCount !== undefined && { clientsCount: safeInt(data.clientsCount) }),
        ...(data.communitiesCount !== undefined && { communitiesCount: safeInt(data.communitiesCount) }),
        ...(data.citiesCount !== undefined && { citiesCount: safeInt(data.citiesCount) }),
        ...(data.countriesCount !== undefined && { countriesCount: safeInt(data.countriesCount) }),
        ...(data.signatureStyle !== undefined && { signatureStyle: data.signatureStyle }),
        ...(data.brandsUsed !== undefined && { brandsUsed: data.brandsUsed }),
        ...(data.idealBooking !== undefined && { idealBooking: data.idealBooking }),
        ...(data.serviceCities !== undefined && { serviceCities: data.serviceCities }),
        ...(data.serviceCountries !== undefined && { serviceCountries: data.serviceCountries }),
        ...(data.profileImage !== undefined && { profilePic: data.profileImage }),
        ...(data.portfolioImages !== undefined && { portfolioImages: data.portfolioImages }),
      };

      if (isCreating) {
        if (!mappedData.name || !mappedData.city || !mappedData.state) {
          return { error: 'Name, City, and State are required to create a vendor.' };
        }
        const slug = mappedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
        
        const newVendor = await prisma.vendor.create({
          data: {
            ...mappedData,
            name: mappedData.name,
            city: mappedData.city,
            state: mappedData.state,
            slug
          }
        });
        newVendorId = newVendor.id;
      } else {
        await prisma.vendor.update({
          where: queryWhere,
          data: mappedData
        });
      }

      // Revalidate the vendor dashboard and the public directory
      revalidatePath('/vendor/dashboard');
      revalidatePath('/admin/vendors');
      revalidatePath('/vendors');
      revalidatePath('/vendor/portfolio');

      return { success: true, newId: newVendorId };
  } catch (error: any) {
    console.error('🔥 PRISMA UPDATE ERROR 🔥:', error);
    // Return the actual error message so the frontend can alert us
    return { error: error.message || 'Failed to update profile.' };
  }
}

export async function updateVendorCoverImage(vendorId: string, imageUrl: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { coverImage: imageUrl }
    });
    
    // Force Next.js to clear the cache so the new image shows instantly on refresh
    revalidatePath('/vendor/portfolio');
    revalidatePath(`/vendors/${updatedVendor.slug}`);
    
    return { success: true, vendor: updatedVendor };
  } catch (error) {
    console.error("Database Error: Failed to update cover image", error);
    return { error: "Failed to save image to database." };
  }
}
