import { ConferenceItem } from '@/types/conference';
import { AlertTriangle, Coins } from 'lucide-react';

interface ChangeAlertBannerProps {
  items: ConferenceItem[];
}

interface LowChangeItem {
  denomination: string;
  quantity: number;
  minQuantity: number;
}

const CHANGE_THRESHOLDS: Record<number, { minQuantity: number; label: string }> = {
  0.05: { minQuantity: 10, label: '5 centavos' },
  0.10: { minQuantity: 10, label: '10 centavos' },
  0.25: { minQuantity: 10, label: '25 centavos' },
  0.50: { minQuantity: 10, label: '50 centavos' },
  1.00: { minQuantity: 20, label: 'R$ 1,00' },
  2.00: { minQuantity: 20, label: 'R$ 2,00' },
  5.00: { minQuantity: 10, label: 'R$ 5,00' },
};

export function ChangeAlertBanner({ items }: ChangeAlertBannerProps) {
  const lowChangeItems: LowChangeItem[] = [];

  items.forEach(item => {
    if (typeof item.denomination === 'number') {
      const threshold = CHANGE_THRESHOLDS[item.denomination];
      if (threshold && item.quantity < threshold.minQuantity) {
        lowChangeItems.push({
          denomination: threshold.label,
          quantity: item.quantity,
          minQuantity: threshold.minQuantity,
        });
      }
    }
  });

  if (lowChangeItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-warning/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-warning-foreground flex items-center gap-2">
            <Coins size={16} />
            Nível Baixo de Troco Detectado
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            As seguintes denominações estão abaixo do nível crítico:
          </p>
          <ul className="mt-2 space-y-1">
            {lowChangeItems.map((item, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-warning rounded-full" />
                <span className="font-medium">{item.denomination}:</span>
                <span className="text-muted-foreground">
                  {item.quantity} unidades (mínimo: {item.minQuantity})
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium text-warning mt-3 flex items-center gap-2">
            💡 Sugestão: Solicitar troco ao banco ou gerência.
          </p>
        </div>
      </div>
    </div>
  );
}
