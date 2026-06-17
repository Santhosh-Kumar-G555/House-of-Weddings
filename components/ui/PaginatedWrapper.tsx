'use client';

import React, { useState } from 'react';
import PaginationControls from './PaginationControls';

type Props = {
  children: React.ReactNode;
  itemsPerPage?: number;
};

export default function PaginatedWrapper({ children, itemsPerPage = 6 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const childrenArray = React.Children.toArray(children);
  const totalPages = Math.ceil(childrenArray.length / itemsPerPage);
  const paginatedChildren = childrenArray.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6">
        {paginatedChildren}
      </div>
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}
