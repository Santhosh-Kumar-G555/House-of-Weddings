import type { Metadata } from "next";
import prisma from '@/server/db/prisma';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/modules/Navbar";
import NavAuthButton from "@/components/modules/NavAuthButton";
import Footer from "@/components/modules/Footer";
import DynamicFooterWrapper from "@/components/modules/DynamicFooterWrapper";
import { auth } from "@/auth";
import AuthProvider from '@/components/providers/AuthProvider';

/* ── Semantic Design System font — Inter ─────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ── Dynamic Metadata ───────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.systemSettings.findFirst();

  const defaultTitle = 'House of Weddings — Wedding Vendor Directory';
  const defaultDescription = 'Discover and connect with premium wedding vendors. Photographers, florists, caterers, venues and more — curated for your perfect day.';

  return {
    title: {
      template: `%s | ${settings?.seoTitle || 'House of Weddings'}`,
      default: settings?.seoTitle || defaultTitle,
    },
    description: settings?.seoDescription || defaultDescription,
    keywords: ["wedding vendors", "wedding directory", "wedding photographers", "wedding venues", "wedding planning"],
    openGraph: {
      title: settings?.seoTitle || defaultTitle,
      description: settings?.seoDescription || defaultDescription,
      type: "website",
      locale: "en_IN",
    },
  };
}

/* ── Root Layout ─────────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols Outlined — used for arrow_outward in CategoryCard */}
        {/* react-doctor-disable-next-line nextjs-no-font-link, react-doctor/nextjs-no-font-link */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-body-md text-body-md bg-background text-on-background w-full m-0 p-0">
        <AuthProvider>
          {/* Global sticky navbar — renders on every page */}
          <Navbar authButton={<NavAuthButton />} isLoggedIn={!!session?.user} />
          {children}
          {/* Global footer — renders on every page */}
          <DynamicFooterWrapper>
            <Footer />
          </DynamicFooterWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
