import { describe, it, expect } from 'vitest';
import { buildSeparationPlan } from '../domain/services/SeparationPlanner';
import { createSortingSession } from '../domain/models/SortingSession';
import { Classification } from '../domain/models/Classification';
import { updateClassification } from '../domain/models/PhotoDecision';
import { Photo } from '../domain/models/Photo';

const mockPhotos: Photo[] = [
  { id: 'p1', filename: 'A.JPG', sourcePath: '/source/A.JPG', fileSize: 100, mimeType: 'image/jpeg' },
  { id: 'p2', filename: 'B.JPG', sourcePath: '/source/B.JPG', fileSize: 100, mimeType: 'image/jpeg' },
  { id: 'p3', filename: 'C.JPG', sourcePath: '/source/C.JPG', fileSize: 100, mimeType: 'image/jpeg' },
];

describe('Separation Planner', () => {
  it('builds plan with correct destination paths and category counts', () => {
    let session = createSortingSession('/source', mockPhotos);

    session.decisions['p1'] = updateClassification(session.decisions['p1'], Classification.PERFECT);
    session.decisions['p2'] = updateClassification(session.decisions['p2'], Classification.BLUR);
    session.decisions['p3'] = updateClassification(session.decisions['p3'], Classification.POOR);

    const plan = buildSeparationPlan(session, 'RENAME');

    expect(plan.totalFiles).toBe(3);
    expect(plan.categoryCounts[Classification.PERFECT]).toBe(1);
    expect(plan.categoryCounts[Classification.BLUR]).toBe(1);
    expect(plan.categoryCounts[Classification.POOR]).toBe(1);

    expect(plan.items.find((i) => i.photoId === 'p1')?.destinationPath).toBe('/source/Sempurna/A.JPG');
    expect(plan.items.find((i) => i.photoId === 'p2')?.destinationPath).toBe('/source/Blur/B.JPG');
    expect(plan.items.find((i) => i.photoId === 'p3')?.destinationPath).toBe('/source/Kurang Bagus/C.JPG');

    expect(plan.destinationFoldersNeeded).toContain('/source/Sempurna');
    expect(plan.destinationFoldersNeeded).toContain('/source/Blur');
    expect(plan.destinationFoldersNeeded).toContain('/source/Kurang Bagus');
  });

  it('ignores unclassified photos in separation plan', () => {
    let session = createSortingSession('/source', mockPhotos);
    session.decisions['p1'] = updateClassification(session.decisions['p1'], Classification.PERFECT);
    // p2 and p3 remain unclassified

    const plan = buildSeparationPlan(session, 'RENAME');
    expect(plan.totalFiles).toBe(1);
    expect(plan.items[0].photoId).toBe('p1');
  });
});
