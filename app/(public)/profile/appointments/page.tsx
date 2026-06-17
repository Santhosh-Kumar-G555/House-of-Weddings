import { auth } from '@/auth';
import prisma from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import AppointmentsList from '@/components/modules/AppointmentsList';

export default async function UserAppointmentsPage() {
  const session = await auth();
  // Ensure only standard users can access this specific view
  if (!session?.user?.id || (session.user as any).role !== 'USER') redirect('/login');

  // Fetch appointments tied to this user and include the vendor data
  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: { vendor: true },
    orderBy: { date: 'asc' } // Show upcoming appointments first
  });

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h1 className="font-headline-xl text-3xl font-bold text-primary mb-2">My Appointments</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Manage your scheduled consultations with vendors.</p>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
        {/* Pass the data to the component as a USER */}
        <AppointmentsList initialAppointments={appointments} viewMode="USER" />
      </div>
    </div>
  );
}
