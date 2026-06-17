import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/server/db/prisma';
import Link from 'next/link';
import { removeFavourite } from '@/server/actions/favourites';
import BookingButton from '@/components/modules/BookingButton';
import ClickableCard from '@/components/modules/ClickableCard';
import PaginatedWrapper from '@/components/ui/PaginatedWrapper';
import FallbackImage from '@/components/ui/FallbackImage';

const getValidImage = (url?: string | null) => {
  if (!url || typeof url !== 'string') return null;
  let clean = url.trim();
  if (clean.includes(',')) {
    clean = clean.split(',')[0].trim();
  }
  if (clean === '' || clean === 'null' || clean === 'undefined' || clean.startsWith('wix:')) return null;
  return clean;
};

export default async function FavouritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch favourites with the associated vendor data
  const favourites = await prisma.favourite.findMany({
    where: { userId: session.user.id },
    include: {
      vendor: {
        include: { portfolio: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-headline-xl text-4xl font-bold text-primary tracking-tight">Favourites</h1>
        <p className="font-body-md text-on-surface-variant mt-2">Vendors you have saved for quick access.</p>
      </div>

      {favourites.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-4">favorite_border</span>
          <h3 className="font-headline-md text-primary font-bold mb-2">No favourites yet</h3>
          <p className="font-body-sm text-on-surface-variant mb-6">Start exploring to build your dream wedding team.</p>
          <Link href="/vendors" className="bg-primary text-on-primary font-label-md px-6 py-3 rounded hover:bg-primary/90 transition-colors">
            Explore Vendors
          </Link>
        </div>
      ) : (
        <PaginatedWrapper itemsPerPage={6}>
          {favourites.map(({ id, vendor }) => {
            const displayImage = getValidImage(vendor.profilePic) 
              || getValidImage(vendor.coverImage) 
              || (vendor.portfolioImages && vendor.portfolioImages.length > 0 ? getValidImage(vendor.portfolioImages[0]) : null);

            return (
            <ClickableCard 
              key={id} 
              slug={vendor.slug}
              className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/30 transition-colors"
            >
              
              {/* Vendor Info */}
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 flex items-center justify-center border border-outline-variant">
                  {displayImage ? (
                    <FallbackImage 
                      src={displayImage} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">storefront</span>
                  )}
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-primary uppercase tracking-wider">{vendor.name}</h3>
                  <p className="font-label-sm text-on-surface-variant mt-1">{vendor.city}, {vendor.state}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                <BookingButton vendorId={vendor.id} vendorName={vendor.name} />
                
                <Link 
                  href={`/vendors/${vendor.slug}`}
                  className="flex-1 md:flex-none text-center bg-primary text-on-primary font-label-sm px-6 py-2.5 rounded hover:bg-primary/90 transition-colors"
                >
                  View Profile
                </Link>
                <form action={async () => {
                  'use server';
                  await removeFavourite(id);
                }}>
                  <button 
                    className="w-10 h-10 rounded flex items-center justify-center border border-outline-variant text-error hover:bg-error-container hover:border-error transition-colors cursor-pointer"
                    title="Remove from Favourites" type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                  </form>
              </div>
            </ClickableCard>
            );
          })}
        </PaginatedWrapper>
      )}
    </div>
  );
}
