import { useState } from 'react';
import { ShiftType } from '@/types/conference';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { getLocalDateString } from '@/utils/dateUtils';

interface NewConferenceFormProps {
  onCreateConference: (date: string, shift: ShiftType, responsible: string) => void;
}

const SHIFTS: ShiftType[] = ['Abertura', 'Intermediário', 'Fechamento'];

export function NewConferenceForm({ onCreateConference }: NewConferenceFormProps) {
  const { isMobileMode } = useViewMode();
  const [date, setDate] = useState(getLocalDateString());
  const [shift, setShift] = useState<ShiftType>('Abertura');
  const [responsible, setResponsible] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && shift && responsible.trim()) {
      onCreateConference(date, shift, responsible.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "bg-card rounded-lg border card-shadow animate-fade-in",
        isMobileMode ? "p-4" : "p-6"
      )}
    >
      <h2 className={cn(
        "font-semibold font-display text-foreground mb-4",
        isMobileMode ? "text-base" : "text-lg"
      )}>
        Nova Conferência
      </h2>
      
      <div className={cn(
        "gap-4 mb-4",
        isMobileMode ? "flex flex-col" : "grid grid-cols-1 md:grid-cols-3"
      )}>
        {/* Data */}
        <div>
          <label className={cn(
            "flex items-center gap-2 font-medium text-muted-foreground mb-2",
            isMobileMode ? "text-sm" : "text-sm"
          )}>
            <Calendar size={isMobileMode ? 14 : 16} />
            Data da Conferência
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(
              "w-full px-3 bg-background border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
              isMobileMode ? "h-12 text-base" : "py-2"
            )}
            required
          />
        </div>

        {/* Turno */}
        <div>
          <label className={cn(
            "flex items-center gap-2 font-medium text-muted-foreground mb-2",
            isMobileMode ? "text-sm" : "text-sm"
          )}>
            <Clock size={isMobileMode ? 14 : 16} />
            Turno
          </label>
          {isMobileMode ? (
            <div className="flex gap-2">
              {SHIFTS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShift(s)}
                  className={cn(
                    "flex-1 h-12 px-3 rounded-lg text-sm font-medium transition-all",
                    shift === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {s === 'Intermediário' ? 'Interm.' : s}
                </button>
              ))}
            </div>
          ) : (
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
              required
            >
              {SHIFTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>

        {/* Responsável */}
        <div>
          <label className={cn(
            "flex items-center gap-2 font-medium text-muted-foreground mb-2",
            isMobileMode ? "text-sm" : "text-sm"
          )}>
            <User size={isMobileMode ? 14 : 16} />
            Responsável
          </label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className={cn(
              "w-full px-3 bg-background border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
              isMobileMode ? "h-12 text-base" : "py-2"
            )}
            placeholder="Nome do responsável"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className={cn(
          isMobileMode ? "w-full h-12 text-base" : "w-full md:w-auto"
        )}
      >
        <Plus size={18} className="mr-2" />
        Iniciar Conferência
      </Button>
    </form>
  );
}
