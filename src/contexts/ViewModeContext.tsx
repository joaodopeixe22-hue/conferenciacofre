import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ViewMode = 'desktop' | 'mobile';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobileMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const STORAGE_KEY = 'conferencia-view-mode';

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'mobile' || stored === 'desktop') {
      return stored;
    }
    // Auto-detect based on screen width
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'desktop';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  // Apply body class for global CSS targeting
  useEffect(() => {
    document.body.classList.remove('mobile-mode', 'desktop-mode');
    document.body.classList.add(`${viewMode}-mode`);
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      isMobileMode: viewMode === 'mobile' 
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
