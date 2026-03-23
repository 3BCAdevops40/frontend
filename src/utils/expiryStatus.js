const DAY_MS = 1000 * 60 * 60 * 24;

export const convertDdMmYyyyToYyyyMmDd = (value) => {
  if (!value) return null;

  const text = String(value).trim();
  const parts = text.split('-');

  if (parts.length !== 3) return null;

  // Already yyyy-mm-dd
  if (parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${year}-${month}-${day}`;
  }

  // Convert dd-mm-yyyy -> yyyy-mm-dd
  if (parts[0].length === 2 && parts[2].length === 4) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  return null;
};

export const parseLocalDate = (value) => {
  if (!value) return null;

  // Convert supported date formats to yyyy-mm-dd first.
  const normalized = convertDdMmYyyyToYyyyMmDd(String(value).slice(0, 10));
  if (!normalized) return null;

  // Parse yyyy-mm-dd safely in local time.
  const text = normalized;
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
