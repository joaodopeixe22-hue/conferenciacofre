import { useState } from 'react';
import { Conference, ShiftType } from '@/types/conference';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Plus } from 'lucide-react';

interface NewConferenceFormProps {
  onCreateConference: (date: string, shift: ShiftType, responsible: string) => void;
}

const SHIFTS: ShiftType[] = ['Abertura', 'Intermediário', 'Fechamento'];

export function NewConferenceForm({ onCreateConference }: NewConferenceFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<ShiftType>('Abertura');
  const [responsible, setResponsible] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && shift && responsible.trim()) {
      onCreateConference(date, shift, responsible.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 card-shadow animate-fade-in">
      <h2 className="text-lg font-semibold font-display text-foreground mb-4">
        Nova Conferência
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Data */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Calendar size={16} />
            Data da Conferência
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        {/* Turno */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Clock size={16} />
            Turno
          </label>
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
        </div>

        {/* Responsável */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <User size={16} />
            Responsável
          </label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Nome do responsável"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        <Plus size={18} className="mr-2" />
        Iniciar Conferência
      </Button>
    </form>
  );
}
