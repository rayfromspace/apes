import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const truncate = (text: string, length: number = 100) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};
