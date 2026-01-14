import { Conference, ConferenceSummary } from '@/types/conference';
import { StatusBadge } from './StatusBadge';
import { SummaryCards } from './SummaryCards';
import { CountingTable } from './CountingTable';
import { ConferenceChecklist } from './ConferenceChecklist';
import { ChangeAlertBanner } from './ChangeAlertBanner';
import { MobileCountingCards } from './mobile/MobileCountingCards';
import { MobileSummaryCards } from './mobile/MobileSummaryCards';
import { MobileConferenceActions } from './mobile/MobileConferenceActions';
import { Button } from '@/components/ui/button';
import { exportToImage, exportToPDF } from '@/utils/exportUtils';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Image, 
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
  const { isMobileMode } = useViewMode();
  const isReadOnly = conference.status === 'Finalizada';

  const formatDate = (dateStr: string): string => {
    if (isMobileMode) {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
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

  const handleExport = async (type: 'image' | 'pdf') => {
    try {
      if (type === 'image') {
        await exportToImage(conference, summary);
      } else {
        exportToPDF(conference, summary);
      }
      toast({
        title: 'Arquivo exportado!',
        description: `A conferência foi exportada para ${type === 'image' ? 'JPEG' : 'PDF'}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: 'Ocorreu um erro ao gerar o arquivo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn(
      "animate-fade-in",
      isMobileMode ? "space-y-4 pb-24" : "space-y-6"
    )}>
      {/* Header */}
      <div className={cn(
        isMobileMode 
          ? "flex flex-col gap-3" 
          : "flex flex-col md:flex-row md:items-center justify-between gap-4"
      )}>
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className={cn(
              "mb-2",
              isMobileMode && "h-10 px-3"
            )}
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <h2 className={cn(
              "font-bold font-display text-foreground",
              isMobileMode ? "text-xl" : "text-2xl"
            )}>
              Conferência
            </h2>
            <StatusBadge status={conference.status} />
          </div>
        </div>

        {/* Desktop Actions */}
        {!isMobileMode && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('image')}>
              <Image size={16} className="mr-2" />
              Relatório
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
        )}
      </div>

      {/* Info Bar */}
      <div className={cn(
        "bg-card rounded-lg border card-shadow",
        isMobileMode ? "p-3" : "p-4"
      )}>
        <div className={cn(
          "flex items-center gap-4",
          isMobileMode ? "flex-col items-start gap-2" : "flex-wrap gap-6"
        )}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={isMobileMode ? 14 : 16} />
            <span className={cn(isMobileMode ? "text-xs" : "text-sm")}>{formatDate(conference.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={isMobileMode ? 14 : 16} />
            <span className={cn(isMobileMode ? "text-xs" : "text-sm")}>
              Turno: <span className="font-medium text-foreground">{conference.shift}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={isMobileMode ? 14 : 16} />
            <span className={cn(isMobileMode ? "text-xs" : "text-sm")}>
              <span className="font-medium text-foreground">{conference.responsible}</span>
            </span>
          </div>
          {isReadOnly && !isMobileMode && (
            <div className="flex items-center gap-2 text-muted-foreground ml-auto">
              <Lock size={16} />
              <span className="text-sm">Modo somente leitura</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {isMobileMode ? (
        <MobileSummaryCards
          summary={summary}
          securityValue={conference.securityValue}
          difference={conference.difference}
          onSecurityValueChange={onUpdateSecurityValue}
          onDifferenceChange={onUpdateDifference}
          isReadOnly={isReadOnly}
        />
      ) : (
        <div className="md:sticky md:top-[73px] md:z-40 md:bg-background md:py-4 md:-mx-4 md:px-4 md:border-b md:border-transparent md:transition-shadow">
          <SummaryCards
            summary={summary}
            securityValue={conference.securityValue}
            difference={conference.difference}
            onSecurityValueChange={onUpdateSecurityValue}
            onDifferenceChange={onUpdateDifference}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

      {/* Change Alert Banner */}
      {!isReadOnly && <ChangeAlertBanner items={conference.items} />}

      {/* Counting Table / Cards */}
      <div>
        <h3 className={cn(
          "font-semibold font-display text-foreground mb-3",
          isMobileMode ? "text-base" : "text-lg"
        )}>
          Contagem de Numerário
        </h3>
        {isMobileMode ? (
          <MobileCountingCards
            items={conference.items}
            onUpdateItem={onUpdateItem}
            isReadOnly={isReadOnly}
          />
        ) : (
          <CountingTable
            items={conference.items}
            onUpdateItem={onUpdateItem}
            isReadOnly={isReadOnly}
          />
        )}
      </div>

      {/* Checklist */}
      <ConferenceChecklist
        conferenceId={conference.id}
        isReadOnly={isReadOnly}
      />

      {/* Mobile Fixed Actions */}
      {isMobileMode && (
        <MobileConferenceActions
          isReadOnly={isReadOnly}
          onFinalize={handleFinalize}
          onExportImage={() => handleExport('image')}
          onExportPDF={() => handleExport('pdf')}
        />
      )}
    </div>
  );
}
