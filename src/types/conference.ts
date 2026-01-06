export type ShiftType = 'Abertura' | 'Intermediário' | 'Fechamento';
export type CurrencyType = 'Moeda' | 'Nota' | 'Outro';
export type FinancialCategory = 'Cofre' | 'Fundo de Troco' | 'Lastro' | 'Diversos';
export type ConferenceStatus = 'Em andamento' | 'Finalizada';

export const DENOMINATIONS = [0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00, 20.00, 50.00, 100.00] as const;
export type Denomination = typeof DENOMINATIONS[number];

export interface ConferenceItem {
  id: string;
  denomination: Denomination;
  quantity: number;
  calculatedValue: number;
  currencyType: CurrencyType;
  financialCategory: FinancialCategory;
  observations: string;
}

export interface Conference {
  id: string;
  date: string;
  shift: ShiftType;
  responsible: string;
  status: ConferenceStatus;
  items: ConferenceItem[];
  expectedValue: number;
  createdAt: string;
  finalizedAt?: string;
}

export interface ConferenceSummary {
  totalCoins: number;
  totalBills: number;
  totalGeneral: number;
  expectedValue: number;
  difference: number;
}
