import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

interface DifferenceIndicatorProps {
  difference: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function DifferenceIndicator({ 
  difference, 
  size = 'md', 
  showIcon = true,
  className 
}: DifferenceIndicatorProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusConfig = () => {
    if (difference === 0) {
      return {
        bgClass: 'bg-success/10',
        textClass: 'text-success',
        borderClass: 'border-success/30',
        icon: CheckCircle2,
        label: 'Correto',
      };
    }
    if (difference > 0) {
      return {
        bgClass: 'bg-surplus/10',
        textClass: 'text-surplus',
        borderClass: 'border-surplus/30',
        icon: TrendingUp,
        label: 'Sobra',
      };
    }
    return {
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      borderClass: 'border-destructive/30',
      icon: TrendingDown,
      label: 'Falta',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border font-medium',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClasses[size],
        difference !== 0 && size === 'lg' && 'animate-pulse-success',
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{formatCurrency(difference)}</span>
      <span className="text-xs opacity-75">({config.label})</span>
    </div>
  );
}
