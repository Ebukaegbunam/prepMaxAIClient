import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { api } from '@/api/client';
import { AuthResponseSchema } from '@/api/schemas';
import { useSessionStore } from '@/state/session-store';
import { logger } from '@/lib/logger';

WebBrowser.maybeCompleteAuthSession();

async function _persistSession(raw: unknown) {
  const parsed = AuthResponseSchema.parse(raw);
  await useSessionStore.getState().setSession(
    parsed.user,
    parsed.session.access_token,
    parsed.session.refresh_token,
    parsed.session.expires_at,
  );
}

export async function signInWithGoogle(): Promise<void> {
  const data = await api.get<{ auth_url: string }>('auth/google/start');
  const result = await WebBrowser.openAuthSessionAsync(data.auth_url, 'prepmax://auth/callback');

  if (result.type !== 'success') {
    logger.info('Google sign-in cancelled', { type: result.type });
    return;
  }

  const url = new URL(result.url);
  const code = url.searchParams.get('code');
  if (!code) throw new Error('No OAuth code in callback URL');

  const resp = await api.post('auth/google/callback', { code });
  await _persistSession(resp);
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
