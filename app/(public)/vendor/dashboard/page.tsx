import { auth } from '@/auth';
import prisma from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CountdownTimer from '@/components/ui/CountdownTimer';

const getFullDateTime = (date: Date, timeStr: string) => {
  const d = new Date(date);
  if (!timeStr) return d;
  let hours = 0, minutes = 0;
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [time, modifier] = timeStr.split(' ');
    let [h, m] = time.split(':');
    if (h === '12') h = '0';
    if (modifier === 'PM') h = (parseInt(h, 10) + 12).toString();
    hours = parseInt(h, 10);
    minutes = parseInt(m, 10);
  } else {
    [hours, minutes] = timeStr.split(':').map(Number);
  }
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const formatTime12h = (timeStr: string) => {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minuteStr} ${ampm}`;
};

export default async function VendorDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
  if (!vendor) redirect('/profile');

  // Fetch dynamic metrics and upcoming appointments in parallel
  const [totalBookings, requestedCount, acceptedCount, rejectedCount, upcomingAppointments] = await Promise.all([
    prisma.appointment.count({ where: { vendorId: vendor.id } }),
    prisma.appointment.count({ where: { vendorId: vendor.id, status: 'PENDING' } }),
    prisma.appointment.count({ where: { vendorId: vendor.id, status: 'CONFIRMED' } }),
    prisma.appointment.count({ where: { vendorId: vendor.id, status: 'CANCELLED' } }),
    prisma.appointment.findMany({
      where: { 
        vendorId: vendor.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        // Ensure we only get future/today appointments (basic date filter)
        date: { gte: new Date(new Date().setHours(0,0,0,0)) }
      },
      include: { user: true },
      orderBy: { date: 'asc' },
      take: 3
    })
  ]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h1 className="font-headline-xl text-3xl font-bold text-primary mb-2">Welcome back, {vendor.name}</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Here is what is happening with your business today.</p>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Total Bookings */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">calendar_month</span>
          </div>
          <div>
            <p className="font-label-sm font-bold uppercase tracking-wider text-on-surface-variant text-[10px] md:text-xs">Total Bookings</p>
            <p className="font-headline-md font-bold text-on-surface">{totalBookings}</p>
          </div>
        </div>

        {/* Requested */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">pending_actions</span>
          </div>
          <div>
            <p className="font-label-sm font-bold uppercase tracking-wider text-on-surface-variant text-[10px] md:text-xs">Pending</p>
            <p className="font-headline-md font-bold text-on-surface">{requestedCount}</p>
          </div>
        </div>
        
        {/* Accepted */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#1E8E3E] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">check_circle</span>
          </div>
          <div>
            <p className="font-label-sm font-bold uppercase tracking-wider text-on-surface-variant text-[10px] md:text-xs">Accepted</p>
            <p className="font-headline-md font-bold text-on-surface">{acceptedCount}</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-error/10 flex items-center justify-center text-error flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">cancel</span>
          </div>
          <div>
            <p className="font-label-sm font-bold uppercase tracking-wider text-on-surface-variant text-[10px] md:text-xs">Rejected</p>
            <p className="font-headline-md font-bold text-on-surface">{rejectedCount}</p>
          </div>
        </div>

      </div>

      {/* Upcoming Appointments Feed */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-headline-sm font-bold text-on-surface">Upcoming Appointments</h2>
          <Link href="/vendor/appointments" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-on-surface-variant italic text-center py-4">You have no upcoming appointments right now.</p>
          ) : (
            upcomingAppointments.map((app, index) => (
              <div key={app.id} className="p-4 border border-outline-variant rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-lowest hover:border-primary/50 transition-colors">
                
                <div className="flex flex-col gap-2">
                  <p className="font-label-md font-bold text-on-surface">
                    {app.user?.fullName || app.user?.email}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant mt-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      {new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      {formatTime12h(app.time)}
                    </span>
                    
                    {/* Inject the Timer for the very first appointment in the list */}
                    {index === 0 && (
                      <CountdownTimer targetDate={getFullDateTime(app.date, app.time)} />
                    )}
                  </div>
                </div>

                <span className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded uppercase border self-start sm:self-auto flex-shrink-0 ${
                  app.status === 'CONFIRMED' ? 'bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]' : 
                  'bg-surface-variant text-on-surface-variant border-outline-variant'
                }`}>
                  {app.status}
                </span>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
