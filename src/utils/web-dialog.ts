import { Platform } from 'react-native';

function ensureWeb() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    throw new Error('Tinh nang nay chi ho tro tren web.');
  }
}

export function confirmWeb(message: string) {
  ensureWeb();
  return window.confirm(message);
}

export function promptText(message: string, defaultValue = '') {
  ensureWeb();
  const result = window.prompt(message, defaultValue);
  if (result === null) {
    return null;
  }

  const normalized = result.trim();
  return normalized.length === 0 ? null : normalized;
}

export function promptNumber(message: string, defaultValue: number) {
  const value = promptText(message, String(defaultValue));
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error('Gia tri vua nhap khong phai so hop le.');
  }

  return parsed;
}

export function promptOptionalText(message: string, defaultValue = '') {
  ensureWeb();
  const result = window.prompt(message, defaultValue);
  if (result === null) {
    return null;
  }
  return result.trim();
}

export function promptBoolean(message: string, defaultValue: boolean) {
  const hint = defaultValue ? 'yes' : 'no';
  const value = promptText(`${message} (yes/no)`, hint);
  if (value === null) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized === 'yes' || normalized === 'y' || normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'no' || normalized === 'n' || normalized === 'false' || normalized === '0') {
    return false;
  }

  throw new Error('Vui long nhap yes hoac no.');
}
