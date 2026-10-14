import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={twMerge(
        'rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-lg shadow-slate-950/20',
        className
      )}
      {...props}
    />
  );
}
