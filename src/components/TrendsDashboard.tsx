import { Conference, ConferenceSummary } from '@/types/conference';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface TrendsDashboardProps {
  conferences: Conference[];
  calculateSummary: (conference: Conference) => ConferenceSummary;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

export function TrendsDashboard({ conferences, calculateSummary }: TrendsDashboardProps) {
  // Get last 30 conferences sorted by date
  const sortedConferences = [...conferences]
    .filter(c => c.status === 'Finalizada')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  if (sortedConferences.length < 2) {
    return null;
  }

  const chartData = sortedConferences.map(conf => {
    const summary = calculateSummary(conf);
    return {
      date: formatDate(conf.date),
      fullDate: conf.date,
      difference: summary.difference,
      shift: conf.shift,
      responsible: conf.responsible,
    };
  });

  // Calculate insights
  const differences = chartData.map(d => d.difference);
  const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
  const negativeCount = differences.filter(d => d < 0).length;
  const positiveCount = differences.filter(d => d > 0).length;
  const perfectCount = differences.filter(d => d === 0).length;

  // Find problematic patterns
  const shiftAnalysis = sortedConferences.reduce((acc, conf) => {
    const summary = calculateSummary(conf);
    if (!acc[conf.shift]) {
      acc[conf.shift] = { total: 0, negative: 0 };
    }
    acc[conf.shift].total++;
    if (summary.difference < 0) {
      acc[conf.shift].negative++;
    }
    return acc;
  }, {} as Record<string, { total: number; negative: number }>);

  const problematicShift = Object.entries(shiftAnalysis)
    .filter(([_, data]) => data.total >= 3)
    .sort((a, b) => (b[1].negative / b[1].total) - (a[1].negative / a[1].total))[0];

  return (
    <div className="bg-card rounded-lg border p-6 card-shadow mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-primary" />
        <h2 className="text-lg font-semibold font-display text-foreground">
          Dashboard de Tendências
        </h2>
        <span className="text-sm text-muted-foreground ml-2">
          (Últimas {sortedConferences.length} conferências)
        </span>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value}`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                      <p className="font-medium">{new Date(data.fullDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p className="text-muted-foreground">Turno: {data.shift}</p>
                      <p className="text-muted-foreground">Responsável: {data.responsible}</p>
                      <p className={`font-bold mt-1 ${data.difference === 0 ? 'text-success' : data.difference > 0 ? 'text-info' : 'text-destructive'}`}>
                        Diferença: {formatCurrency(data.difference)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="difference" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const color = payload.difference === 0 
                  ? 'hsl(var(--success))' 
                  : payload.difference > 0 
                    ? 'hsl(var(--info))' 
                    : 'hsl(var(--destructive))';
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Média de Diferença</p>
          <p className={`text-lg font-bold ${avgDifference === 0 ? 'text-success' : avgDifference > 0 ? 'text-info' : 'text-destructive'}`}>
            {formatCurrency(avgDifference)}
          </p>
        </div>

        <div className="bg-success/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Fechamentos Perfeitos</p>
          <p className="text-lg font-bold text-success">
            {perfectCount} <span className="text-xs font-normal">({Math.round(perfectCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>

        <div className="bg-destructive/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Com Falta</p>
          <p className="text-lg font-bold text-destructive">
            {negativeCount} <span className="text-xs font-normal">({Math.round(negativeCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>

        <div className="bg-info/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Com Sobra</p>
          <p className="text-lg font-bold text-info">
            {positiveCount} <span className="text-xs font-normal">({Math.round(positiveCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>
      </div>

      {/* Pattern Alert */}
      {problematicShift && problematicShift[1].negative / problematicShift[1].total > 0.3 && (
        <div className="mt-4 bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-foreground">Padrão Identificado</p>
            <p className="text-sm text-muted-foreground">
              O turno <span className="font-medium">{problematicShift[0]}</span> apresenta {Math.round(problematicShift[1].negative / problematicShift[1].total * 100)}% das conferências com diferença negativa. 
              Considere investigar os processos deste turno.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
