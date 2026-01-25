/**
 * Utilitários de data centralizados para evitar problemas de fuso horário
 * Considera o fuso de Brasília (GMT-3)
 */

/**
 * Retorna a data atual no formato YYYY-MM-DD (fuso local)
 */
export const getLocalDateString = (): string => {
  const now = new Date();
  return formatDateToISO(now);
};

/**
 * Converte um objeto Date para string no formato YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Cria um Date a partir de string YYYY-MM-DD no fuso local
 * Usa meio-dia para evitar problemas de virada de dia por timezone
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};

/**
 * Formata data para exibição curta em pt-BR (ex: 25/01/2026)
 */
export const formatDateBR = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR');
};

/**
 * Formata data para exibição longa em pt-BR (ex: sábado, 25 de janeiro de 2026)
 */
export const formatDateLongBR = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formata data com dia da semana abreviado para mobile (ex: sáb, 25/01)
 */
export const formatDateShortBR = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

/**
 * Formata data para DD/MM (usado em gráficos)
 */
export const formatDateChart = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

/**
 * Extrai ano e mês de uma string de data (retorna objeto Date no fuso local)
 */
export const getMonthFromDateString = (dateStr: string): { year: number; month: number } => {
  const date = parseLocalDate(dateStr);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};
