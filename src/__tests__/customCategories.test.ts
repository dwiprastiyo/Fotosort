import { describe, it, expect } from 'vitest';
import { createSortingSession } from '../domain/models/SortingSession';
import { ClassificationMeta, DEFAULT_CLASSIFICATIONS } from '../domain/models/Classification';
import { calculateProgress } from '../domain/services/ProgressCalculator';
import { buildSeparationPlan } from '../domain/services/SeparationPlanner';
import { Photo } from '../domain/models/Photo';

const mockPhotos: Photo[] = [
  {
    id: 'photo_1',
    filename: 'DSC_0001.JPG',
    sourcePath: '/photos/DSC_0001.JPG',
    fileSize: 5000000,
    mimeType: 'image/jpeg',
  },
  {
    id: 'photo_2',
    filename: 'DSC_0002.JPG',
    sourcePath: '/photos/DSC_0002.JPG',
    fileSize: 4000000,
    mimeType: 'image/jpeg',
  },
];

describe('Custom Categories & Presets', () => {
  it('creates session with custom category presets', () => {
    const customCategories: ClassificationMeta[] = [
      ...DEFAULT_CLASSIFICATIONS,
      {
        id: 'CAT_PRINT',
        label: 'Siap Cetak',
        folderName: 'Siap Cetak',
        shortcut: 'R',
        description: 'Foto untuk dicetak',
        color: 'custom',
      },
    ];

    const session = createSortingSession('/photos', mockPhotos, customCategories);

    expect(session.categories).toHaveLength(4);
    expect(session.categories[3].id).toBe('CAT_PRINT');
    expect(session.categories[3].folderName).toBe('Siap Cetak');
  });

  it('calculates progress with custom category counts', () => {
    const customCategories: ClassificationMeta[] = [
      {
        id: 'PORTFOLIO',
        label: 'Portofolio',
        folderName: 'Portofolio',
        shortcut: 'Q',
        description: 'Foto portofolio',
      },
      {
        id: 'DELETE',
        label: 'Hapus',
        folderName: 'Trash',
        shortcut: 'W',
        description: 'Foto dibuang',
      },
    ];

    let session = createSortingSession('/photos', mockPhotos, customCategories);

    // Classify photo 1 as PORTFOLIO, photo 2 as DELETE
    session = {
      ...session,
      decisions: {
        photo_1: {
          photoId: 'photo_1',
          classification: 'PORTFOLIO',
          rating: null,
          reviewed: true,
          updatedAt: new Date().toISOString(),
        },
        photo_2: {
          photoId: 'photo_2',
          classification: 'DELETE',
          rating: null,
          reviewed: true,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    const progress = calculateProgress(session);

    expect(progress.reviewed).toBe(2);
    expect(progress.classificationCounts['PORTFOLIO']).toBe(1);
    expect(progress.classificationCounts['DELETE']).toBe(1);
  });

  it('builds separation plan using custom folder names', () => {
    const customCategories: ClassificationMeta[] = [
      {
        id: 'FAVORITE',
        label: 'Favorit Sesi',
        folderName: 'Highlights 2026',
        shortcut: 'Q',
        description: 'Foto terbaik',
      },
    ];

    let session = createSortingSession('/photos', mockPhotos, customCategories);
    session = {
      ...session,
      decisions: {
        photo_1: {
          photoId: 'photo_1',
          classification: 'FAVORITE',
          rating: 5,
          reviewed: true,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    const plan = buildSeparationPlan(session, 'RENAME', '/output', 'Wisuda 2026');

    expect(plan.items).toHaveLength(1);
    expect(plan.items[0].destinationPath).toBe('/output/Wisuda 2026/Highlights 2026/DSC_0001.JPG');
    expect(plan.destinationFoldersNeeded).toContain('/output/Wisuda 2026/Highlights 2026');
  });
});

