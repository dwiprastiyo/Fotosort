import { SortingSession, SessionStatus } from '../models/SortingSession';
import { Classification } from '../models/Classification';
import { PortfolioRating } from '../models/PortfolioRating';
import { updateClassification, updateRating } from '../models/PhotoDecision';

export function classifyCurrentPhoto(
  session: SortingSession,
  classification: Classification
): SortingSession {
  const currentPhoto = session.photos[session.currentIndex];
  if (!currentPhoto) return session;

  const currentDecision = session.decisions[currentPhoto.id] || {
    photoId: currentPhoto.id,
    classification: null,
    rating: null,
    reviewed: false,
    updatedAt: new Date().toISOString(),
  };

  const updatedDecision = updateClassification(currentDecision, classification);

  const updatedDecisions = {
    ...session.decisions,
    [currentPhoto.id]: updatedDecision,
  };

  // Determine if index should auto advance
  let newIndex = session.currentIndex;
  if (session.autoAdvance && session.currentIndex < session.photos.length - 1) {
    newIndex = session.currentIndex + 1;
  }

  return {
    ...session,
    decisions: updatedDecisions,
    currentIndex: newIndex,
    status: SessionStatus.REVIEWING,
    updatedAt: new Date().toISOString(),
  };
}

export function rateCurrentPhoto(
  session: SortingSession,
  rating: PortfolioRating
): SortingSession {
  const currentPhoto = session.photos[session.currentIndex];
  if (!currentPhoto) return session;

  const currentDecision = session.decisions[currentPhoto.id] || {
    photoId: currentPhoto.id,
    classification: null,
    rating: null,
    reviewed: false,
    updatedAt: new Date().toISOString(),
  };

  const updatedDecision = updateRating(currentDecision, rating);

  const updatedDecisions = {
    ...session.decisions,
    [currentPhoto.id]: updatedDecision,
  };

  return {
    ...session,
    decisions: updatedDecisions,
    updatedAt: new Date().toISOString(),
  };
}

export function navigateToPhoto(
  session: SortingSession,
  index: number
): SortingSession {
  if (index < 0 || index >= session.photos.length) return session;
  return {
    ...session,
    currentIndex: index,
    updatedAt: new Date().toISOString(),
  };
}

export function navigateNext(session: SortingSession): SortingSession {
  if (session.currentIndex >= session.photos.length - 1) return session;
  return navigateToPhoto(session, session.currentIndex + 1);
}

export function navigatePrevious(session: SortingSession): SortingSession {
  if (session.currentIndex <= 0) return session;
  return navigateToPhoto(session, session.currentIndex - 1);
}
