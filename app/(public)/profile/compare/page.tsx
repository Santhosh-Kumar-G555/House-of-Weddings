import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/server/db/prisma';
import Link from 'next/link';
import RemoveCompareButton from '@/components/modules/RemoveCompareButton';
import CompareMasterSearch from '@/components/modules/CompareMasterSearch';
import FallbackImage from '@/components/ui/FallbackImage';
import Image from "next/image";

const getValidImage = (url?: string | null) => {
  if (!url || typeof url !== 'string') return null;
  let clean = url.trim();
  if (clean.includes(',')) {
    clean = clean.split(',')[0].trim();
  }
  if (clean === '' || clean === 'null' || clean === 'undefined' || clean.startsWith('wix:')) return null;
  return clean;
};

export default async function ComparePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const compareList = await prisma.compare.findMany({
    where: { userId: session.user.id },
    include: { 
      vendor: {
        include: { portfolio: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  const rawFavorites = await prisma.favourite.findMany({
    where: { userId: session.user.id },
    include: { vendor: { select: { id: true, name: true, category: true } } }
  });
  
  const compareVendorIds = new Set(compareList.map(c => c.vendorId));
  const availableFavorites = rawFavorites.map(f => f.vendor).filter(v => !compareVendorIds.has(v.id));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-headline-xl text-4xl font-bold text-primary tracking-tight text-center">Compare Vendors</h1>
        <p className="font-body-md text-on-surface-variant mt-2 text-center">Analyzing {compareList.length} of 3 vendors.</p>
      </div>

      <CompareMasterSearch favorites={availableFavorites} currentCount={compareList.length} />

      {compareList.length === 0 ? (
        <div className="mt-20 text-center animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
          <span className="material-symbols-outlined text-6xl text-outline-variant/50 mb-4 block">query_stats</span>
          <h2 className="font-headline-md text-primary font-bold">Start by searching and adding a favorite vendor above to compare.</h2>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(0, 1fr))`, gap: '1.5rem' }}>

            {compareList.map(({ id, vendor }) => {
              const displayImage = getValidImage(vendor.profilePic) 
                || getValidImage(vendor.coverImage) 
                || (vendor.portfolioImages && vendor.portfolioImages.length > 0 ? getValidImage(vendor.portfolioImages[0]) : null);

              return (
              <div key={id} className="relative bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col">

                {/* NEW: Remove Button */}
                <RemoveCompareButton compareId={id} />

                {/* Header / Basic Info */}
                <div className="p-6 border-b border-outline-variant bg-surface-bright flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 bg-surface-variant rounded-full mb-4 flex items-center justify-center overflow-hidden border border-outline-variant">
                    {displayImage ? (
                      <FallbackImage 
                        src={displayImage} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">store</span>
                    )}
                  </div>
                  <h3 className="font-headline-sm font-bold text-primary mb-1">{vendor.name}</h3>
                  <p className="font-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> {vendor.city}
                  </p>
                  <Link href={`/vendors/${vendor.slug}`} className="mt-4 w-full bg-primary-container text-on-primary-container py-2 rounded font-label-sm font-bold hover:bg-primary-container/80 transition-colors">
                    View Profile
                  </Link>
                </div>

                {/* Data Rows */}
                <div className="p-6 flex flex-col gap-6 flex-1">

                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 text-[10px]">Experience</p>
                    <p className="font-body-md text-on-surface font-medium">{vendor.experience ? `${vendor.experience} Years` : 'N/A'}</p>
                  </div>

                  <div className="h-px bg-outline-variant w-full"></div>

                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 text-[10px]">Pricing</p>
                    <p className="font-body-md text-on-surface font-medium">{vendor.price ? `₹${vendor.price.toLocaleString()}` : 'Upon Request'}</p>
                  </div>

                  <div className="h-px bg-outline-variant w-full"></div>

                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 text-[10px]">Communities Served</p>
                    <p className="font-body-md text-on-surface font-medium">{vendor.communitiesCount ? `${vendor.communitiesCount} Communities` : 'N/A'}</p>
                  </div>

                  <div className="h-px bg-outline-variant w-full"></div>

                  {/* New: Portfolio Count */}
                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 text-[10px]">Total Images</p>
                    <p className="font-body-md text-on-surface font-medium">
                      {vendor.portfolioImages?.length || 0} Images
                    </p>
                  </div>

                  <div className="h-px bg-outline-variant w-full"></div>

                  {/* New: Style Preview */}
                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 text-[10px]">Style Preview</p>
                    <div className="flex gap-2">
                      {vendor.portfolioImages && vendor.portfolioImages.length > 0 ? (
                        vendor.portfolioImages.slice(0, 3).map((imgUrl: string) => {
                          const validUrl = getValidImage(imgUrl);
                          if (!validUrl) return null;
                          return (
                            <div key={validUrl} className="relative w-12 h-12 rounded bg-surface-variant border border-outline-variant overflow-hidden flex-shrink-0">
                              <FallbackImage src={validUrl} alt="Portfolio preview" className="w-full h-full object-cover" />
                            </div>
                          );
                        })
                      ) : (
                        <p className="font-body-sm text-on-surface-variant italic">No images available</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
              );
            })}

          </div>
        </div>
      )}
    </div>
  );
}
