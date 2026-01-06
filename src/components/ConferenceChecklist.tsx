import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Checklist de Conferência</h3>
      </div>
      <div className="space-y-3">
        {checklist.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={() => handleToggle(item.id)}
              disabled={isReadOnly}
            />
            <Label
              htmlFor={item.id}
              className={`cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
