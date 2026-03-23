const DAY_MS = 1000 * 60 * 60 * 24;

export const parseLocalDate = (value) => {
  if (!value) return null;

  // Handle backend values like "yyyy-MM-dd" and ISO date-time safely in local time.
  const text = String(value).slice(0, 10);
  const parts = text.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [year, month, day] = parts;
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

export const getDaysUntilExpiry = (expiryDate) => {
  const expiry = parseLocalDate(expiryDate);
  if (!expiry) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((expiry.getTime() - today.getTime()) / DAY_MS);
};

export const getExpiryStatus = (expiryDate) => {
  const daysLeft = getDaysUntilExpiry(expiryDate);

  if (daysLeft === null) {
    return { label: '—', className: 'expiry-status--safe' };
  }

  if (daysLeft < 0) {
    return { label: '❌ Expired', className: 'expiry-status--expired' };
  }

  if (daysLeft <= 7) {
    return { label: '⚠️ Few days left', className: 'expiry-status--warning' };
  }

  return { label: `⏳ ${daysLeft} days left`, className: 'expiry-status--safe' };
};
