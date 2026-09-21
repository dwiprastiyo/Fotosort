import { describe, it, expect } from 'vitest';
import { Classification } from '../domain/models/Classification';
import { createSortingSession, SessionStatus } from '../domain/models/SortingSession';
import { Photo } from '../domain/models/Photo';
import {
  classifyCurrentPhoto,
  rateCurrentPhoto,
  navigateNext,
  navigatePrevious,
} from '../domain/services/ClassificationService';
import { calculateProgress } from '../domain/services/ProgressCalculator';
import { buildSeparationPlan } from '../domain/services/SeparationPlanner';

const mockPhotos: Photo[] = [
  { id: '1', filename: 'IMG_001.JPG', sourcePath: '/photos/IMG_001.JPG', fileSize: 1024, mimeType: 'image/jpeg' },
  { id: '2', filename: 'IMG_002.JPG', sourcePath: '/photos/IMG_002.JPG', fileSize: 2048, mimeType: 'image/jpeg' },
  { id: '3', filename: 'IMG_003.JPG', sourcePath: '/photos/IMG_003.JPG', fileSize: 3072, mimeType: 'image/jpeg' },
];

describe('Domain Rules & Services', () => {
  it('Domain Rule 1 & 5: Rating alone does NOT count as reviewed, classification counts as reviewed', () => {
    let session = createSortingSession('/photos', mockPhotos);
    expect(session.status).toBe(SessionStatus.READY);

    // Rate photo 1
    session = rateCurrentPhoto(session, 5);
    let progress = calculateProgress(session);
    expect(progress.reviewed).toBe(0);
    expect(session.decisions['1'].reviewed).toBe(false);
    expect(session.decisions['1'].rating).toBe(5);

    // Classify photo 1
    session = classifyCurrentPhoto(session, Classification.PERFECT);
    progress = calculateProgress(session);
    expect(progress.reviewed).toBe(1);
    expect(session.decisions['1'].reviewed).toBe(true);
    expect(session.decisions['1'].classification).toBe(Classification.PERFECT);
  });

  it('Domain Rule 2 & 4: Rating is optional and does NOT affect classification or destination folder', () => {
    let session = createSortingSession('/photos', mockPhotos);
    session = classifyCurrentPhoto(session, Classification.BLUR);

    const plan = buildSeparationPlan(session);
    expect(plan.items[0].destinationPath).toBe('/photos/Blur/IMG_001.JPG');
  });

  it('Domain Rule 7 & 8: Classification generates a plan without altering original filesystem', () => {
    let session = createSortingSession('/photos', mockPhotos);
    session = classifyCurrentPhoto(session, Classification.PERFECT); // auto advance to 1
    session = classifyCurrentPhoto(session, Classification.POOR);    // auto advance to 2

    const plan = buildSeparationPlan(session);
    expect(plan.totalFiles).toBe(2);
    expect(plan.categoryCounts[Classification.PERFECT]).toBe(1);
    expect(plan.categoryCounts[Classification.POOR]).toBe(1);
    expect(plan.categoryCounts[Classification.BLUR]).toBe(0);
    expect(plan.destinationFoldersNeeded).toContain('/photos/Sempurna');
    expect(plan.destinationFoldersNeeded).toContain('/photos/Kurang Bagus');
  });

  it('Navigation: next and previous boundaries work properly', () => {
    let session = createSortingSession('/photos', mockPhotos);
    expect(session.currentIndex).toBe(0);

    session = navigateNext(session);
    expect(session.currentIndex).toBe(1);

    session = navigateNext(session);
    expect(session.currentIndex).toBe(2);

    // boundary check
    session = navigateNext(session);
    expect(session.currentIndex).toBe(2);

    session = navigatePrevious(session);
    expect(session.currentIndex).toBe(1);
  });
});
