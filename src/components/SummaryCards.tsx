import { ConferenceSummary } from '@/types/conference';
import { DifferenceIndicator } from './DifferenceIndicator';
import { Coins, Banknote, Wallet, Shield } from 'lucide-react';

interface SummaryCardsProps {
  summary: ConferenceSummary;
  securityValue: number;
  difference: number;
  onSecurityValueChange: (value: number) => void;
  onDifferenceChange: (value: number) => void;
  isReadOnly: boolean;
}

export function SummaryCards({ 
  summary, 
  securityValue, 
  difference,
  onSecurityValueChange,
  onDifferenceChange,
  isReadOnly 
}: SummaryCardsProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total em Moedas */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Coins size={18} />
          <span className="text-sm font-medium">Total em Moedas</span>
        </div>
        <p className="text-2xl font-bold font-body text-foreground">
          {formatCurrency(summary.totalCoins)}
        </p>
      </div>

      {/* Total em Notas */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Banknote size={18} />
          <span className="text-sm font-medium">Total em Notas</span>
        </div>
        <p className="text-2xl font-bold font-body text-foreground">
          {formatCurrency(summary.totalBills)}
        </p>
      </div>

      {/* Total Geral */}
      <div className="bg-card rounded-lg border p-4 card-shadow border-primary/20">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Wallet size={18} />
          <span className="text-sm font-medium">Total Geral do Cofre</span>
        </div>
        <p className="text-2xl font-bold font-body text-primary">
          {formatCurrency(summary.totalGeneral)}
        </p>
      </div>

      {/* Segurança (antigo Valor Esperado) */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Shield size={18} />
          <span className="text-sm font-medium">Segurança</span>
        </div>
        {isReadOnly ? (
          <p className="text-2xl font-bold font-body text-foreground">
            {formatCurrency(securityValue)}
          </p>
        ) : (
          <input
            type="number"
            step="0.01"
            min="0"
            value={securityValue || ''}
            onChange={(e) => onSecurityValueChange(parseFloat(e.target.value) || 0)}
            className="w-full text-2xl font-bold font-body bg-transparent border-b border-dashed border-muted-foreground/30 focus:border-primary focus:outline-none text-foreground"
            placeholder="0,00"
          />
        )}
      </div>

      {/* Diferença (agora manual) */}
      <div className={`bg-card rounded-lg border p-4 card-shadow ${
        difference === 0 ? 'border-success/50 bg-success/5' : 
        difference > 0 ? 'border-info/50 bg-info/5' : 
        difference < 0 ? 'border-destructive/50 bg-destructive/5' : ''
      }`}>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <span className="text-sm font-medium">Diferença</span>
          {difference !== 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              difference > 0 ? 'bg-info/20 text-info' : 'bg-destructive/20 text-destructive'
            }`}>
              {difference > 0 ? 'Sobra' : 'Falta'}
            </span>
          )}
          {difference === 0 && difference !== null && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
              OK
            </span>
          )}
        </div>
        {isReadOnly ? (
          <DifferenceIndicator difference={difference} size="lg" />
        ) : (
          <input
            type="number"
            step="0.01"
            value={difference || ''}
            onChange={(e) => onDifferenceChange(parseFloat(e.target.value) || 0)}
            className={`w-full text-2xl font-bold font-body bg-transparent border-b border-dashed focus:outline-none ${
              difference === 0 ? 'text-success border-success/50' :
              difference > 0 ? 'text-info border-info/50' :
              difference < 0 ? 'text-destructive border-destructive/50' :
              'text-foreground border-muted-foreground/30'
            }`}
            placeholder="0,00"
          />
        )}
      </div>
    </div>
  );
}
