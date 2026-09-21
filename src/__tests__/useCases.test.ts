import { describe, it, expect, beforeEach } from 'vitest';
import { useSortingSessionStore } from '../application/stores/useSortingSessionStore';
import { Classification } from '../domain/models/Classification';
import { MockFileSystemAdapter } from '../infrastructure/adapters/MockFileSystemAdapter';

describe('Application Store & Use Cases', () => {
  beforeEach(() => {
    useSortingSessionStore.setState({ fsAdapter: new MockFileSystemAdapter() });
    useSortingSessionStore.getState().resetSession();
    useSortingSessionStore.setState({ outputFolder: '/Users/test/Fotosort Output' });
  });

  it('scans folder and creates session', async () => {
    const store = useSortingSessionStore.getState();
    await store.scanFolder('/Users/demo/Pictures/Session_2026_08_15');

    const state = useSortingSessionStore.getState();
    expect(state.session).not.toBeNull();
    expect(state.viewMode).toBe('CULLING');
    expect(state.session?.photos.length).toBeGreaterThan(0);
  });

  it('handles classification and auto-advances', async () => {
    const store = useSortingSessionStore.getState();
    await store.scanFolder('/Users/demo/Pictures/Session_2026_08_15');

    let state = useSortingSessionStore.getState();
    const firstPhotoId = state.session!.photos[0].id;
    expect(state.session?.currentIndex).toBe(0);

    // Classify first photo
    state.classifyCurrent(Classification.PERFECT);

    state = useSortingSessionStore.getState();
    expect(state.session?.decisions[firstPhotoId].classification).toBe(Classification.PERFECT);
    expect(state.session?.decisions[firstPhotoId].reviewed).toBe(true);
    // Should auto advance to index 1
    expect(state.session?.currentIndex).toBe(1);
  });

  it('updates duplicate strategy setting', () => {
    const store = useSortingSessionStore.getState();
    expect(store.duplicateStrategy).toBe('RENAME');

    store.setDuplicateStrategy('SKIP');
    expect(useSortingSessionStore.getState().duplicateStrategy).toBe('SKIP');
  });

  it('executes separation engine safely', async () => {
    const store = useSortingSessionStore.getState();
    await store.scanFolder('/Users/demo/Pictures/Session_2026_08_15');

    // Classify all photos
    let state = useSortingSessionStore.getState();
    const photos = state.session!.photos;

    photos.forEach((_, idx) => {
      useSortingSessionStore.getState().goToPhoto(idx);
      useSortingSessionStore.getState().classifyCurrent(
        idx % 2 === 0 ? Classification.PERFECT : Classification.BLUR
      );
    });

    // Execute separation
    await useSortingSessionStore.getState().executeSeparation();

    state = useSortingSessionStore.getState();
    expect(state.viewMode).toBe('COMPLETED');
    expect(state.processingResult).not.toBeNull();
    expect(state.processingResult?.successful).toBe(photos.length);
    expect(state.processingResult?.errors.length).toBe(0);
  });
});
