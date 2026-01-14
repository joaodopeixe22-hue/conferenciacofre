import { ConferenceItem, CurrencyType, FinancialCategory, SPECIAL_DENOMINATIONS, SpecialDenomination } from '@/types/conference';
import { cn } from '@/lib/utils';

interface MobileCountingCardsProps {
  items: ConferenceItem[];
  onUpdateItem: (itemId: string, updates: Partial<ConferenceItem>) => void;
  isReadOnly: boolean;
}

const CURRENCY_TYPES: CurrencyType[] = ['Moeda', 'Nota', 'Outro'];
const FINANCIAL_CATEGORIES: FinancialCategory[] = ['Cofre', 'Fundo de Troco', 'Lastro', 'Diversos'];

export function MobileCountingCards({ items, onUpdateItem, isReadOnly }: MobileCountingCardsProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDenomination = (denomination: number | SpecialDenomination): string => {
    if (typeof denomination === 'string') {
      return denomination;
    }
    return formatCurrency(denomination);
  };

  const isSpecialDenomination = (denomination: number | SpecialDenomination): boolean => {
    return typeof denomination === 'string' && SPECIAL_DENOMINATIONS.includes(denomination as SpecialDenomination);
  };

  const isManualValueItem = (item: ConferenceItem): boolean => {
    return item.isManualValue || isSpecialDenomination(item.denomination);
  };

  // Filter to show only items with values or all items if not readonly
  const displayItems = isReadOnly 
    ? items.filter(item => item.quantity > 0 || item.calculatedValue > 0)
    : items;

  return (
    <div className="space-y-3">
      {displayItems.map((item) => {
        const isSpecial = isSpecialDenomination(item.denomination);
        const isManualValue = isManualValueItem(item);
        const hasValue = item.quantity > 0 || item.calculatedValue > 0;

        return (
          <div
            key={item.id}
            className={cn(
              'bg-card rounded-xl border p-4 transition-all',
              hasValue && 'border-success/30 bg-success/5',
              isSpecial && 'border-muted bg-muted/30'
            )}
          >
            {/* Denomination Header */}
            <div className="flex items-center justify-between mb-4">
              <span className={cn(
                'text-lg font-bold',
                hasValue ? 'text-primary' : 'text-foreground'
              )}>
                {formatDenomination(item.denomination)}
              </span>
              <span className={cn(
                'text-xl font-mono font-bold',
                item.calculatedValue > 0 ? 'text-success' : 'text-muted-foreground'
              )}>
                {formatCurrency(item.calculatedValue)}
              </span>
            </div>

            {!isReadOnly && (
              <div className="space-y-3">
                {/* Quantity Row */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground w-24">Quantidade</label>
                  {isSpecial ? (
                    <span className="flex-1 text-center text-muted-foreground">—</span>
                  ) : (
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        if (isManualValue && typeof item.denomination === 'number') {
                          onUpdateItem(item.id, { quantity });
                        } else if (typeof item.denomination === 'number') {
                          onUpdateItem(item.id, { 
                            quantity,
                            calculatedValue: quantity * item.denomination
                          });
                        }
                      }}
                      className="flex-1 h-12 px-4 text-lg font-mono font-bold text-center bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="0"
                    />
                  )}
                </div>

                {/* Manual Value Row (for special items) */}
                {isManualValue && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-muted-foreground w-24">Valor</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={item.calculatedValue || ''}
                      onChange={(e) => onUpdateItem(item.id, { calculatedValue: parseFloat(e.target.value) || 0 })}
                      className="flex-1 h-12 px-4 text-lg font-mono font-bold text-center text-success bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="0,00"
                    />
                  </div>
                )}

                {/* Type and Category Row */}
                <div className="flex gap-2">
                  <select
                    value={item.currencyType}
                    onChange={(e) => onUpdateItem(item.id, { currencyType: e.target.value as CurrencyType })}
                    className="flex-1 h-11 px-3 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                  >
                    {CURRENCY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select
                    value={item.financialCategory}
                    onChange={(e) => onUpdateItem(item.id, { financialCategory: e.target.value as FinancialCategory })}
                    className="flex-1 h-11 px-3 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                  >
                    {FINANCIAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Observations Row */}
                <input
                  type="text"
                  value={item.observations}
                  onChange={(e) => onUpdateItem(item.id, { observations: e.target.value })}
                  className="w-full h-11 px-4 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Observações..."
                />
              </div>
            )}

            {/* Read-only display */}
            {isReadOnly && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded">{item.currencyType}</span>
                <span className="bg-muted px-2 py-1 rounded">{item.financialCategory}</span>
                {item.quantity > 0 && (
                  <span className="bg-muted px-2 py-1 rounded">Qtd: {item.quantity}</span>
                )}
                {item.observations && (
                  <span className="bg-muted px-2 py-1 rounded flex-1">{item.observations}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
