import { NextResponse } from 'next/server';
import prisma from '@/server/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7';

    let startDate = new Date(0); // For 'all'
    if (timeframe !== 'all') {
      const days = parseInt(timeframe, 10);
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    const whereClause = {
      createdAt: {
        gte: startDate,
      },
    };

    // Fetch data concurrently
    const [users, vendors, appointments, podcasts] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: { id: true, email: true, fullName: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.vendor.findMany({
        where: whereClause,
        select: { id: true, name: true, category: true, city: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.appointment.findMany({
        where: whereClause,
        select: { id: true, date: true, status: true, createdAt: true, user: { select: { fullName: true } }, vendor: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.podcast.findMany({
        where: whereClause,
        select: { id: true, title: true, category: true, host: true, guestName: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }),
    ]);

    // Flatten appointments for easier table usage
    const flatAppointments = appointments.map(a => ({
      id: a.id,
      date: new Date(a.date).toLocaleDateString(),
      status: a.status,
      userName: a.user?.fullName || 'Unknown',
      vendorName: a.vendor?.name || 'Unknown',
      createdAt: a.createdAt,
    }));

    return NextResponse.json({
      users,
      vendors,
      appointments: flatAppointments,
      podcasts,
    });
  } catch (error) {
    console.error('Error generating report data:', error);
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
  }
}
