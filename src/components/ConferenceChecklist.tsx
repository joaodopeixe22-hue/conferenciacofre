import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';
import { ClipboardCheck } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ConferenceChecklistProps {
  conferenceId: string;
  isReadOnly: boolean;
}

const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'checked'>[] = [
  { id: 'entregas', label: 'Entregas' },
  { id: 'divergencias', label: 'Divergências' },
  { id: 'pdv-abastecido', label: 'PDV abastecido' },
];

export const ConferenceChecklist = ({ conferenceId, isReadOnly }: ConferenceChecklistProps) => {
  const { isMobileMode } = useViewMode();
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const stored = localStorage.getItem(`checklist-${conferenceId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_CHECKLIST.map(item => ({ ...item, checked: false }));
  });

  useEffect(() => {
    localStorage.setItem(`checklist-${conferenceId}`, JSON.stringify(checklist));
  }, [checklist, conferenceId]);

  const handleToggle = (id: string) => {
    if (isReadOnly) return;
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className={cn(
      "bg-card rounded-lg border",
      isMobileMode ? "p-4" : "p-4"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck size={isMobileMode ? 16 : 18} className="text-primary" />
        <h3 className={cn(
          "font-semibold text-foreground",
          isMobileMode ? "text-sm" : "text-base"
        )}>
          Checklist de Conferência
        </h3>
      </div>
      <div className={cn(
        isMobileMode ? "space-y-4" : "space-y-3"
      )}>
        {checklist.map(item => (
          <div 
            key={item.id} 
            className={cn(
              "flex items-center",
              isMobileMode ? "gap-4 p-3 bg-muted/30 rounded-lg" : "gap-3"
            )}
            onClick={() => isMobileMode && handleToggle(item.id)}
          >
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={() => handleToggle(item.id)}
              disabled={isReadOnly}
              className={cn(
                isMobileMode && "h-6 w-6"
              )}
            />
            <Label
              htmlFor={item.id}
              className={cn(
                "cursor-pointer flex-1",
                item.checked ? 'line-through text-muted-foreground' : 'text-foreground',
                isMobileMode && "text-base"
              )}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
