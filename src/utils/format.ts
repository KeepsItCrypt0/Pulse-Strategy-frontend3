export function formatNumber(value: string | number | bigint): string {
  const num = Number(value) / 1e18; // Adjust for 18 decimals
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function secondsToDays(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  return `${days} day${days === 1 ? '' : 's'}`;
}
