export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
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
