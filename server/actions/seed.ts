'use server';

import prisma from '@/server/db/prisma';
import { auth } from '@/auth';

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function seedInitialCategories() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') throw new Error('Unauthorized');

  try {
    // This is the exact map of your current hardcoded categories and their service types
    const INITIAL_CATEGORIES = [
      { name: 'Venues and Locations', services: [] },
      { name: 'Beauty Makeup and Mehendi', services: ['Bridal Makeup Artists', 'Family/Guest Makeup Artists'] },
      { name: 'Photography and Videography', services: ['Cinematic Videographers', 'Pre-wedding Shoot Photographers', 'Candid Photographers'] },
      { name: 'Decoration and Decor', services: ['Flower Decorators / Florists', 'Lighting and Mandap Decorators'] },
      { name: 'Bridal and Groom Wear', services: ['Anarkali and Cocktail Dresses', 'Kanjeevaram / Silk Sarees', 'Suits / Tuxedos'] },
      { name: 'Bridal Grooming and Wellness', services: ['Dermatologists'] },
      { name: 'Catering and Food', services: ['Wedding Caterers'] },
      { name: 'Invitations and Gifting', services: ['Wedding Gifts', 'Wedding Favors and Return Gifts'] },
      { name: 'Music and Entertainment', services: ['Anchor / Emcees', 'DJs'] },
      { name: 'Pandiths and Rituals', services: ['Wedding Pandits / Priests'] },
      { name: 'Transportation and Logistics', services: ['Guest Transportation'] },
      { name: 'Honeymoon and Travel', services: ['Honeymoon Planners', 'Travel Agents'] },
      { name: 'Jewellery and Accessories', services: ['Imitation Jewellery', 'Trousseau Suites', 'Accessories'] },
      { name: 'Rentals and Experiences', services: ['Vintage Cars'] },
      { name: 'Wedding Planners and Coordination', services: [] },
      { name: 'Others', services: ['Pre-marital Counseling'] }
    ];

    await Promise.all(
      INITIAL_CATEGORIES.map(async (cat) => {
        // Upsert the main category
        const categoryRecord = await prisma.category.upsert({
          where: { name: cat.name },
          update: {},
          create: {
            name: cat.name,
            slug: generateSlug(cat.name),
            isVisible: true,
          }
        });

        // Upsert its sub-categories (service types)
        await Promise.all(
          cat.services.map(async (service) => {
            await prisma.serviceType.upsert({
              where: { name_categoryId: { name: service, categoryId: categoryRecord.id } },
              update: {},
              create: {
                name: service,
                slug: generateSlug(service),
                categoryId: categoryRecord.id,
                isVisible: true,
              }
            });
          })
        );
      })
    );
    return { success: true, message: 'Successfully seeded all categories and sub-categories!' };
  } catch (error) {
    console.error('Seeding error:', error);
    return { error: 'Failed to seed categories.' };
  }
}
