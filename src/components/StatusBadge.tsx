import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Em andamento' | 'Finalizada';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'Em andamento'
          ? 'bg-surplus/10 text-surplus border border-surplus/30'
          : 'bg-success/10 text-success border border-success/30',
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'Em andamento' ? 'bg-surplus animate-pulse' : 'bg-success'
        )}
      />
      {status}
    </span>
  );
}
