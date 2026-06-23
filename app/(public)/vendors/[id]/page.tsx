import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/server/db/prisma";
import { auth } from '@/auth';
import FavouriteButton from '@/components/modules/FavouriteButton';
import ShortlistButton from '@/components/modules/ShortlistButton';
import PublicPortfolioGrid from '@/components/modules/PublicPortfolioGrid';
import BookingButton from '@/components/modules/BookingButton';
import FallbackImage from '@/components/ui/FallbackImage';
import ProfileImagePopup from '@/components/modules/ProfileImagePopup';

const getValidImage = (url?: string | null) => {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (clean === '' || clean === 'null' || clean === 'undefined' || clean.startsWith('wix:')) return null;
  return clean;
};

const formatCategory = (str?: string) => {
  if (!str || str === 'other') return 'Other Services';
  return str
    .split(' ')
    .map(word => word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default async function VendorProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const slugOrId = resolvedParams.id;

  const vendor = await prisma.vendor.findFirst({
    where: {
      OR: [
        { slug: slugOrId },
        { id: slugOrId }
      ]
    }
  });

  if (!vendor) {
    return notFound();
  }

  // Security Check: If the category is hidden, do not show the vendor
  const vendorCategory = await prisma.category.findUnique({
    where: { name: vendor.category }
  });

  if (vendorCategory && !vendorCategory.isVisible) {
    return notFound();
  }

  const session = await auth();

  // Check if the current user has favorited this vendor
  let isFavorited = false;
  let isShortlisted = false;
  if (session?.user?.id) {
    const fav = await prisma.favourite.findUnique({
      where: {
        userId_vendorId: {
          userId: session.user.id,
          vendorId: vendor.id
        }
      }
    });
    isFavorited = !!fav;

    const short = await prisma.shortlist.findUnique({
      where: {
        userId_vendorId: {
          userId: session.user.id,
          vendorId: vendor.id
        }
      }
    });
    isShortlisted = !!short;
  }

  return (
    <main className="w-full px-6 md:px-12 lg:px-16 xl:px-24 py-6 grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-8 lg:gap-x-12 bg-background">


      <aside className="lg:col-span-4 flex flex-col gap-8">
        {/* Card 1: Avatar & Primary Actions */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col items-center text-center overflow-hidden">
          
          {/* Cover Image Block */}
          <div className="w-full h-32 md:h-40 bg-surface-container-high relative border-b border-outline-variant">
            {getValidImage(vendor.coverImage) ? (
              <FallbackImage 
                src={getValidImage(vendor.coverImage)!} 
                alt={`${vendor.name} cover`} 
                className="w-full h-full object-cover"
                fallbackSrc="https://placehold.co/1200x400/e2e8f0/64748b?text=No+Cover"
              />
            ) : null}
          </div>

          <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-surface-container-lowest -mt-24 relative z-10 bg-surface-variant">
            <ProfileImagePopup
              src={getValidImage(vendor.profilePic) || ''}
              alt={`${vendor.name} profile`}
              fallbackSrc="https://placehold.co/400x400/e2e8f0/64748b?text=Storefront"
            />
          </div>
          
          <div className="px-8 pb-8 w-full flex flex-col items-center">
            {/* Vendor Identity Section */}
            <div className="text-center mt-4 w-full">
              <h1 className="font-headline-lg text-3xl font-bold text-primary tracking-tight">{vendor.name}</h1>
              
              {/* The New Taxonomy Display */}
              <div className="flex flex-col items-center gap-1 mt-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider rounded-full">
                  {formatCategory(vendor.category)}
                </span>
                {vendor.description && (
                  <span className="text-sm text-on-surface-variant italic">
                    {vendor.description}
                  </span>
                )}
              </div>

              <p className="text-sm text-on-surface-variant flex items-center justify-center gap-1 mb-6">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {vendor.city}{vendor.serviceCounty ? `, ${vendor.serviceCounty}` : ''}{vendor.state ? `, ${vendor.state}` : ''}
              </p>
            </div>
          <div className="flex items-center gap-4 w-full">
            <BookingButton vendorId={vendor.id} vendorName={vendor.name} />
            <FavouriteButton
              vendorId={vendor.id}
              initialIsFavorited={isFavorited}
              isLoggedIn={!!session?.user}
            />
            <ShortlistButton
              vendorId={vendor.id}
              initialIsShortlisted={isShortlisted}
              isLoggedIn={!!session?.user}
            />
          </div>
          </div>
        </div>

        {/* Card 2: Professional Metrics & Badges */}
        <div className="bg-surface-container-lowest p-8 border border-outline-variant rounded">
          <h2 className="font-headline-md text-xl font-bold text-primary mb-6 border-b border-outline-variant pb-4">Experience</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="font-headline-lg text-3xl font-semibold text-primary">{vendor.experience || 0}+</p>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Years Exp.</p>
            </div>
            <div>
              <p className="font-headline-lg text-3xl font-semibold text-primary">{vendor.clientsCount || 0}+</p>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Clients</p>
            </div>
            <div>
              <p className="font-headline-lg text-3xl font-semibold text-primary">{vendor.communitiesCount || 0}+</p>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Communities</p>
            </div>
            <div>
              <p className="font-headline-lg text-3xl font-semibold text-primary">{vendor.citiesCount || 0}</p>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Cities</p>
            </div>
            <div>
              <p className="font-headline-lg text-3xl font-semibold text-primary">{vendor.countriesCount || 0}</p>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Countries</p>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Service Cities</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {vendor.serviceCities ? Array.from(new Set(vendor.serviceCities.split(',').flatMap(c => { const t = c.trim(); return t ? [t] : []; }))).map((city, idx) => (
                <span key={`${city}-${idx}`} className="bg-surface-container text-on-surface text-[12px] px-3 py-1 rounded-sm border border-outline-variant/30">{city}</span>
              )) : (
                <span className="text-sm text-on-surface-variant">Not specified</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Service Countries</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {vendor.serviceCountries ? Array.from(new Set(vendor.serviceCountries.split(',').flatMap(c => { const t = c.trim(); return t ? [t] : []; }))).map((country, idx) => (
                <span key={`${country}-${idx}`} className="bg-surface-container text-on-surface text-[12px] px-3 py-1 rounded-sm border border-outline-variant/30">{country}</span>
              )) : (
                <span className="text-sm text-on-surface-variant">Not specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Commercial Details */}
        <div className="bg-surface-container-lowest p-8 border border-outline-variant rounded">
          <h2 className="font-headline-md text-xl font-bold text-primary mb-6 border-b border-outline-variant pb-4">Details</h2>
          <div className="mb-6">
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Signature Style</p>
            <p className="text-lg font-medium text-primary">{vendor.signatureStyle || 'Not specified'}</p>
          </div>
          <div className="mb-6">
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Brands Usually Used</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">{vendor.brandsUsed || 'Not specified'}</p>
          </div>
          <div className="mb-6 border-t border-outline-variant/40 pt-4">
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Starting Price</p>
            <p className="text-lg font-semibold text-primary">{vendor.price ? `₹${vendor.price.toLocaleString()}` : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Ideal Booking Before</p>
            <p className="text-lg font-medium text-primary">{vendor.idealBooking || 'Not specified'}</p>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 h-full">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
            <h2 className="font-headline-md text-2xl font-bold text-primary">Portfolio</h2>
            {/* <button className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button> */}
          </div>

          {/* Bento Layout Configuration via PublicPortfolioGrid Component */}
          <PublicPortfolioGrid 
            images={(vendor.portfolioImages || []).map(img => getValidImage(img)).filter((img): img is string => img !== null)} 
            vendorName={vendor.name} 
          />
        </div>
      </section>
    </main>
  );
}
