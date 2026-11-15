'use client';

import React from 'react';
import Image from 'next/image';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'full' | 'mark' | 'horizontal' | 'wordmark';
type LogoTheme = 'dark' | 'light';

interface JuriciousLogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
  size?: LogoSize;
  /** Preload the image (use only for above-the-fold logos like the navbar). */
  priority?: boolean;
}

type Dims = Readonly<{ width: number; height: number }>;

const DIMENSIONS: Record<LogoSize, Record<LogoVariant, Dims>> = {
  sm: {
    mark: { width: 36, height: 24 },
    horizontal: { width: 160, height: 24 },
    full: { width: 160, height: 34 },
    wordmark: { width: 160, height: 34 },
  },
  md: {
    mark: { width: 48, height: 32 },
    horizontal: { width: 200, height: 30 },
    full: { width: 240, height: 51 },
    wordmark: { width: 240, height: 51 },
  },
  lg: {
    mark: { width: 68, height: 45 },
    horizontal: { width: 250, height: 38 },
    full: { width: 290, height: 62 },
    wordmark: { width: 290, height: 62 },
  },
  xl: {
    mark: { width: 92, height: 61 },
    horizontal: { width: 320, height: 48 },
    full: { width: 380, height: 81 },
    wordmark: { width: 380, height: 81 },
  },
};

const ALT_TEXT: Record<LogoVariant, string> = {
  full: 'Juricious — Plan · Prepare · Prevail',
  mark: 'Juricious emblem',
  horizontal: 'Juricious — Practice management for Nepali advocates',
  wordmark: 'Juricious — Plan · Prepare · Prevail',
};

export function JuriciousLogo({
  variant = 'full',
  theme = 'dark',
  className = '',
  size = 'md',
  priority = false,
}: JuriciousLogoProps) {
  const isLight = theme === 'light';
  const dims = DIMENSIONS[size][variant];

  // Theme-aware sources. Wordmark has no light variant currently — reuse the
  // standard asset so the component doesn't break if a dark version is absent.
  const src: Record<LogoVariant, string> = {
    mark: isLight ? '/brand/logo-mark-dark.png' : '/brand/logo-mark.png',
    full: isLight ? '/brand/logo-full-dark.png' : '/brand/logo-full.png',
    horizontal: isLight
      ? '/brand/logo-horizontal-dark.png'
      : '/brand/logo-horizontal.png',
    wordmark: isLight
      ? '/brand/logo-wordmark.png' // TODO: provide /brand/logo-wordmark-dark.png
      : '/brand/logo-wordmark.png',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Image
        src={src[variant]}
        alt={ALT_TEXT[variant]}
        width={dims.width}
        height={dims.height}
        priority={priority}
        className="h-auto w-auto max-w-full object-contain"
        // Rely on Tailwind classes (w-auto + max-w-full) instead of an inline
        // width so the parent's max-w-* utilities can actually constrain it.
        style={{ width: 'auto', height: 'auto' }}
        sizes="(max-width: 640px) 210px, (max-width: 768px) 280px, 330px"
      />
    </div>
  );
}