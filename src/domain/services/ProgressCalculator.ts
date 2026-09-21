import { SortingSession, SessionProgress } from '../models/SortingSession';
import { DEFAULT_CLASSIFICATIONS } from '../models/Classification';

export function calculateProgress(session: SortingSession): SessionProgress {
  const total = session.photos.length;
  let reviewed = 0;

  const categories = session.categories && session.categories.length > 0
    ? session.categories
    : DEFAULT_CLASSIFICATIONS;

  const classificationCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    classificationCounts[cat.id] = 0;
  });

  const ratingCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const photo of session.photos) {
    const decision = session.decisions[photo.id];
    if (decision && decision.reviewed && decision.classification) {
      reviewed++;
      classificationCounts[decision.classification] =
        (classificationCounts[decision.classification] || 0) + 1;
    }

    if (decision && decision.rating !== null) {
      ratingCounts[decision.rating] = (ratingCounts[decision.rating] || 0) + 1;
    }
  }

  const remaining = total - reviewed;
  const percentage = total > 0 ? Math.round((reviewed / total) * 100) : 0;
  const isComplete = total > 0 && reviewed === total;

  return {
    total,
    reviewed,
    remaining,
    percentage,
    isComplete,
    classificationCounts,
    ratingCounts,
  };
}

