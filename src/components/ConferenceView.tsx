import { Conference, ConferenceSummary } from '@/types/conference';
import { StatusBadge } from './StatusBadge';
import { SummaryCards } from './SummaryCards';
import { CountingTable } from './CountingTable';
import { ConferenceChecklist } from './ConferenceChecklist';
import { Button } from '@/components/ui/button';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { 
  CheckCircle2, 
  ArrowLeft, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Clock, 
  User,
  Lock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConferenceViewProps {
  conference: Conference;
  summary: ConferenceSummary;
  onUpdateItem: (itemId: string, updates: Partial<import('@/types/conference').ConferenceItem>) => void;
  onUpdateSecurityValue: (value: number) => void;
  onUpdateDifference: (value: number) => void;
  onFinalize: () => void;
  onBack: () => void;
}

export function ConferenceView({
  conference,
  summary,
  onUpdateItem,
  onUpdateSecurityValue,
  onUpdateDifference,
  onFinalize,
  onBack,
}: ConferenceViewProps) {
  const isReadOnly = conference.status === 'Finalizada';

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFinalize = () => {
    if (summary.securityValue === 0) {
      toast({
        title: 'Segurança obrigatória',
        description: 'Por favor, informe o valor de segurança antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }

    onFinalize();
    toast({
      title: 'Conferência finalizada!',
      description: 'A conferência foi salva e não pode mais ser editada.',
    });
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      exportToExcel(conference, summary);
    } else {
      exportToPDF(conference, summary);
    }
    toast({
      title: 'Arquivo exportado!',
      description: `A conferência foi exportada para ${type.toUpperCase()}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-display text-foreground">
              Conferência de Cofre
            </h2>
            <StatusBadge status={conference.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <FileSpreadsheet size={16} className="mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText size={16} className="mr-2" />
            PDF
          </Button>
          {!isReadOnly && (
            <Button onClick={handleFinalize}>
              <CheckCircle2 size={16} className="mr-2" />
              Finalizar
            </Button>
          )}
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-sm">{formatDate(conference.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} />
            <span className="text-sm">Turno: <span className="font-medium text-foreground">{conference.shift}</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} />
            <span className="text-sm">Responsável: <span className="font-medium text-foreground">{conference.responsible}</span></span>
          </div>
          {isReadOnly && (
            <div className="flex items-center gap-2 text-muted-foreground ml-auto">
              <Lock size={16} />
              <span className="text-sm">Modo somente leitura</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        summary={summary}
        securityValue={conference.securityValue}
        difference={conference.difference}
        onSecurityValueChange={onUpdateSecurityValue}
        onDifferenceChange={onUpdateDifference}
        isReadOnly={isReadOnly}
      />

      {/* Counting Table */}
      <div>
        <h3 className="text-lg font-semibold font-display text-foreground mb-3">
          Contagem de Numerário
        </h3>
        <CountingTable
          items={conference.items}
          onUpdateItem={onUpdateItem}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* Checklist */}
      <ConferenceChecklist
        conferenceId={conference.id}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
