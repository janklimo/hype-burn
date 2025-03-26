import * as React from 'react';

import { cn } from '@/lib/utils';

type SkeletonProps = React.ComponentPropsWithoutRef<'div'> & {
  message?: string;
};

export default function ChartSkeleton({
  className,
  message,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'w-full h-full relative flex items-center justify-center',
        className,
      )}
      {...rest}
    >
      <div className='absolute inset-0 animate-pulse'>
        <div className='bg-white/10 w-full h-full' />
        <div className='absolute inset-0 border border-hl-primary' />
      </div>
      {message && (
        <p className='font-semibold text-gray-300 text-sm'>{message}</p>
      )}
    </div>
  );
}
