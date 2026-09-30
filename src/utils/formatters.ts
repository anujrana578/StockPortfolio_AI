export const formatCurrency = (val: number, minimumFractionDigits = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatPercent = (val: number) => {
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}%`;
};

export const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val);
};
