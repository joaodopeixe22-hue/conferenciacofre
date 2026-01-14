import { ConferenceSummary } from '@/types/conference';
import { Coins, Banknote, Wallet, Shield, ArrowUpDown } from 'lucide-react';
import { DifferenceIndicator } from '../DifferenceIndicator';

interface MobileSummaryCardsProps {
  summary: ConferenceSummary;
  securityValue: number;
  difference: number;
  onSecurityValueChange: (value: number) => void;
  onDifferenceChange: (value: number) => void;
  isReadOnly: boolean;
}

export function MobileSummaryCards({
  summary,
  securityValue,
  difference,
  onSecurityValueChange,
  onDifferenceChange,
  isReadOnly,
}: MobileSummaryCardsProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-3">
      {/* Main totals - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Moedas */}
        <div className="bg-card rounded-xl border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={14} className="text-amber-500" />
            <span className="text-xs text-muted-foreground">Moedas</span>
          </div>
          <p className="text-lg font-mono font-bold text-foreground">
            {formatCurrency(summary.totalCoins)}
          </p>
        </div>

        {/* Total Notas */}
        <div className="bg-card rounded-xl border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Banknote size={14} className="text-emerald-500" />
            <span className="text-xs text-muted-foreground">Notas</span>
          </div>
          <p className="text-lg font-mono font-bold text-foreground">
            {formatCurrency(summary.totalBills)}
          </p>
        </div>
      </div>

      {/* Total Geral - Full width */}
      <div className="bg-primary/10 rounded-xl border border-primary/30 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">Total Geral do Cofre</span>
        </div>
        <p className="text-2xl font-mono font-bold text-primary">
          {formatCurrency(summary.totalGeneral)}
        </p>
      </div>

      {/* Segurança e Diferença - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Segurança */}
        <div className="bg-card rounded-xl border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Segurança</span>
          </div>
          {isReadOnly ? (
            <p className="text-lg font-mono font-bold text-foreground">
              {formatCurrency(securityValue)}
            </p>
          ) : (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={securityValue || ''}
              onChange={(e) => onSecurityValueChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-2 text-lg font-mono font-bold text-center bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="0,00"
            />
          )}
        </div>

        {/* Diferença */}
        <div className={`rounded-xl border p-3 ${
          difference === 0 
            ? 'bg-success/10 border-success/30' 
            : difference > 0 
              ? 'bg-info/10 border-info/30' 
              : 'bg-destructive/10 border-destructive/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpDown size={14} className={
              difference === 0 ? 'text-success' : difference > 0 ? 'text-info' : 'text-destructive'
            } />
            <span className="text-xs text-muted-foreground">Diferença</span>
          </div>
          {isReadOnly ? (
            <DifferenceIndicator difference={difference} size="sm" />
          ) : (
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={difference || ''}
              onChange={(e) => onDifferenceChange(parseFloat(e.target.value) || 0)}
              className={`w-full h-10 px-2 text-lg font-mono font-bold text-center bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                difference === 0 
                  ? 'text-success' 
                  : difference > 0 
                    ? 'text-info' 
                    : 'text-destructive'
              }`}
              placeholder="0,00"
            />
          )}
        </div>
      </div>
    </div>
  );
}
