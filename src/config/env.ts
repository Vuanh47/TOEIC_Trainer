import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PORT = '8080';
const ANDROID_EMULATOR_URL = `http://10.0.2.2:${DEFAULT_PORT}`;
const LOCALHOST_URL = `http://localhost:${DEFAULT_PORT}`;

function extractHost(uri?: string | null) {
  if (!uri) return null;

  try {
    const normalizedUri = uri.includes('://') ? uri : `http://${uri}`;
    return new URL(normalizedUri).hostname;
  } catch {
    return null;
  }
}

function getExpoHost() {
  return extractHost(Constants.expoConfig?.hostUri) ?? extractHost(Constants.linkingUri);
}

function getDefaultBaseUrl() {
  const expoHost = getExpoHost();
  if (expoHost) return `http://${expoHost}:${DEFAULT_PORT}`;

  return Platform.OS === 'android' ? ANDROID_EMULATOR_URL : LOCALHOST_URL;
}

function normalizeBaseUrl(rawUrl: string) {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  return trimmed;
}

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = normalizeBaseUrl(
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : getDefaultBaseUrl()
);
