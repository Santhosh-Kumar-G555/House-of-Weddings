'use client';

import React, { useRef, useState, useEffect } from 'react';
import { addEvent, deleteEvent } from '@/server/actions/events';

type UserEvent = {
  id: string;
  name: string;
  date: Date;
  time: string | null;
  venue: string;
};

const formatTime12Hour = (timeStr: string | null) => {
  if (!timeStr) return '';
  const [hours24, minutes] = timeStr.split(':');
  let hours = parseInt(hours24, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const calculateDaysLeft = (eventDate: Date) => {
  const diffTime = new Date(eventDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'PAST';
  if (diffDays === 0) return 'TODAY';
  return `${diffDays} DAYS LEFT`;
};

export default function EventPlanner({ events }: { events: UserEvent[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState<number | null>(null);



  const handleAddEvent = async (formData: FormData) => {
    setLoading(true);
    setError('');
    
    const res = await addEvent(formData);
    if (res.error) {
      setError(res.error);
    } else {
      formRef.current?.reset();
    }
    setLoading(false);
  };

  useEffect(() => {
    // react-doctor-disable-next-line no-initialize-state, react-doctor/no-initialize-state
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nearestCountdown = React.useMemo(() => {
    if (!now) return null; // Avoid hydration mismatch on server
    const getNearestEvent = () => {
      const futureEvents = events.filter(e => {
        const eventDate = new Date(e.date);
        if (e.time) {
          const [h, m] = e.time.split(':');
          eventDate.setHours(parseInt(h, 10), parseInt(m, 10), 0);
        } else {
          eventDate.setHours(23, 59, 59);
        }
        return eventDate.getTime() > now;
      });

      if (futureEvents.length === 0) return null;
      futureEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return futureEvents[0];
    };

    const nearest = getNearestEvent();
    if (!nearest) return null;

    const targetDate = new Date(nearest.date);
    if (nearest.time) {
      const [h, m] = nearest.time.split(':');
      targetDate.setHours(parseInt(h, 10), parseInt(m, 10), 0);
    } else {
      targetDate.setHours(23, 59, 59);
    }

    const distance = targetDate.getTime() - now;
    if (distance < 0) return null;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      eventName: nearest.name,
      timer: `${days}d ${hours}h ${minutes}m ${seconds}s`
    };
  }, [events, now]);



  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
      <div className="p-8 border-b border-outline-variant">
        <h2 className="font-headline-md text-xl font-bold text-primary mb-2">Event Planner</h2>
        <p className="font-body-sm text-on-surface-variant">Add your upcoming events (Haldi, Mehendi, Wedding) to track timelines and vendor assignments.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-outline-variant">
        
        {/* Form Section */}
        <div className="p-8 xl:col-span-1 bg-surface-bright">
          <form ref={formRef} action={handleAddEvent} className="space-y-4">
            {error && <div className="text-error font-label-sm mb-2">{error}</div>}
            <div>
              <label htmlFor="ep-name" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Event Name *</label>
              <input id="ep-name" type="text" name="name" required placeholder="e.g. Haldi / Mehendi" className="w-full border border-outline-variant rounded p-2.5 bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ep-date" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date *</label>
                <input id="ep-date" type="date" name="date" required className="w-full border border-outline-variant rounded p-2.5 bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="ep-time" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Time</label>
                <input id="ep-time" type="time" name="time" className="w-full border border-outline-variant rounded p-2.5 bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label htmlFor="ep-venue" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Venue *</label>
              <input id="ep-venue" type="text" name="venue" required placeholder="Enter Location" className="w-full border border-outline-variant rounded p-2.5 bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary" />
            </div>
            <button disabled={loading} className="w-full bg-primary text-on-primary font-label-md py-3 rounded hover:opacity-90 transition-opacity mt-4 cursor-pointer disabled:opacity-50" type="button">
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </form>
        </div>

        {/* Ledger Section */}
        <div className="p-0 xl:col-span-2 overflow-x-auto">
          {nearestCountdown && (
            <div className="bg-primary text-on-primary p-5 flex justify-between items-center px-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined animate-pulse text-[24px]">timer</span>
                <span className="font-label-md uppercase tracking-widest font-semibold text-on-primary/90">
                  Next Upcoming: <span className="text-on-primary font-bold">{nearestCountdown.eventName}</span>
                </span>
              </div>
              <span className="font-headline-md font-bold tabular-nums tracking-tight bg-on-primary/10 px-4 py-1.5 rounded">
                {nearestCountdown.timer}
              </span>
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Event Name</th>
                <th className="p-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Date & Time</th>
                <th className="p-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Venue</th>
                <th className="p-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-on-surface-variant font-body-sm">
                    No events added yet. Start by filling the form!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-bright transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="font-label-md text-primary">{event.name}</span>
                        {calculateDaysLeft(event.date) !== 'PAST' && (
                          <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                            {calculateDaysLeft(event.date)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {event.time && `, ${formatTime12Hour(event.time)}`}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{event.venue}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-error hover:text-error/80 font-label-sm uppercase tracking-wider cursor-pointer" type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
