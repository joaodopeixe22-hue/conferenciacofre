import { useState } from 'react';
import { Conference, ConferenceSummary } from '@/types/conference';
import { StatusBadge } from './StatusBadge';
import { DifferenceIndicator } from './DifferenceIndicator';
import { Button } from '@/components/ui/button';
import { Eye, Image, FileText, Trash2, Filter, Calendar } from 'lucide-react';
import { exportToImage, exportToPDF, exportHistoryToImage } from '@/utils/exportUtils';

interface HistoryTableProps {
  conferences: Conference[];
  onViewConference: (conferenceId: string) => void;
  onDeleteConference: (conferenceId: string) => void;
  calculateSummary: (conf: Conference) => ConferenceSummary;
}

export function HistoryTable({ 
  conferences, 
  onViewConference, 
  onDeleteConference,
  calculateSummary 
}: HistoryTableProps) {
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterResponsible, setFilterResponsible] = useState<string>('');

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
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
      <div className="bg-card rounded-lg border p-8 text-center card-shadow">
        <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhuma conferência registrada
        </h3>
        <p className="text-sm text-muted-foreground/70">
          Crie sua primeira conferência usando o formulário acima.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border card-shadow overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
          </div>
          
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-1.5 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
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
            className="px-3 py-1.5 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
          >
            <option value="">Todos os responsáveis</option>
            {uniqueResponsibles.map(resp => (
              <option key={resp} value={resp}>{resp}</option>
            ))}
          </select>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportHistoryToImage(filteredConferences, calculateSummary)}
              disabled={filteredConferences.length === 0}
            >
              <Image size={16} className="mr-2" />
              Exportar Histórico
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Turno</th>
              <th>Responsável</th>
              <th>Total Geral</th>
              <th>Segurança</th>
              <th>Diferença</th>
              <th>Status</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredConferences.map((conf) => {
              const summary = calculateSummary(conf);
              return (
                <tr key={conf.id} className="animate-fade-in">
                  <td className="font-medium">{formatDate(conf.date)}</td>
                  <td>{conf.shift}</td>
                  <td>{conf.responsible}</td>
                  <td className="font-mono font-semibold text-primary">
                    {formatCurrency(summary.totalGeneral)}
                  </td>
                  <td className="font-mono">
                    {formatCurrency(summary.securityValue)}
                  </td>
                  <td>
                    <DifferenceIndicator difference={summary.difference} size="sm" />
                  </td>
                  <td>
                    <StatusBadge status={conf.status} />
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewConference(conf.id)}
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportConference(conf, 'image')}
                        title="Exportar Relatório"
                      >
                        <Image size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportConference(conf, 'pdf')}
                        title="Exportar PDF"
                      >
                        <FileText size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteConference(conf.id)}
                        title="Excluir"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredConferences.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma conferência encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
