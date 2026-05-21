export type AnalyticsEventName =
  | 'property_created'
  | 'estimate_completed'
  | 'deal_analyzed';

export function trackEvent(
  eventName: AnalyticsEventName,
  payload?: Record<string, unknown>,
): void {
  console.info('[analytics]', eventName, payload ?? {});
}
