import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Conference, ConferenceSummary, SpecialDenomination } from '@/types/conference';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

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

const formatDateLong = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const generateFileName = (conference: Conference, extension: string): string => {
  const date = formatDate(conference.date).replace(/\//g, '-');
  const shift = conference.shift.toLowerCase().replace('í', 'i');
  const responsible = conference.responsible.replace(/\s+/g, '_').toLowerCase();
  return `conferencia_${date}_${shift}_${responsible}.${extension}`;
};

const getChecklist = (conferenceId: string): ChecklistItem[] => {
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

export const exportToImage = async (conference: Conference, summary: ConferenceSummary): Promise<void> => {
  const checklist = getChecklist(conference.id);
  
  // Create a temporary container for the report
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 800px;
    padding: 40px;
    background: white;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  `;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #1a1a2e; margin: 0;">Conferência de Cofre</h1>
      <p style="font-size: 14px; color: #666; margin: 5px 0;">Farmácia - Sistema Auditável</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div>
          <span style="font-size: 12px; color: #666;">Data</span>
          <p style="font-size: 14px; font-weight: 600; margin: 5px 0;">${formatDateLong(conference.date)}</p>
        </div>
        <div>
          <span style="font-size: 12px; color: #666;">Turno</span>
          <p style="font-size: 14px; font-weight: 600; margin: 5px 0;">${conference.shift}</p>
        </div>
        <div>
          <span style="font-size: 12px; color: #666;">Responsável</span>
          <p style="font-size: 14px; font-weight: 600; margin: 5px 0;">${conference.responsible}</p>
        </div>
        <div>
          <span style="font-size: 12px; color: #666;">Status</span>
          <p style="font-size: 14px; font-weight: 600; margin: 5px 0; color: ${conference.status === 'Finalizada' ? '#10b981' : '#f59e0b'};">${conference.status}</p>
        </div>
      </div>
    </div>

    <h2 style="font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 15px;">Resumo Financeiro</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
        <span style="font-size: 11px; color: #388e3c;">Total Moedas</span>
        <p style="font-size: 18px; font-weight: bold; color: #2e7d32; margin: 5px 0;">${formatCurrency(summary.totalCoins)}</p>
      </div>
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
        <span style="font-size: 11px; color: #1976d2;">Total Notas</span>
        <p style="font-size: 18px; font-weight: bold; color: #1565c0; margin: 5px 0;">${formatCurrency(summary.totalBills)}</p>
      </div>
      <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
        <span style="font-size: 11px; color: #7b1fa2;">Total Geral</span>
        <p style="font-size: 18px; font-weight: bold; color: #6a1b9a; margin: 5px 0;">${formatCurrency(summary.totalGeneral)}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
        <span style="font-size: 11px; color: #e65100;">Segurança</span>
        <p style="font-size: 18px; font-weight: bold; color: #ef6c00; margin: 5px 0;">${formatCurrency(summary.securityValue)}</p>
      </div>
      <div style="background: ${summary.difference === 0 ? '#e8f5e9' : summary.difference > 0 ? '#e3f2fd' : '#ffebee'}; padding: 15px; border-radius: 8px; text-align: center;">
        <span style="font-size: 11px; color: ${summary.difference === 0 ? '#388e3c' : summary.difference > 0 ? '#1976d2' : '#c62828'};">Diferença</span>
        <p style="font-size: 18px; font-weight: bold; color: ${summary.difference === 0 ? '#2e7d32' : summary.difference > 0 ? '#1565c0' : '#b71c1c'}; margin: 5px 0;">${formatCurrency(summary.difference)}</p>
      </div>
    </div>

    <h2 style="font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 15px;">Contagem de Numerário</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px;">
      <thead>
        <tr style="background: #293752; color: white;">
          <th style="padding: 10px; text-align: left;">Denominação</th>
          <th style="padding: 10px; text-align: left;">Tipo</th>
          <th style="padding: 10px; text-align: center;">Qtd</th>
          <th style="padding: 10px; text-align: right;">Valor</th>
          <th style="padding: 10px; text-align: left;">Categoria</th>
        </tr>
      </thead>
      <tbody>
        ${conference.items.map((item, i) => `
          <tr style="background: ${i % 2 === 0 ? '#f8f9fa' : 'white'};">
            <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${formatDenomination(item.denomination)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.currencyType}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${formatCurrency(item.calculatedValue)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.financialCategory}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2 style="font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 15px;">Checklist de Conferência</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
      ${checklist.map(item => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div style="width: 20px; height: 20px; border-radius: 4px; border: 2px solid ${item.checked ? '#10b981' : '#d1d5db'}; background: ${item.checked ? '#10b981' : 'white'}; display: flex; align-items: center; justify-content: center;">
            ${item.checked ? '<span style="color: white; font-size: 12px;">✓</span>' : ''}
          </div>
          <span style="font-size: 14px; ${item.checked ? 'text-decoration: line-through; color: #9ca3af;' : 'color: #374151;'}">${item.label}</span>
        </div>
      `).join('')}
    </div>

    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 11px;">
      <p>Gerado em ${new Date().toLocaleString('pt-BR')} • Sistema de Conferência de Cofre</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = generateFileName(conference, 'jpg');
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  } finally {
    document.body.removeChild(container);
  }
};

export const exportToPDF = (conference: Conference, summary: ConferenceSummary): void => {
  const doc = new jsPDF();
  const checklist = getChecklist(conference.id);
  
  // Logo placeholder (add logo as base64 if needed)
  doc.setFillColor(41, 55, 82);
  doc.circle(20, 20, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('CF', 17, 22);
  doc.setTextColor(0, 0, 0);
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Conferência de Cofre - Farmácia', 35, 22);
  
  // Info section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${formatDateLong(conference.date)}`, 14, 38);
  doc.text(`Turno: ${conference.shift}`, 14, 45);
  doc.text(`Responsável: ${conference.responsible}`, 14, 52);
  doc.text(`Status: ${conference.status}`, 14, 59);

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
    startY: 68,
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
  doc.text('Resumo Financeiro', 14, finalY);

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

  // Checklist section
  finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  
  // Check if we need a new page
  if (finalY > 250) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Checklist de Conferência', 14, finalY);
  
  finalY += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  checklist.forEach((item, index) => {
    const y = finalY + (index * 8);
    const checkmark = item.checked ? '☑' : '☐';
    const textColor = item.checked ? [107, 114, 128] : [0, 0, 0];
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${checkmark} ${item.label}`, 18, y);
  });
  
  doc.setTextColor(0, 0, 0);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')} • Sistema de Conferência de Cofre`, 14, pageHeight - 10);

  doc.save(generateFileName(conference, 'pdf'));
};

export const exportHistoryToImage = async (conferences: Conference[], calculateSummary: (conf: Conference) => ConferenceSummary): Promise<void> => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 900px;
    padding: 40px;
    background: white;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  `;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 22px; font-weight: bold; color: #1a1a2e; margin: 0;">Histórico de Conferências</h1>
      <p style="font-size: 12px; color: #666; margin: 5px 0;">Gerado em ${new Date().toLocaleString('pt-BR')}</p>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
      <thead>
        <tr style="background: #293752; color: white;">
          <th style="padding: 10px; text-align: left;">Data</th>
          <th style="padding: 10px; text-align: left;">Turno</th>
          <th style="padding: 10px; text-align: left;">Responsável</th>
          <th style="padding: 10px; text-align: right;">Total Geral</th>
          <th style="padding: 10px; text-align: right;">Segurança</th>
          <th style="padding: 10px; text-align: right;">Diferença</th>
          <th style="padding: 10px; text-align: center;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${conferences.map((conf, i) => {
          const summary = calculateSummary(conf);
          return `
            <tr style="background: ${i % 2 === 0 ? '#f8f9fa' : 'white'};">
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${formatDate(conf.date)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${conf.shift}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${conf.responsible}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0; font-weight: 600;">${formatCurrency(summary.totalGeneral)}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0;">${formatCurrency(summary.securityValue)}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0; color: ${summary.difference === 0 ? '#2e7d32' : summary.difference > 0 ? '#1565c0' : '#b71c1c'};">${formatCurrency(summary.difference)}</td>
              <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <span style="padding: 3px 8px; border-radius: 12px; font-size: 10px; background: ${conf.status === 'Finalizada' ? '#dcfce7' : '#fef3c7'}; color: ${conf.status === 'Finalizada' ? '#166534' : '#92400e'};">${conf.status}</span>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    link.download = `historico_conferencias_${date}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  } finally {
    document.body.removeChild(container);
  }
};
