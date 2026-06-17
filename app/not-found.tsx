import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-surface w-screen h-screen flex items-center justify-center p-4">
      <div className="block w-full min-w-[320px] sm:min-w-[450px] max-w-lg mx-auto text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary whitespace-nowrap">404</h1>
        <h2 className="text-2xl font-bold text-on-surface whitespace-nowrap">Page Not Found</h2>
        <p className="block text-on-surface-variant text-base leading-relaxed break-normal">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        <Link href="/" className="inline-block bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
