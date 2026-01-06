import { useState, useEffect } from 'react';
import { Conference, ConferenceItem, ConferenceSummary, DENOMINATIONS, SPECIAL_DENOMINATIONS, SpecialDenomination, MANUAL_VALUE_DENOMINATIONS } from '@/types/conference';

const STORAGE_KEY = 'pharmacy-vault-conferences';

export function useConferences() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [currentConference, setCurrentConference] = useState<Conference | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setConferences(parsed);
    }
  }, []);

  useEffect(() => {
    if (conferences.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conferences));
    }
  }, [conferences]);

  const createNewConference = (date: string, shift: Conference['shift'], responsible: string): Conference => {
    const defaultItems: ConferenceItem[] = DENOMINATIONS.map((denom, index) => ({
      id: `item-${index}`,
      denomination: denom,
      quantity: 0,
      calculatedValue: 0,
      currencyType: denom < 1 ? 'Moeda' : denom <= 2 ? 'Moeda' : 'Nota',
      financialCategory: 'Cofre',
      observations: '',
      isManualValue: MANUAL_VALUE_DENOMINATIONS.includes(denom),
    }));

    // Adiciona itens especiais (Troco e Diversos)
    const specialItems: ConferenceItem[] = SPECIAL_DENOMINATIONS.map((denom, index) => ({
      id: `item-special-${index}`,
      denomination: denom as SpecialDenomination,
      quantity: 0,
      calculatedValue: 0,
      currencyType: 'Outro' as const,
      financialCategory: denom === 'Troco' ? 'Fundo de Troco' : 'Diversos',
      observations: '',
      isManualValue: true, // Sempre permite edição manual
    }));

    const allItems = [...defaultItems, ...specialItems];

    const newConference: Conference = {
      id: `conf-${Date.now()}`,
      date,
      shift,
      responsible,
      status: 'Em andamento',
      items: allItems,
      securityValue: 0,
      difference: 0,
      createdAt: new Date().toISOString(),
    };

    setCurrentConference(newConference);
    return newConference;
  };

  const updateItem = (itemId: string, updates: Partial<ConferenceItem>) => {
    if (!currentConference || currentConference.status === 'Finalizada') return;

    setCurrentConference(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const newItem = { ...item, ...updates };
          // Se for item com valor manual, não recalcula automaticamente
          // (a menos que o calculatedValue tenha sido explicitamente atualizado)
          if (!newItem.isManualValue && typeof newItem.denomination === 'number') {
            newItem.calculatedValue = newItem.quantity * newItem.denomination;
          }
          return newItem;
        }
        return item;
      });

      return { ...prev, items: updatedItems };
    });
  };

  const updateSecurityValue = (value: number) => {
    if (!currentConference || currentConference.status === 'Finalizada') return;
    setCurrentConference(prev => prev ? { ...prev, securityValue: value } : prev);
  };

  const updateDifference = (value: number) => {
    if (!currentConference || currentConference.status === 'Finalizada') return;
    setCurrentConference(prev => prev ? { ...prev, difference: value } : prev);
  };

  const calculateSummary = (conference: Conference | null): ConferenceSummary => {
    if (!conference) {
      return { totalCoins: 0, totalBills: 0, totalGeneral: 0, securityValue: 0, difference: 0 };
    }

    const totalCoins = conference.items
      .filter(item => item.currencyType === 'Moeda')
      .reduce((sum, item) => sum + item.calculatedValue, 0);

    const totalBills = conference.items
      .filter(item => item.currencyType === 'Nota')
      .reduce((sum, item) => sum + item.calculatedValue, 0);

    const totalGeneral = conference.items.reduce((sum, item) => sum + item.calculatedValue, 0);

    return {
      totalCoins,
      totalBills,
      totalGeneral,
      securityValue: conference.securityValue,
      difference: conference.difference, // Diferença agora é manual
    };
  };

  const finalizeConference = () => {
    if (!currentConference) return;

    const finalized: Conference = {
      ...currentConference,
      status: 'Finalizada',
      finalizedAt: new Date().toISOString(),
    };

    setConferences(prev => [...prev, finalized]);
    setCurrentConference(null);
  };

  const loadConference = (conferenceId: string) => {
    const conference = conferences.find(c => c.id === conferenceId);
    if (conference) {
      setCurrentConference(conference);
    }
  };

  const deleteConference = (conferenceId: string) => {
    setConferences(prev => prev.filter(c => c.id !== conferenceId));
    if (currentConference?.id === conferenceId) {
      setCurrentConference(null);
    }
  };

  const clearCurrentConference = () => {
    setCurrentConference(null);
  };

  return {
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
  };
}
