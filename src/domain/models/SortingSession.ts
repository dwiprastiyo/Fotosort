import { Photo } from './Photo';
import { PhotoDecision } from './PhotoDecision';
import { ClassificationMeta, DEFAULT_CLASSIFICATIONS } from './Classification';

export enum SessionStatus {
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  REVIEWING = 'REVIEWING',
  REVIEW_COMPLETE = 'REVIEW_COMPLETE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface SessionProgress {
  total: number;
  reviewed: number;
  remaining: number;
  percentage: number;
  isComplete: boolean;
  classificationCounts: Record<string, number>;
  ratingCounts: Record<number, number>; // 1-5
}

export interface SortingSession {
  id: string;
  sourceFolder: string;
  photos: Photo[];
  decisions: Record<string, PhotoDecision>;
  currentIndex: number;
  status: SessionStatus;
  autoAdvance: boolean;
  categories: ClassificationMeta[];
  createdAt: string;
  updatedAt: string;
}

export function createSortingSession(
  sourceFolder: string,
  photos: Photo[],
  categories: ClassificationMeta[] = DEFAULT_CLASSIFICATIONS
): SortingSession {
  const decisions: Record<string, PhotoDecision> = {};
  const now = new Date().toISOString();

  photos.forEach((photo) => {
    decisions[photo.id] = {
      photoId: photo.id,
      classification: null,
      rating: null,
      reviewed: false,
      updatedAt: now,
    };
  });

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sourceFolder,
    photos,
    decisions,
    currentIndex: 0,
    status: photos.length > 0 ? SessionStatus.READY : SessionStatus.INITIALIZING,
    autoAdvance: true,
    categories,
    createdAt: now,
    updatedAt: now,
  };
}

