type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const RING_BUFFER_SIZE = 50;
const ringBuffer: LogEntry[] = [];

function addToBuffer(entry: LogEntry) {
  if (ringBuffer.length >= RING_BUFFER_SIZE) {
    ringBuffer.shift();
  }
  ringBuffer.push(entry);
}

function makeEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return { timestamp: new Date().toISOString(), level, message, context };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    const entry = makeEntry('debug', message, context);
    addToBuffer(entry);
    if (__DEV__) {
      console.debug(`[DEBUG] ${message}`, context ?? '');
    }
  },
  info(message: string, context?: Record<string, unknown>) {
    const entry = makeEntry('info', message, context);
    addToBuffer(entry);
    if (__DEV__) {
      console.info(`[INFO] ${message}`, context ?? '');
    }
  },
  warn(message: string, context?: Record<string, unknown>) {
    const entry = makeEntry('warn', message, context);
    addToBuffer(entry);
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, context ?? '');
    }
  },
  error(message: string, context?: Record<string, unknown>) {
    const entry = makeEntry('error', message, context);
    addToBuffer(entry);
    // Always log errors regardless of env.
    console.error(`[ERROR] ${message}`, context ?? '');
  },
  // Returns a copy of the ring buffer for debug reports.
  getBuffer(): LogEntry[] {
    return [...ringBuffer];
  },
};
