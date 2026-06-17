'use client';

import React from 'react';
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export default function FallbackImage({ src, alt, className, fallbackSrc }: Props) {
  return (
    <Image 
      src={src || fallbackSrc || 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image'} 
      alt={alt} 
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={(e) => {
        e.currentTarget.onerror = null; 
        e.currentTarget.src = fallbackSrc || 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image';
      }} fill
    />
  );
}
