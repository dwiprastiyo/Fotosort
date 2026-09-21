import { Classification } from './Classification';
import { PortfolioRating } from './PortfolioRating';

export interface PhotoDecision {
  photoId: string;
  classification: Classification | null;
  rating: PortfolioRating;
  /**
   * Domain Rule 5: A photo is considered reviewed when classification is assigned.
   * Rating alone does NOT count as reviewed.
   */
  reviewed: boolean;
  updatedAt: string;
}

export function createEmptyDecision(photoId: string): PhotoDecision {
  return {
    photoId,
    classification: null,
    rating: null,
    reviewed: false,
    updatedAt: new Date().toISOString(),
  };
}

export function updateClassification(
  decision: PhotoDecision,
  classification: Classification
): PhotoDecision {
  return {
    ...decision,
    classification,
    reviewed: true,
    updatedAt: new Date().toISOString(),
  };
}

export function updateRating(
  decision: PhotoDecision,
  rating: PortfolioRating
): PhotoDecision {
  return {
    ...decision,
    rating,
    // Note: Rating update does NOT change classification or reviewed status!
    updatedAt: new Date().toISOString(),
  };
}
