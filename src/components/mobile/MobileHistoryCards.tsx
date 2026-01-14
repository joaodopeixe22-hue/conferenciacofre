import { Conference, ConferenceSummary } from '@/types/conference';
import { StatusBadge } from '../StatusBadge';
import { DifferenceIndicator } from '../DifferenceIndicator';
import { Button } from '@/components/ui/button';
import { Eye, Image, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { exportToImage, exportToPDF } from '@/utils/exportUtils';
import { useState } from 'react';

interface MobileHistoryCardsProps {
  conferences: Conference[];
  onViewConference: (conferenceId: string) => void;
  onDeleteConference: (conferenceId: string) => void;
  calculateSummary: (conf: Conference) => ConferenceSummary;
}

export function MobileHistoryCards({ 
  conferences, 
  onViewConference, 
  onDeleteConference,
  calculateSummary 
}: MobileHistoryCardsProps) {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterResponsible, setFilterResponsible] = useState<string>('');

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const uniqueResponsibles = [...new Set(conferences.map(c => c.responsible))];
  const uniqueMonths = [...new Set(conferences.map(c => {
    const date = new Date(c.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  const filteredConferences = conferences.filter(conf => {
    const confMonth = new Date(conf.date);
    const monthStr = `${confMonth.getFullYear()}-${String(confMonth.getMonth() + 1).padStart(2, '0')}`;
    
    if (filterMonth && monthStr !== filterMonth) return false;
    if (filterResponsible && conf.responsible !== filterResponsible) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExportConference = async (conf: Conference, type: 'image' | 'pdf') => {
    const summary = calculateSummary(conf);
    if (type === 'image') {
      await exportToImage(conf, summary);
    } else {
      exportToPDF(conf, summary);
    }
  };

  if (conferences.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-8 text-center">
        <p className="text-muted-foreground">Nenhuma conferência registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Collapsible Filters */}
      <button
        onClick={() => setExpandedFilters(!expandedFilters)}
        className="w-full flex items-center justify-between p-3 bg-card rounded-xl border"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Filtros {(filterMonth || filterResponsible) && '(ativos)'}
        </span>
        {expandedFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expandedFilters && (
        <div className="bg-card rounded-xl border p-4 space-y-3 animate-fade-in">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
          >
            <option value="">Todos os meses</option>
            {uniqueMonths.map(month => {
              const [year, m] = month.split('-');
              const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
              return (
                <option key={month} value={month}>
                  {monthNames[parseInt(m) - 1]} {year}
                </option>
              );
            })}
          </select>

          <select
            value={filterResponsible}
            onChange={(e) => setFilterResponsible(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
          >
            <option value="">Todos os responsáveis</option>
            {uniqueResponsibles.map(resp => (
              <option key={resp} value={resp}>{resp}</option>
            ))}
          </select>

          {(filterMonth || filterResponsible) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterMonth('');
                setFilterResponsible('');
              }}
              className="w-full"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Conference Cards */}
      {filteredConferences.map((conf) => {
        const summary = calculateSummary(conf);
        return (
          <div 
            key={conf.id}
            className="bg-card rounded-xl border p-4 animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{formatDate(conf.date)}</p>
                <p className="text-sm text-muted-foreground">{conf.shift} • {conf.responsible}</p>
              </div>
              <StatusBadge status={conf.status} />
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-mono font-bold text-primary">
                  {formatCurrency(summary.totalGeneral)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Diferença</p>
                <DifferenceIndicator difference={summary.difference} size="sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewConference(conf.id)}
                className="flex-1 h-11"
              >
                <Eye size={16} className="mr-2" />
                Ver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportConference(conf, 'image')}
                className="h-11 px-3"
              >
                <Image size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportConference(conf, 'pdf')}
                className="h-11 px-3"
              >
                <FileText size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteConference(conf.id)}
                className="h-11 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        );
      })}

      {filteredConferences.length === 0 && (
        <div className="bg-card rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">Nenhuma conferência encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
