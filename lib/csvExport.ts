import { WaitlistEntry } from './types';

/**
 * Escapes a cell value to prevent CSV Formula Injection (CWE-1236)
 * If a field starts with =, +, -, @, or tab/CR, prepend an apostrophe (')
 * and enclose in quotes if it contains commas, double quotes, or newlines.
 */
export function sanitizeCSVCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Formula injection prevention: check if first character is dangerous
  const firstChar = str.trim().charAt(0);
  if (['=', '+', '-', '@', '\t', '\r'].includes(firstChar)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}

/**
 * Generates a Devanagari-safe CSV with UTF-8 BOM (\uFEFF)
 */
export function generateWaitlistCSV(entries: WaitlistEntry[]): string {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Role',
    'Practises At',
    'First Feature Wanted',
    'Chambers Note',
    'Status',
    'Internal Notes',
    'Consent Given',
    'Consent Timestamp',
    'Joined Date (BS/AD)',
    'Source',
  ];

  const rows = entries.map((entry) => [
    sanitizeCSVCell(entry.id),
    sanitizeCSVCell(entry.name),
    sanitizeCSVCell(entry.email),
    sanitizeCSVCell(entry.phone || ''),
    sanitizeCSVCell(entry.role),
    sanitizeCSVCell(entry.place || ''),
    sanitizeCSVCell(entry.firstFeature || ''),
    sanitizeCSVCell(entry.note || ''),
    sanitizeCSVCell(entry.status),
    sanitizeCSVCell(entry.internalNotes || ''),
    sanitizeCSVCell(entry.consent ? 'Yes' : 'No'),
    sanitizeCSVCell(entry.consentTimestamp),
    sanitizeCSVCell(entry.createdAt),
    sanitizeCSVCell(entry.source),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Prepend UTF-8 Byte Order Mark (BOM) so Excel respects Devanagari Unicode
  return `\uFEFF${csvContent}`;
}

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
