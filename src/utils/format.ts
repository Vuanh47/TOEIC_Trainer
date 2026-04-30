export function formatExpiry(expiresIn: number | null) {
  if (!expiresIn) {
    return 'khong xac dinh';
  }

  const hours = Math.floor(expiresIn / (1000 * 60 * 60));

  if (hours < 24) {
    return `${hours} gio`;
  }

  const days = Math.floor(hours / 24);
  return `${days} ngay`;
}
