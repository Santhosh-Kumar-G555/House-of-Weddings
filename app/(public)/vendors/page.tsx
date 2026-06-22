import { Suspense } from "react";
import prisma from "@/server/db/prisma";
import VendorGrid from "@/components/modules/VendorGrid";
import type { VendorListing } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Extract query parameters
  const query = (resolvedSearchParams?.vendor || resolvedSearchParams?.q || '') as string;



  // 1. Fetch all HIDDEN categories to build a blacklist
  // This preserves legacy vendors whose category strings might not exactly match the new dynamic taxonomy yet.
  const hiddenCategories = await prisma.category.findMany({
    where: { isVisible: false },
    select: { name: true, slug: true }
  });
  
  // Blacklist BOTH names and slugs to catch any data formatting in the database
  const hiddenCategoryNamesAndSlugs = hiddenCategories.flatMap((c: { name: string; slug: string }) => [c.name, c.slug, c.name.toLowerCase()]);

  // 2. Build the strict where clause
  const whereClause: any = {};
  
  if (hiddenCategoryNamesAndSlugs.length > 0) {
    whereClause.category = {
      notIn: hiddenCategoryNamesAndSlugs
    };
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
    ];
  }



  // Fetch all vendors matching the exact phrase
  const vendors = await prisma.vendor.findMany({
    where: whereClause,
    include: { portfolio: true },
  });

  // Fisher-Yates shuffle to randomize the vendor order on every refresh
  for (let i = vendors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vendors[i], vendors[j]] = [vendors[j], vendors[i]];
  }

  // Map to VendorListing format so VendorCard accepts it
  const mappedVendors: any[] = vendors.map(v => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    category: v.category as any,
    tagline: "",
    description: v.description,
    coverImage: v.coverImage || undefined,
    profilePic: v.profilePic || undefined,
    portfolioImages: v.portfolioImages || [],
    location: { city: v.city, state: v.state, coordinates: { lat: 0, lng: 0 } },
    city: v.city,
    state: v.state,
    experience: v.experience,
    price: v.price,
    rating: 4.8,
    reviewCount: 120,
    isFeatured: true,
    isVerified: true,
    socialLinks: {}
  }));

  // Fetch only visible categories for the public audience
  const publicCategories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { name: 'asc' },
    include: { 
      services: { 
        where: { isVisible: true },
        orderBy: { name: 'asc' } 
      } 
    }
  });

  return (
    <main className="w-full flex-1 px-4 md:px-[64px] py-12 md:py-16 flex flex-col bg-background">
      {/* Main Content Area (Full Width) */}
      <div className="flex-1 flex flex-col">
        {/* Results Grid */}
        <Suspense fallback={<div className="w-full text-center py-12 text-on-surface-variant font-label-lg">Loading vendors...</div>}>
          <VendorGrid vendors={mappedVendors} dynamicCategories={publicCategories} />
        </Suspense>
      </div>
    </main>
  );
}
