'use client';

import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';

export default function BookingButton({ vendorId, vendorName }: { vendorId: string, vendorName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex-1 bg-primary text-on-primary font-label-md py-3 px-4 rounded hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap" type="button"
      >
        Book Appointment
      </button>

      <AppointmentModal 
        vendorId={vendorId} 
        vendorName={vendorName} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
