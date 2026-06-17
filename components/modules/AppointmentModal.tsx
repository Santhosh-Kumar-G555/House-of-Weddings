'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createAppointment } from '@/server/actions/appointments';
import { useRouter } from 'next/navigation';

type Props = {
  vendorId: string;
  vendorName: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AppointmentModal({ vendorId, vendorName, isOpen, onClose }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we only use the portal after the component has mounted on the client
  // react-doctor-disable-next-line rendering-hydration-no-flicker, react-doctor/rendering-hydration-no-flicker
  useEffect(() => {
    // react-doctor-disable-next-line no-initialize-state, react-doctor/no-initialize-state
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createAppointment({
      vendorId,
      date: new Date(formData.date),
      time: formData.time,
      message: formData.message
    });
    setIsLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      setIsSuccess(true);
      router.refresh();
    }
  };

  const handleClose = () => {
    setIsSuccess(false); // Reset state
    setFormData({ date: '', time: '', message: '' }); // Clear form
    onClose(); // Call the parent's close function
  };

  // Extract the modal UI into a variable
  const modalContent = (
    // Increased z-index to 9999 to guarantee it floats above everything
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      {/* Added min-w-[320px] to guarantee it never squishes again */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-md w-full min-w-[320px] relative animate-in fade-in zoom-in-95 shadow-lg">
        <button onClick={handleClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer" type="button">
          <span className="material-symbols-outlined">close</span>
        </button>

        {isSuccess ? (
          // --- SUCCESS STATE UI ---
          <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-success">check_circle</span>
            </div>
            <h2 className="font-headline-sm font-bold text-on-surface mb-2">Request Sent!</h2>
            <p className="font-body-md text-on-surface-variant mb-8">
              {vendorName} has received your appointment request and will get back to you shortly.
            </p>
            <button 
              onClick={handleClose} 
              className="w-full bg-surface-variant text-on-surface font-bold py-3 rounded hover:bg-outline-variant transition-colors cursor-pointer" type="button"
            >
              Done
            </button>
          </div>
        ) : (
          // --- ORIGINAL FORM UI ---
          <>
            <h2 className="font-headline-sm font-bold text-primary mb-2">Book Appointment</h2>
            <p className="font-body-sm text-on-surface-variant mb-6">Request a consultation with {vendorName}.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="am-date" className="font-label-sm font-bold uppercase tracking-wider">Date</label>
                <input id="am-date" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="p-3 border border-outline-variant rounded bg-transparent outline-none focus:border-primary w-full" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="am-time" className="font-label-sm font-bold uppercase tracking-wider">Time</label>
                <input 
                  id="am-time"
                  type="time" 
                  required 
                  value={formData.time} 
                  onChange={(e) => setFormData({...formData, time: e.target.value})} 
                  className="p-3 border border-outline-variant rounded bg-transparent outline-none focus:border-primary w-full" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="am-message" className="font-label-sm font-bold uppercase tracking-wider">Message (Optional)</label>
                <textarea 
                  id="am-message"
                  rows={3} 
                  placeholder="Tell them about your event..." 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="p-3 border border-outline-variant rounded bg-transparent outline-none focus:border-primary resize-none w-full"
                ></textarea>
              </div>

              <button type="submit" disabled={isLoading} className="mt-4 w-full bg-primary text-on-primary py-3 rounded font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer">
                {isLoading ? 'Sending Request...' : 'Send Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // Teleport the modal content to the document body
  return createPortal(modalContent, document.body);
}
