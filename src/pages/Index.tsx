import { useConferences } from '@/hooks/useConferences';
import { NewConferenceForm } from '@/components/NewConferenceForm';
import { ConferenceView } from '@/components/ConferenceView';
import { HistoryTable } from '@/components/HistoryTable';
import { TrendsDashboard } from '@/components/TrendsDashboard';
import { MobileHistoryCards } from '@/components/mobile/MobileHistoryCards';
import { ViewModeSwitcher } from '@/components/ViewModeSwitcher';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Vault, Shield, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { isMobileMode } = useViewMode();
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
    <div className={cn(
      "min-h-screen bg-background",
      isMobileMode && "pb-4"
    )}>
      {/* Header */}
      <header className={cn(
        "bg-card border-b",
        !isMobileMode && "sticky top-0 z-50"
      )}>
        <div className={cn(
          "container mx-auto py-4",
          isMobileMode ? "px-3" : "px-4"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "bg-primary rounded-lg",
              isMobileMode ? "p-1.5" : "p-2"
            )}>
              <Vault className={cn(
                "text-primary-foreground",
                isMobileMode ? "w-5 h-5" : "w-6 h-6"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className={cn(
                "font-bold font-display text-foreground truncate",
                isMobileMode ? "text-lg" : "text-xl"
              )}>
                Conferência de Cofre
              </h1>
              {!isMobileMode && (
                <p className="text-sm text-muted-foreground">
                  Sistema de auditoria financeira para farmácia
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ViewModeSwitcher />
              {!isMobileMode && (
                <div className="flex items-center gap-2 text-muted-foreground ml-2">
                  <Shield size={16} />
                  <span className="text-sm font-medium">Sistema Auditável</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "container mx-auto py-6",
        isMobileMode ? "px-3" : "px-4"
      )}>
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
          <div className={cn(
            isMobileMode ? "space-y-6" : "space-y-8"
          )}>
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
                <History size={isMobileMode ? 18 : 20} className="text-muted-foreground" />
                <h2 className={cn(
                  "font-semibold font-display text-foreground",
                  isMobileMode ? "text-base" : "text-lg"
                )}>
                  Histórico de Conferências
                </h2>
                <span className="text-sm text-muted-foreground ml-2">
                  ({conferences.length})
                </span>
              </div>
              
              {isMobileMode ? (
                <MobileHistoryCards
                  conferences={conferences}
                  onViewConference={loadConference}
                  onDeleteConference={deleteConference}
                  calculateSummary={calculateSummary}
                />
              ) : (
                <HistoryTable
                  conferences={conferences}
                  onViewConference={loadConference}
                  onDeleteConference={deleteConference}
                  calculateSummary={calculateSummary}
                />
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer - hide on mobile when viewing conference */}
      {!(isMobileMode && currentConference) && (
        <footer className="border-t mt-auto">
          <div className={cn(
            "container mx-auto py-4",
            isMobileMode ? "px-3" : "px-4"
          )}>
            <p className={cn(
              "text-muted-foreground text-center",
              isMobileMode ? "text-xs" : "text-sm"
            )}>
              © {new Date().getFullYear()} Conferência de Cofre – Farmácia
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
