import { auth } from '@/auth';
import prisma from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import AppointmentsList from '@/components/modules/AppointmentsList';

export default async function VendorAppointmentsPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
  if (!vendor) redirect('/profile');

  // Fetch appointments and INCLUDE the user details
  const appointments = await prisma.appointment.findMany({
    where: { vendorId: vendor.id },
    include: { user: true },
    orderBy: { date: 'asc' }
  });

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h1 className="font-headline-xl text-3xl font-bold text-primary mb-2">Appointments</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Manage your client consultations and bookings.</p>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
        <AppointmentsList initialAppointments={appointments} viewMode="VENDOR" />
      </div>
    </div>
  );
}
