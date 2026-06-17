'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmSubmitButton({ 
  message, 
  className, 
  children,
  formAction
}: { 
  message: string, 
  className?: string, 
  children: React.ReactNode,
  formAction?: any
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // react-doctor-disable-next-line rendering-hydration-no-flicker, react-doctor/rendering-hydration-no-flicker
  useEffect(() => {
    // react-doctor-disable-next-line no-initialize-state, react-doctor/no-initialize-state
    setMounted(true);
  }, []);

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white max-w-sm w-full min-w-[320px] shrink-0 rounded-2xl shadow-xl overflow-hidden border border-outline-variant/30"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-error text-2xl">warning</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">Confirm Action</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <div className="bg-surface-variant/30 px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant/50">
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <form 
            action={async (formData) => {
              if (formAction) {
                await formAction(formData);
              }
              setIsOpen(false);
            }} 
            className="m-0 p-0"
          >
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-bold bg-error text-white hover:bg-error/90 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              Yes, Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={className}
      >
        {children}
      </button>
      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
