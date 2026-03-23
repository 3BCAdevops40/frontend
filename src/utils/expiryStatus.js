const DAY_MS = 1000 * 60 * 60 * 24;

export const convertDdMmYyyyToYyyyMmDd = (value) => {
  if (!value) return null;

  const text = String(value).trim();
  const normalizedText = text.replace(/\//g, '-');
  const parts = normalizedText.split('-');

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

const getUtcDayNumber = (date) => {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
};

const parseBaseDate = (value) => {
  if (!value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const normalized = new Date(value);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  return parseLocalDate(value);
};

export const getDaysUntilExpiry = (expiryDate, baseDate = null) => {
  const expiry = parseLocalDate(expiryDate);
  if (!expiry) return null;

  const startDate = parseBaseDate(baseDate);
  if (!startDate) return null;

  const expiryUtcDay = getUtcDayNumber(expiry);
  const startUtcDay = getUtcDayNumber(startDate);

  return expiryUtcDay - startUtcDay;
};

export const getExpiryStatus = (expiryDate, baseDate = null) => {
  const daysLeft = getDaysUntilExpiry(expiryDate, baseDate);

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
