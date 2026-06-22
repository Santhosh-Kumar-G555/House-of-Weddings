import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Podcasts',
};

export default function PodcastsRoute() {
  return (
    <>
      {/* Hero Section */}
      <header className="bg-surface-container-low py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-headline-lg md:text-headline-xl font-bold text-on-surface mb-6">Wedding Wisdom</h1>
            <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Expert advice and inspiration for your big day, hosted by industry professionals. Discover strategies for effortless planning and timeless celebrations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-primary-container text-on-primary-container px-8 py-3.5 rounded text-label-md font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Latest Episode
              </button>
              <button className="border border-outline-variant text-on-surface px-8 py-3.5 rounded text-label-md font-semibold hover:bg-surface-container-high transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square max-w-sm relative">
            <div className="absolute inset-0 bg-primary opacity-10 rounded-full blur-3xl -z-10"></div>
            <img 
              className="w-full h-full object-cover rounded-xl border border-outline-variant shadow-sm" 
              alt="Wedding Wisdom Hero" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOy-nLFtM2swwChLZ6HJvuuGLd0W2UUAmK_T6RJGcSFaBpYFft15zElxPYTXQRqCEUpkp2y_OqRXMyxnBpcDavA8wsBzXhK8QKIOsbIJUGpsZN9ImkmTNijecWCWMQobdhhYPbuLLUygsqCN0ePuZEI3xlRkQVkSFlsTricMr1xA52eJIVg_j9ZXWOd3WybTG3JfM0F0q-_PRQnW7TIPfM23PhzIbBEMlCqN0szF_PDL8ewFA_TvSuQ2dAYb6q0JmuskjBBn2rkkij"
            />
          </div>
        </div>
      </header>

      {/* Podcast Filters & Grid */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-headline-lg font-headline-lg mb-2">Browse All Episodes</h2>
            <p className="text-body-md text-on-surface-variant">Over 150 episodes of strategic wedding planning advice.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-surface border border-outline-variant rounded flex items-center gap-2 cursor-pointer hover:border-on-surface transition-colors">
              <span className="text-label-md">Categories</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
            <div className="px-4 py-2 bg-surface border border-outline-variant rounded flex items-center gap-2 cursor-pointer hover:border-on-surface transition-colors">
              <span className="text-label-md">Sort by: Newest</span>
              <span className="material-symbols-outlined text-sm">sort</span>
            </div>
          </div>
        </div>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Podcast Item 1 */}
          <article className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group">
            <div className="relative overflow-hidden mb-6 aspect-video">
              <img 
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500" 
                alt="Finding the Perfect Venue" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuCXgmNUsVmL6upAbZ5xmtuc-L55kSndi--gBPJ_XL5MRAUKCR774XLg19z2XDXpx9s6HMmKw9yitsf9-QUFyo3bcyCtWIGGqBTefpb3psv4dLMQb2SXgg4xwMBc6Cucvfu5dVmo40d0LIKu_EH_hSJtELVB0OyxfxV-vm2qzIhz_e49cLpmy1jaL3a-vE2ZirPz0cApym51vQNDWe0gQ1dsm-iDkMYvxfS3zBIl-wC2ykebbX66cvqVbfXxQN3h0C3-Npo7Dx7FBz"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCynTev6KDUL1oj9zXAUqVnQQA50NgJNiyFO1QmqOnMHplkLfXB84AqF4-jh0A8zTQlez1dbcURiMKSSwujIFZkfEnuA-Fhcqqx8dlXiqHtkUkQFpn-NbtrooEqIJmAaXk-uNr83UTnmdhtIOTCtaN2wcTkMzqJstCa16zMsyUeSy7dDUn6B82nuc7Q4dftNEr5hiZmX9JodUd2qGatbvMxiTrO1e5V6jzF_Y3-5Op2kdqojHJb8vkSBiR8kwKsnzJ0woNpNchlZXYR"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCESglUxJVbB3ImXhTjWL_Lwsvb0QIJqMsOwjjk8iyi55zsvYrfp1IQlrjUlsVaBlHgk72t0ADAhirxW4kcAlJveUHhy5f-ICxaLhCkkKNBgA04AO_lDWw7nLNmJqI2ppjhTAFDwoQEcPhNlZiK7YYIXNZ_k_aX1HYwMkptfsuDJRZISpn-rEpk4zDyl1NjCKXy0DDIL0MvyRIGaxAFf7p7B0KfSeAy5_5nUPGvFXpwiBd0wUgBumcQnZWhjbnfBQgRrpUNvYaiqCkf"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC95qklv3d8HpcZ0mPh-YBW0ihSYf8TWmsic2GOINrFMhHHgIpK7VZIf5LNmIXuNfUiVKt_MNK1-sb40_Y2a5gCRNkNqxyY6q-T96teh4G_qFaATgOZUtMXIz_4WUqDxn8BDYPxtxE9wqrQfc9VYooX73jbS_CT4z53UzrSI_2CBXItGpjehPhRQzlHYAYl-V2VHMmShZdsIO6HSH2fk8nSh8iGtjmmgAGq_YKjSWMnxVxOR89vtvp-nV1IxbhNC7f5_6h2EIIyQe8D"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbhHO97UUUBJ_9gpxEd8ZCcpnrB1RqX1yG7WvXWm_B34olWwwVbMkDs8oDCTCuScoH5iMnNHaRIwQ79Ktqpuq68uI__49ALV7Bf1Q2ZWv08cwQ2qO29GZfu3eyp9VowyOlPmrxN9kXUFTrvjBHZ5YxLMeSbbYQ59mSBFzVQnDd5y3go7q3JkSoJ55EJXmUf6I_gtDPOJa5XNsnND0xTt5BL0mvyIhNFpmlhgEQ_1yZ-lMXEuGfCCklAmWkTFXZ6htPvV4Y5_ij_HqY"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK3jasgEJceRaMPvdwt5HDV2AKETCNVjb75LdT4adbcMFV4LOiIuMUAtYHaxB2UCLIo53HkCMoLhoJMpg1oXXLguZ_O1U3-ulI5EXlHCGAQRFxmHb5S7668C_qixTOqfc3xT4oSAL_i2q00vCb2CoRdCpSOjnehXmF8ah-MvcBdWTbhRinNGtukSM067hFxnfQvSHWF_0dfhSJUQbM0LeZb6KZduZ6PQljlgwqsO2YVxVDJChkScx7QIYTZx4VJXGW2iF0Rfb_YIXE"
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

      {/* Newsletter / CTA */}
      <section className="bg-primary-container py-24 px-margin-mobile md:px-margin-desktop text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-headline-lg font-headline-lg text-on-primary-container mb-4">Never Miss an Episode</h2>
          <p className="text-body-md text-on-primary-container mb-8">Join 15,000+ subscribers who receive our weekly wedding wisdom delivered straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input className="flex-grow px-6 py-3.5 rounded bg-surface border-none focus:ring-2 focus:ring-primary-container text-on-surface" placeholder="Enter your email address" type="email" />
            <button className="bg-primary text-on-primary px-8 py-3.5 rounded text-label-md font-bold hover:opacity-90 transition-opacity">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
