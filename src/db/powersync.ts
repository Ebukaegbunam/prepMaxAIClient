import { PowerSyncDatabase, type AbstractPowerSyncDatabase, type PowerSyncBackendConnector } from '@powersync/react-native';
import { AppSchema } from './schema';
import { useSessionStore } from '@/state/session-store';
import { ENV } from '@/config/env';

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: { dbFilename: 'prepmax.db' },
});

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const { accessToken, expiresAt, isTokenExpired } = useSessionStore.getState();

    if (!accessToken) throw new Error('Not authenticated');

    if (isTokenExpired()) {
      const { refreshSession } = await import('@/lib/auth');
      await refreshSession();
      const fresh = useSessionStore.getState();
      return {
        endpoint: ENV.POWERSYNC_URL,
        token: fresh.accessToken ?? '',
        expiresAt: fresh.expiresAt ? new Date(fresh.expiresAt) : undefined,
      };
    }

    return {
      endpoint: ENV.POWERSYNC_URL,
      token: accessToken,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
      await transaction.complete();
    } catch (err) {
      await transaction.complete(String(err));
    }
  }
}

export const connector = new SupabaseConnector();

export async function initPowerSync() {
  if (!ENV.POWERSYNC_URL) {
    // PowerSync not configured yet — app works in online-only mode via TanStack Query
    return;
  }
  await db.connect(connector);
}

export async function stopPowerSync() {
  await db.disconnect();
}

export async function clearPowerSync() {
  await db.disconnectAndClear();
}
