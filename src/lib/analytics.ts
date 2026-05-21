export type AnalyticsEventName =
  | 'signup_viewed'
  | 'session_restore'
  | 'property_created'
  | 'estimate_started'
  | 'estimate_completed'
  | 'deal_analyzed'
  | 'save_failed';

// No-op stub. Wire a real provider (PostHog, Sentry, etc.) before public launch.
// Replace the body of trackEvent with: posthog.capture(eventName, payload) or equivalent.
export function trackEvent(
  eventName: AnalyticsEventName,
  payload?: Record<string, unknown>,
): void {
  if (import.meta.env.DEV) {
    console.info('[analytics]', eventName, payload ?? {});
  }
}
