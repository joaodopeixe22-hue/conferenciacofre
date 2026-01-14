import { Smartphone, Monitor } from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';

export function ViewModeSwitcher() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <button
        onClick={() => setViewMode('mobile')}
        className={cn(
          'p-2 rounded-md transition-all duration-200',
          viewMode === 'mobile'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
        )}
        title="Modo Mobile"
        aria-label="Ativar modo mobile"
      >
        <Smartphone size={18} />
      </button>
      <button
        onClick={() => setViewMode('desktop')}
        className={cn(
          'p-2 rounded-md transition-all duration-200',
          viewMode === 'desktop'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
        )}
        title="Modo Desktop"
        aria-label="Ativar modo desktop"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}
