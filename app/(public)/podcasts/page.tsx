import React, { Suspense } from 'react';
import Image from 'next/image';
import PodcastFilter from '@/components/modules/PodcastFilter';

export const metadata = {
  title: 'Podcasts',
};

export default function PodcastsRoute() {
  return (
    <>


      {/* Podcast Filters & Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-12 w-full max-w-container mx-auto">
        <Suspense fallback={<div className="mb-12 text-on-surface-variant font-label-lg">Loading filters...</div>}>
          <PodcastFilter />
        </Suspense>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Podcast Item 1 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="Finding the Perfect Venue"
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 45 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 142</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">Finding the Perfect Venue</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">Mastering the art of site visits and understanding the hidden contractual details that most couples miss during the booking process.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">JW</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Julianne West</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Oct 24, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>

          {/* Podcast Item 2 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="Budgeting 101"
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 38 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 141</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">Budgeting 101</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">A professional breakdown of where to allocate your resources for maximum impact and how to handle unexpected costs without stress.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">MR</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Marcus Reed</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Oct 17, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>

          {/* Podcast Item 3 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="Sustainable Celebrations"
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 52 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 140</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">Sustainable Celebrations</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">How to design a luxurious wedding that honors ecological values through conscious vendor selection and plastic-free alternatives.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">EL</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Elena Lopez</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Oct 10, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>

          {/* Podcast Item 4 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="Candid or Posed?"
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 41 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 139</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">Candid or Posed?</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">Navigating photography styles and how to communicate your vision to your photographer to ensure every moment is captured perfectly.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">JW</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Julianne West</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Oct 03, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>

          {/* Podcast Item 5 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="The Modern Menu"
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 35 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 138</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">The Modern Menu</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">Moving beyond the standard chicken or fish options. A look into interactive food stations and farm-to-table wedding dining experiences.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">MR</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Marcus Reed</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Sep 26, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>

          {/* Podcast Item 6 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                alt="Meaningful Ceremonies"
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 49 mins
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE 137</span>
              <h3 className="text-headline-md font-headline-md mb-2 leading-tight">Meaningful Ceremonies</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">Expert tips on crafting a personalized wedding ceremony that reflects your unique relationship while maintaining a sense of tradition.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold">EL</div>
                <span className="text-label-md font-medium text-on-surface">Hosted by Elena Lopez</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-sm text-secondary">Sep 19, 2024</span>
              <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </article>
        </div>

        {/* Pagination */}
        <nav className="mt-20 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded bg-primary text-white text-label-md font-semibold">1</button>
          <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:border-on-surface text-label-md font-semibold transition-colors">2</button>
          <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:border-on-surface text-label-md font-semibold transition-colors">3</button>
          <span className="mx-2 text-secondary">...</span>
          <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:border-on-surface text-label-md font-semibold transition-colors">12</button>
          <button className="px-4 h-10 flex items-center justify-center border border-outline-variant rounded hover:border-on-surface text-label-md font-semibold transition-colors gap-1">
            Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </nav>
      </section>


    </>
  );
}