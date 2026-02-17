type LogMethod = (...args: unknown[]) => void;

export type Logger = {
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  debug: LogMethod;
};

const browserLogger: Logger = {
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  debug: (...args) => console.debug(...args),
};

const createServerLogger = (): Logger => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pino = require("pino");
    return pino({
      level: process.env.LOG_LEVEL ?? "info",
      base: undefined,
    });
  } catch {
    return browserLogger;
  }
};

export const logger: Logger =
  typeof window === "undefined" ? createServerLogger() : browserLogger;
