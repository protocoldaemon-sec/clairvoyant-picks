/**
 * Date formatting utilities with Jakarta timezone
 */

const JAKARTA_TIMEZONE = 'Asia/Jakarta';
const LOCALE = 'id-ID';

// Backend sends UTC time without timezone indicator (e.g., "2025-12-27T04:09:27.235000")
// This helper normalizes the string to ISO format with UTC indicator
function parseUTCDate(date: Date | string): Date {
  if (typeof date === 'string') {
    // If already has Z or timezone offset, use as-is
    if (date.includes('Z') || /[+-]\d{2}:\d{2}$/.test(date)) {
      return new Date(date);
    }
    // Otherwise append Z to indicate UTC
    const normalized = date.includes('T') ? date + 'Z' : date.replace(' ', 'T') + 'Z';
    return new Date(normalized);
  }
  return date;
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return '';
  const d = parseUTCDate(date);
  return d.toLocaleString(LOCALE, {
    timeZone: JAKARTA_TIMEZONE,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = parseUTCDate(date);
  return d.toLocaleDateString(LOCALE, {
    timeZone: JAKARTA_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string | null): string {
  if (!date) return '';
  const d = parseUTCDate(date);
  return d.toLocaleTimeString(LOCALE, {
    timeZone: JAKARTA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return '';
  const d = parseUTCDate(date);
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} detik lalu`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return `${Math.floor(seconds / 86400)} hari lalu`;
}
