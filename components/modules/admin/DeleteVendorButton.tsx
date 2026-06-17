'use client';

import React from 'react';
import ConfirmSubmitButton from '@/components/modules/admin/ConfirmSubmitButton';

export function DeleteVendorButton({ vendorName, action }: { vendorName: string, action: () => void }) {
  return (
    <ConfirmSubmitButton 
      className="text-error text-sm font-bold hover:underline"
      message={`Are you sure you want to delete ${vendorName}? This will remove them from the public directory.`}
      formAction={action}
    >
      Delete
    </ConfirmSubmitButton>
  );
}
