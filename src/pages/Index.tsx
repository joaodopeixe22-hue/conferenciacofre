import { useConferences } from '@/hooks/useConferences';
import { NewConferenceForm } from '@/components/NewConferenceForm';
import { ConferenceView } from '@/components/ConferenceView';
import { HistoryTable } from '@/components/HistoryTable';
import { TrendsDashboard } from '@/components/TrendsDashboard';
import { Vault, Shield, History } from 'lucide-react';

const Index = () => {
  const {
    conferences,
    currentConference,
    createNewConference,
    updateItem,
    updateSecurityValue,
    updateDifference,
    calculateSummary,
    finalizeConference,
    loadConference,
    deleteConference,
    clearCurrentConference,
  } = useConferences();

  const summary = calculateSummary(currentConference);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Vault className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">
                Conferência de Cofre
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de auditoria financeira para farmácia
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-muted-foreground">
              <Shield size={16} />
              <span className="text-sm font-medium">Sistema Auditável</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentConference ? (
          <ConferenceView
            conference={currentConference}
            summary={summary}
            onUpdateItem={updateItem}
            onUpdateSecurityValue={updateSecurityValue}
            onUpdateDifference={updateDifference}
            onFinalize={finalizeConference}
            onBack={clearCurrentConference}
          />
        ) : (
          <div className="space-y-8">
            {/* New Conference Form */}
            <NewConferenceForm onCreateConference={createNewConference} />

            {/* Trends Dashboard */}
            {conferences.length >= 2 && (
              <TrendsDashboard 
                conferences={conferences} 
                calculateSummary={calculateSummary} 
              />
            )}

            {/* History Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <History size={20} className="text-muted-foreground" />
                <h2 className="text-lg font-semibold font-display text-foreground">
                  Histórico de Conferências
                </h2>
                <span className="text-sm text-muted-foreground ml-2">
                  ({conferences.length} registros)
                </span>
              </div>
              <HistoryTable
                conferences={conferences}
                onViewConference={loadConference}
                onDeleteConference={deleteConference}
                calculateSummary={calculateSummary}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Conferência de Cofre – Farmácia | Sistema de uso interno
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
