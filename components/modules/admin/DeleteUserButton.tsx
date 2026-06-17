'use client';

import React from 'react';
import ConfirmSubmitButton from '@/components/modules/admin/ConfirmSubmitButton';

export function DeleteUserButton({ userName, action }: { userName: string, action: () => void }) {
  return (
    <ConfirmSubmitButton 
      className="text-error text-sm font-bold hover:underline"
      message={`Are you sure you want to delete ${userName}? This cannot be undone.`}
      formAction={action}
    >
      Delete
    </ConfirmSubmitButton>
  );
}
