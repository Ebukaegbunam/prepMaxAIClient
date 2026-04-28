import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/client';
import { AuthResponseSchema } from '@/api/schemas';
import { useSessionStore } from '@/state/session-store';
import { logger } from '@/lib/logger';

WebBrowser.maybeCompleteAuthSession();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const PKCE_VERIFIER_KEY = 'prepmax_pkce_verifier';

async function _persistSession(raw: unknown) {
  const parsed = AuthResponseSchema.parse(raw);
  await useSessionStore.getState().setSession(
    parsed.user,
    parsed.session.access_token,
    parsed.session.refresh_token,
    parsed.session.expires_at,
  );
}

function _uint8ToBase64url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function _generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const verifierBytes = Crypto.getRandomBytes(32);
  const codeVerifier = _uint8ToBase64url(verifierBytes);
  const base64Digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  const codeChallenge = base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return { codeVerifier, codeChallenge };
}

export async function signInWithGoogle(): Promise<void> {
  const { codeVerifier, codeChallenge } = await _generatePKCE();
  await SecureStore.setItemAsync(PKCE_VERIFIER_KEY, codeVerifier);

  const params = new URLSearchParams({
    provider: 'google',
    redirect_to: 'prepmax://auth/callback',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    scopes: 'email profile',
  });
  const authUrl = `${SUPABASE_URL}/auth/v1/authorize?${params}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, 'prepmax://auth/callback');

  if (result.type !== 'success') {
    logger.info('Google sign-in cancelled', { type: result.type });
    await SecureStore.deleteItemAsync(PKCE_VERIFIER_KEY);
    return;
  }

  const url = new URL(result.url);
  const code = url.searchParams.get('code');
  if (!code) throw new Error('No OAuth code in callback URL');

  const resp = await api.post('auth/google/callback', { code, code_verifier: codeVerifier });
  await _persistSession(resp);
  await SecureStore.deleteItemAsync(PKCE_VERIFIER_KEY);
}

export async function signInWithApple(): Promise<void> {
  const rawNonce = Array.from(Crypto.getRandomBytes(16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) throw new Error('No identity token from Apple');

  const resp = await api.post('auth/apple/callback', {
    identity_token: credential.identityToken,
    nonce: rawNonce,
  });
  await _persistSession(resp);
}

export async function signOut(): Promise<void> {
  try {
    await api.post('auth/sign-out', {});
  } catch {
    // ignore — clear locally regardless
  }
  await useSessionStore.getState().clearSession();
}

export async function refreshSession(): Promise<void> {
  const { refreshToken } = useSessionStore.getState();
  if (!refreshToken) throw new Error('No refresh token');
  const resp = await api.post('auth/refresh', { refresh_token: refreshToken });
  await _persistSession(resp);
}
