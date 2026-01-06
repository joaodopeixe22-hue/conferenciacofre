import { ConferenceSummary } from '@/types/conference';
import { DifferenceIndicator } from './DifferenceIndicator';
import { Coins, Banknote, Wallet, Target } from 'lucide-react';

interface SummaryCardsProps {
  summary: ConferenceSummary;
  expectedValue: number;
  onExpectedValueChange: (value: number) => void;
  isReadOnly: boolean;
}

export function SummaryCards({ 
  summary, 
  expectedValue, 
  onExpectedValueChange, 
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

      {/* Valor Esperado */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Target size={18} />
          <span className="text-sm font-medium">Valor Esperado</span>
        </div>
        {isReadOnly ? (
          <p className="text-2xl font-bold font-body text-foreground">
            {formatCurrency(expectedValue)}
          </p>
        ) : (
          <input
            type="number"
            step="0.01"
            min="0"
            value={expectedValue || ''}
            onChange={(e) => onExpectedValueChange(parseFloat(e.target.value) || 0)}
            className="w-full text-2xl font-bold font-body bg-transparent border-b border-dashed border-muted-foreground/30 focus:border-primary focus:outline-none text-foreground"
            placeholder="0,00"
          />
        )}
      </div>

      {/* Diferença */}
      <div className="bg-card rounded-lg border p-4 card-shadow">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <span className="text-sm font-medium">Diferença</span>
        </div>
        <DifferenceIndicator difference={summary.difference} size="lg" />
      </div>
    </div>
  );
}
