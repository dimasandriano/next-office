import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // status
        PROCESS: 'bg-purple-500 text-white hover:bg-purple-500/80',
        ON_REVIEW: 'bg-red-500 text-white hover:bg-red-500/80',
        ARRIVED: 'bg-blue-500 text-white hover:bg-blue-500/80',
        DONE: 'bg-green-500 text-white hover:bg-green-500/80',
        ARCHIVED: 'bg-yellow-500 text-white hover:bg-yellow-500/80',
        // sifat
        penting: 'bg-red-500 text-white hover:bg-red-500/80 uppercase',
        segera: 'bg-orange-500 text-white hover:bg-orange-500/80 uppercase',
        biasa: 'bg-blue-500 text-white hover:bg-blue-500/80 uppercase',
        rahasia: 'bg-green-500 text-white hover:bg-green-500/80 uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
