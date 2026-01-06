import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Conference, ConferenceSummary, SpecialDenomination } from '@/types/conference';
import pharmacyLogo from '@/assets/pharmacy-logo.png';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const getChecklistFromStorage = (conferenceId: string): ChecklistItem[] => {
  const stored = localStorage.getItem(`checklist-${conferenceId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { id: 'entregas', label: 'Entregas', checked: false },
    { id: 'divergencias', label: 'Divergências', checked: false },
    { id: 'pdv-abastecido', label: 'PDV abastecido', checked: false },
  ];
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDenomination = (denomination: number | SpecialDenomination): string => {
  if (typeof denomination === 'string') {
    return denomination;
  }
  return formatCurrency(denomination);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const generateFileName = (conference: Conference, extension: string): string => {
  const date = formatDate(conference.date).replace(/\//g, '-');
  const shift = conference.shift.toLowerCase().replace('í', 'i');
  const responsible = conference.responsible.replace(/\s+/g, '_').toLowerCase();
  return `conferencia_${date}_${shift}_${responsible}.${extension}`;
};

export const exportToExcel = (conference: Conference, summary: ConferenceSummary): void => {
  const itemsData = conference.items.map(item => ({
    'Denominação': formatDenomination(item.denomination),
    'Tipo': item.currencyType,
    'Quantidade': item.quantity,
    'Valor Calculado': formatCurrency(item.calculatedValue),
    'Categoria': item.financialCategory,
    'Observações': item.observations,
  }));

  const summaryData = [
    { 'Descrição': 'Total em Moedas', 'Valor': formatCurrency(summary.totalCoins) },
    { 'Descrição': 'Total em Notas', 'Valor': formatCurrency(summary.totalBills) },
    { 'Descrição': 'Total Geral', 'Valor': formatCurrency(summary.totalGeneral) },
    { 'Descrição': 'Segurança', 'Valor': formatCurrency(summary.securityValue) },
    { 'Descrição': 'Diferença', 'Valor': formatCurrency(summary.difference) },
  ];

  const wb = XLSX.utils.book_new();
  
  const wsItems = XLSX.utils.json_to_sheet(itemsData);
  XLSX.utils.book_append_sheet(wb, wsItems, 'Itens da Conferência');
  
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

  const infoData = [
    { 'Campo': 'Data', 'Valor': formatDate(conference.date) },
    { 'Campo': 'Turno', 'Valor': conference.shift },
    { 'Campo': 'Responsável', 'Valor': conference.responsible },
    { 'Campo': 'Status', 'Valor': conference.status },
  ];
  const wsInfo = XLSX.utils.json_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, wsInfo, 'Informações');

  XLSX.writeFile(wb, generateFileName(conference, 'xlsx'));
};

export const exportToPDF = (conference: Conference, summary: ConferenceSummary): void => {
  const doc = new jsPDF();
  
  // Logo
  doc.addImage(pharmacyLogo, 'PNG', 14, 10, 25, 25);
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Conferência de Cofre - Farmácia', 45, 22);
  
  // Info section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${formatDate(conference.date)}`, 45, 32);
  doc.text(`Turno: ${conference.shift}`, 100, 32);
  doc.text(`Responsável: ${conference.responsible}`, 45, 39);
  doc.text(`Status: ${conference.status}`, 100, 39);

  // Items table
  const itemsBody = conference.items.map(item => [
    formatDenomination(item.denomination),
    item.currencyType,
    item.quantity.toString(),
    formatCurrency(item.calculatedValue),
    item.financialCategory,
    item.observations || '-',
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Denominação', 'Tipo', 'Qtd', 'Valor', 'Categoria', 'Obs']],
    body: itemsBody,
    theme: 'striped',
    headStyles: { fillColor: [41, 55, 82] },
    styles: { fontSize: 9 },
  });

  // Summary
  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo', 14, finalY);

  const summaryBody = [
    ['Total em Moedas', formatCurrency(summary.totalCoins)],
    ['Total em Notas', formatCurrency(summary.totalBills)],
    ['Total Geral', formatCurrency(summary.totalGeneral)],
    ['Segurança', formatCurrency(summary.securityValue)],
    ['Diferença', formatCurrency(summary.difference)],
  ];

  autoTable(doc, {
    startY: finalY + 5,
    body: summaryBody,
    theme: 'plain',
    styles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
    },
  });

  // Checklist
  finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Checklist de Conferência', 14, finalY);
  
  const checklist = getChecklistFromStorage(conference.id);
  const checklistBody = checklist.map(item => [
    item.checked ? '✓' : '○',
    item.label,
    item.checked ? 'Concluído' : 'Pendente',
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['', 'Item', 'Status']],
    body: checklistBody,
    theme: 'plain',
    styles: { fontSize: 11 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { halign: 'right' },
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 0) {
        if (data.cell.raw === '✓') {
          data.cell.styles.textColor = [34, 139, 34]; // Green
          data.cell.styles.fontStyle = 'bold';
        }
      }
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'Concluído') {
          data.cell.styles.textColor = [34, 139, 34]; // Green
        } else {
          data.cell.styles.textColor = [200, 100, 0]; // Orange
        }
      }
    },
  });

  doc.save(generateFileName(conference, 'pdf'));
};

export const exportHistoryToExcel = (conferences: Conference[], calculateSummary: (conf: Conference) => ConferenceSummary): void => {
  const data = conferences.map(conf => {
    const summary = calculateSummary(conf);
    return {
      'Data': formatDate(conf.date),
      'Turno': conf.shift,
      'Responsável': conf.responsible,
      'Total Geral': formatCurrency(summary.totalGeneral),
      'Segurança': formatCurrency(summary.securityValue),
      'Diferença': formatCurrency(summary.difference),
      'Status': conf.status,
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Histórico');

  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  XLSX.writeFile(wb, `historico_conferencias_${date}.xlsx`);
};
