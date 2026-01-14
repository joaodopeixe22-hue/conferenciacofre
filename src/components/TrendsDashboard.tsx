import { Conference, ConferenceSummary } from '@/types/conference';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';
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
  const { isMobileMode } = useViewMode();

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
    <div className={cn(
      "bg-card rounded-lg border card-shadow mb-6",
      isMobileMode ? "p-4" : "p-6"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={isMobileMode ? 18 : 20} className="text-primary" />
        <h2 className={cn(
          "font-semibold font-display text-foreground",
          isMobileMode ? "text-base" : "text-lg"
        )}>
          Dashboard de Tendências
        </h2>
        {!isMobileMode && (
          <span className="text-sm text-muted-foreground ml-2">
            (Últimas {sortedConferences.length} conferências)
          </span>
        )}
      </div>

      {/* Chart */}
      <div className={cn(
        "mb-4",
        isMobileMode ? "h-40" : "h-64 mb-6"
      )}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: isMobileMode ? 10 : 20, left: isMobileMode ? 0 : 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobileMode ? 9 : 11 }}
              tickLine={false}
              interval={isMobileMode ? 'preserveStartEnd' : 0}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value}`}
              tick={{ fontSize: isMobileMode ? 9 : 11 }}
              tickLine={false}
              axisLine={false}
              width={isMobileMode ? 50 : 60}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-2 text-xs">
                      <p className="font-medium">{new Date(data.fullDate).toLocaleDateString('pt-BR')}</p>
                      <p className="text-muted-foreground">{data.shift} • {data.responsible}</p>
                      <p className={`font-bold mt-1 ${data.difference === 0 ? 'text-success' : data.difference > 0 ? 'text-info' : 'text-destructive'}`}>
                        {formatCurrency(data.difference)}
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
                    r={isMobileMode ? 3 : 4} 
                    fill={color}
                    stroke="white"
                    strokeWidth={isMobileMode ? 1 : 2}
                  />
                );
              }}
              activeDot={{ r: isMobileMode ? 4 : 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Cards */}
      <div className={cn(
        "grid gap-3",
        isMobileMode ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4 gap-4"
      )}>
        <div className={cn(
          "bg-muted/50 rounded-lg text-center",
          isMobileMode ? "p-2" : "p-3"
        )}>
          <p className={cn(
            "text-muted-foreground mb-1",
            isMobileMode ? "text-[10px]" : "text-xs"
          )}>Média</p>
          <p className={cn(
            "font-bold",
            isMobileMode ? "text-sm" : "text-lg",
            avgDifference === 0 ? 'text-success' : avgDifference > 0 ? 'text-info' : 'text-destructive'
          )}>
            {formatCurrency(avgDifference)}
          </p>
        </div>

        <div className={cn(
          "bg-success/10 rounded-lg text-center",
          isMobileMode ? "p-2" : "p-3"
        )}>
          <p className={cn(
            "text-muted-foreground mb-1",
            isMobileMode ? "text-[10px]" : "text-xs"
          )}>Perfeitos</p>
          <p className={cn(
            "font-bold text-success",
            isMobileMode ? "text-sm" : "text-lg"
          )}>
            {perfectCount} <span className={cn(isMobileMode ? "text-[10px]" : "text-xs", "font-normal")}>({Math.round(perfectCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>

        <div className={cn(
          "bg-destructive/10 rounded-lg text-center",
          isMobileMode ? "p-2" : "p-3"
        )}>
          <p className={cn(
            "text-muted-foreground mb-1",
            isMobileMode ? "text-[10px]" : "text-xs"
          )}>Com Falta</p>
          <p className={cn(
            "font-bold text-destructive",
            isMobileMode ? "text-sm" : "text-lg"
          )}>
            {negativeCount} <span className={cn(isMobileMode ? "text-[10px]" : "text-xs", "font-normal")}>({Math.round(negativeCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>

        <div className={cn(
          "bg-info/10 rounded-lg text-center",
          isMobileMode ? "p-2" : "p-3"
        )}>
          <p className={cn(
            "text-muted-foreground mb-1",
            isMobileMode ? "text-[10px]" : "text-xs"
          )}>Com Sobra</p>
          <p className={cn(
            "font-bold text-info",
            isMobileMode ? "text-sm" : "text-lg"
          )}>
            {positiveCount} <span className={cn(isMobileMode ? "text-[10px]" : "text-xs", "font-normal")}>({Math.round(positiveCount / sortedConferences.length * 100)}%)</span>
          </p>
        </div>
      </div>

      {/* Pattern Alert */}
      {problematicShift && problematicShift[1].negative / problematicShift[1].total > 0.3 && (
        <div className={cn(
          "mt-4 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-2",
          isMobileMode ? "p-2" : "p-3 gap-3"
        )}>
          <AlertCircle className={cn(
            "text-warning mt-0.5",
            isMobileMode ? "w-4 h-4" : "w-5 h-5"
          )} />
          <div>
            <p className={cn(
              "font-medium text-warning-foreground",
              isMobileMode ? "text-xs" : "text-sm"
            )}>Padrão Identificado</p>
            <p className={cn(
              "text-muted-foreground",
              isMobileMode ? "text-xs" : "text-sm"
            )}>
              O turno <span className="font-medium">{problematicShift[0]}</span> apresenta {Math.round(problematicShift[1].negative / problematicShift[1].total * 100)}% de diferença negativa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
