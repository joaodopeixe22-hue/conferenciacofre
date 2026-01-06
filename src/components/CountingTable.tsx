import { ConferenceItem, CurrencyType, FinancialCategory } from '@/types/conference';
import { cn } from '@/lib/utils';

interface CountingTableProps {
  items: ConferenceItem[];
  onUpdateItem: (itemId: string, updates: Partial<ConferenceItem>) => void;
  isReadOnly: boolean;
}

const CURRENCY_TYPES: CurrencyType[] = ['Moeda', 'Nota', 'Outro'];
const FINANCIAL_CATEGORIES: FinancialCategory[] = ['Cofre', 'Fundo de Troco', 'Lastro', 'Diversos'];

export function CountingTable({ items, onUpdateItem, isReadOnly }: CountingTableProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg border card-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="w-28">Denominação</th>
              <th className="w-24">Tipo</th>
              <th className="w-28">Quantidade</th>
              <th className="w-32">Valor Calculado</th>
              <th className="w-32">Categoria</th>
              <th className="min-w-[200px]">Observações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id}
                className={cn(
                  'transition-colors',
                  item.quantity > 0 && 'bg-success/5'
                )}
              >
                <td className="font-medium text-foreground">
                  {formatCurrency(item.denomination)}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="text-muted-foreground">{item.currencyType}</span>
                  ) : (
                    <select
                      value={item.currencyType}
                      onChange={(e) => onUpdateItem(item.id, { currencyType: e.target.value as CurrencyType })}
                      className="spreadsheet-input bg-transparent cursor-pointer"
                    >
                      {CURRENCY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="font-mono font-semibold text-foreground">{item.quantity}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ''}
                      onChange={(e) => onUpdateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                      className="spreadsheet-input font-mono font-semibold w-full"
                      placeholder="0"
                    />
                  )}
                </td>
                <td className={cn(
                  'font-mono font-semibold',
                  item.calculatedValue > 0 ? 'text-success' : 'text-muted-foreground'
                )}>
                  {formatCurrency(item.calculatedValue)}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="text-muted-foreground">{item.financialCategory}</span>
                  ) : (
                    <select
                      value={item.financialCategory}
                      onChange={(e) => onUpdateItem(item.id, { financialCategory: e.target.value as FinancialCategory })}
                      className="spreadsheet-input bg-transparent cursor-pointer"
                    >
                      {FINANCIAL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="text-muted-foreground">{item.observations || '-'}</span>
                  ) : (
                    <input
                      type="text"
                      value={item.observations}
                      onChange={(e) => onUpdateItem(item.id, { observations: e.target.value })}
                      className="spreadsheet-input w-full"
                      placeholder="Adicionar observação..."
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
