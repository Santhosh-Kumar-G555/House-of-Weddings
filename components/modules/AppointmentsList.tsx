
'use client';

import React, { useState, useEffect } from 'react';
import { updateAppointmentStatus, rescheduleAppointment } from '@/server/actions/appointments';
import { useRouter } from 'next/navigation';
import PaginationControls from '../ui/PaginationControls';

// Converts "15:46" to "03:46 PM"
const formatTime12h = (timeStr: string) => {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr; // Already formatted
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minuteStr} ${ampm}`;
};

// Combines date and time into a comparable Date object
const getFullDateTime = (date: Date | string, timeStr: string) => {
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

// react-doctor-disable-next-line prefer-useReducer, react-doctor/prefer-useReducer
export default function AppointmentsList({ initialAppointments, viewMode }: { initialAppointments: any[], viewMode: 'VENDOR' | 'USER' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2x3 Grid layout configuration

  const handleTabChange = (tab: 'upcoming' | 'history') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusChange = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    await updateAppointmentStatus(id, status);
    router.refresh();
  };

  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });

  const handleRescheduleSubmit = async (id: string) => {
    if (!rescheduleForm.date || !rescheduleForm.time) return alert('Please select a valid date and time.');

    await rescheduleAppointment(id, new Date(rescheduleForm.date), rescheduleForm.time);

    setReschedulingId(null); // Close the inline form
    setRescheduleForm({ date: '', time: '' }); // Reset data
    router.refresh();
  };

  const now = new Date();

  // Process all appointments: attach full Date object and check expiration
  const processed = (initialAppointments || []).map(app => {
    const fullDateTime = getFullDateTime(app.date, app.time);
    const isExpired = fullDateTime < now;
    return { ...app, fullDateTime, isExpired };
  });

  // Upcoming: Future dates AND not cancelled. Sorted closest first.
  const upcoming = processed
    .filter(app => !app.isExpired && app.status !== 'CANCELLED')
    .sort((a, b) => a.fullDateTime.getTime() - b.fullDateTime.getTime());

  // History: Past dates OR cancelled. Sorted newest first.
  const history = processed
    .filter(app => app.isExpired || app.status === 'CANCELLED')
    .sort((a, b) => b.fullDateTime.getTime() - a.fullDateTime.getTime());

  const displayData = activeTab === 'upcoming' ? upcoming : history;
  const nearestApp = upcoming.length > 0 ? upcoming[0] : null;

  // Live Countdown Timer logic
  useEffect(() => {
    if (!nearestApp) return;

    const interval = setInterval(() => {
      const distance = nearestApp.fullDateTime.getTime() - new Date().getTime();

      if (distance < 0) {
        setTimeLeft('Starting now');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nearestApp]);

  if (!initialAppointments || initialAppointments.length === 0) {
    return <p className="text-on-surface-variant italic">No appointments found.</p>;
  }

  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisplayData = displayData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      {/* Shared Tabs */}
      <div className="flex gap-6 border-b border-outline-variant mb-6">
        <button 
          onClick={() => handleTabChange('upcoming')} 
          className={`pb-3 font-bold text-sm transition-colors cursor-pointer ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`} type="button"
        >
          Upcoming ({upcoming.length})
        </button>
        <button 
          onClick={() => handleTabChange('history')} 
          className={`pb-3 font-bold text-sm transition-colors cursor-pointer ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`} type="button"
        >
          History ({history.length})
        </button>
      </div>

      {/* Shared Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {paginatedDisplayData.map((app) => (
          <div key={app.id} className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest flex flex-col">
            
            {/* Header: Dynamic Identity based on Role */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface">
                  {viewMode === 'USER' ? app.vendor?.name : (app.user?.fullName || app.user?.email)}
                </h3>
                <p className="flex items-center gap-1 text-sm text-on-surface-variant mt-1">
                  {viewMode === 'USER' ? (
                    <>
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {app.vendor?.city || 'Location TBD'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Client Consultation
                    </>
                  )}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {app.id === nearestApp?.id && timeLeft && (
                  <span className="px-2 py-1 text-[10px] font-bold tracking-wider rounded uppercase border bg-primary/10 text-primary border-primary/20 flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    In {timeLeft}
                  </span>
                )}
                <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded uppercase border ${
                  app.status === 'CONFIRMED' && !app.isExpired ? 'bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]' : 
                  app.status === 'CANCELLED' ? 'bg-error/10 text-error border-error/20' : 
                  app.isExpired ? 'bg-surface-variant text-on-surface-variant border-outline-variant' :
                  'bg-surface-variant text-on-surface-variant border-outline-variant' // Default Pending
                }`}>
                  {app.isExpired && app.status !== 'CANCELLED' ? 'EXPIRED' : app.status}
                </span>
              </div>
            </div>

            {/* Date & Time Box */}
            <div className="border border-outline-variant rounded p-4 mb-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">calendar_month</span>
                {new Date(app.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">schedule</span>
                {formatTime12h(app.time)}
              </div>
            </div>

            {/* Message */}
            {app.message && (
              <div className="mb-6 flex-1">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-1">
                  {viewMode === 'USER' ? 'Your Message:' : "Client's Message:"}
                </p>
                <p className="text-sm italic text-on-surface-variant">"{app.message}"</p>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-3">
              
              {/* If this specific card is in "Reschedule Mode", show the inline form */}
              {reschedulingId === app.id ? (
                <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95">
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      required
                      value={rescheduleForm.date} 
                      onChange={e => setRescheduleForm({...rescheduleForm, date: e.target.value})} 
                      className="p-2 border border-outline-variant rounded bg-transparent text-sm w-full outline-none focus:border-primary" 
                      aria-label="Reschedule Date"
                    />
                    <input 
                      type="time" 
                      required
                      value={rescheduleForm.time} 
                      onChange={e => setRescheduleForm({...rescheduleForm, time: e.target.value})} 
                      className="p-2 border border-outline-variant rounded bg-transparent text-sm w-full outline-none focus:border-primary" 
                      aria-label="Reschedule Time"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setReschedulingId(null)} 
                      className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-variant rounded transition-colors" type="button"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleRescheduleSubmit(app.id)} 
                      className="flex-1 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors" type="submit"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              ) : (
                /* Otherwise, show standard action buttons */
                <div className="flex gap-4 items-center">
                  
                  {/* Standard User Actions */}
                  {viewMode === 'USER' && !app.isExpired && app.status !== 'CANCELLED' && (
                    <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="text-error text-sm font-bold hover:underline" type="button">
                      Cancel Appointment
                    </button>
                  )}

                  {/* Universal Reschedule Button for BOTH Roles */}
                  <button 
                    onClick={() => {
                      setReschedulingId(app.id);
                      // Pre-fill the form with the appointment's current date and time
                      setRescheduleForm({ 
                        date: new Date(app.date).toISOString().split('T')[0], 
                        time: app.time 
                      });
                    }} 
                    className="text-primary text-sm font-bold hover:underline flex items-center gap-1 ml-auto" type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">update</span>
                    Reschedule
                  </button>

                  {/* Standard Vendor Actions */}
                  {viewMode === 'VENDOR' && app.status === 'PENDING' && !app.isExpired && (
                    <>
                      <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="flex-1 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors" type="button">Confirm</button>
                      <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="flex-1 py-2 text-sm font-bold text-error bg-error/10 hover:bg-error/20 rounded transition-colors" type="button">Decline</button>
                    </>
                  )}
                  {viewMode === 'VENDOR' && app.status === 'CONFIRMED' && !app.isExpired && (
                    <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="text-error text-sm font-bold hover:underline" type="button">
                      Cancel Appointment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {displayData.length === 0 && (
          <p className="text-on-surface-variant italic col-span-full">No appointments in this tab.</p>
        )}
      </div>

      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
    </div>
  );
}
