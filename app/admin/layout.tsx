import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // 1. If not logged in at all, redirect to login
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/dashboard');
  }

  const role = (session.user as any).role;

  // 2. SECURITY THROUGH OBSCURITY: 
  // If a User or Vendor tries to access /admin, pretend it doesn't exist
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    notFound(); 
  }

  return (
    <div className="flex bg-surface-variant/30 min-h-screen">
      <AdminSidebar role={role} />
      <div className="flex-1 flex flex-col w-full overflow-x-hidden md:ml-64">
        <main className="flex-1 w-full p-8 block">
          {children}
        </main>
      </div>
    </div>
  );
}
