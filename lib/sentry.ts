import * as Sentry from '@sentry/nextjs';

export function captureException(error: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(
  message: string,
  level?: Parameters<typeof Sentry.captureMessage>[1],
) {
  Sentry.captureMessage(message, level);
}
