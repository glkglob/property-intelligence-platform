import type { Tables } from './database';

export type Deal = Tables<'deals'>;

export type DealRecommendation = 'proceed' | 'review' | 'reject';
