import { create } from 'zustand';
import { SortingSession, createSortingSession, SessionStatus } from '../../domain/models/SortingSession';
import { Classification, ClassificationMeta, DEFAULT_CLASSIFICATIONS } from '../../domain/models/Classification';
import { PortfolioRating } from '../../domain/models/PortfolioRating';
import { ProcessingResult, SeparationError } from '../../domain/models/ProcessingResult';
import { DuplicateStrategy } from '../../domain/models/DuplicateStrategy';
import { FileOperation } from '../../domain/models/FileOperation';
import {
  classifyCurrentPhoto,
  rateCurrentPhoto,
  navigateNext,
  navigatePrevious,
  navigateToPhoto,
} from '../../domain/services/ClassificationService';
import { buildSeparationPlan } from '../../domain/services/SeparationPlanner';
import { calculateProgress } from '../../domain/services/ProgressCalculator';
import { TauriFileSystemAdapter } from '../../infrastructure/adapters/TauriFileSystemAdapter';
import { IFileSystemAdapter } from '../../infrastructure/adapters/IFileSystemAdapter';
import { LocalStorageSessionRepository, RecentFolder } from '../../infrastructure/adapters/LocalStorageSessionRepository';

import { AISettings, DEFAULT_AI_SETTINGS } from '../../domain/models/AISettings';
import { analyzePhotoWithAI } from '../../domain/services/AISortingService';

export type ScreenView =
  | 'WELCOME'
  | 'SCANNING'
  | 'CULLING'
  | 'REVIEW'
  | 'CONFIRMATION'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'EMPTY'
  | 'ERROR';

interface ProcessingProgress {
  current: number;
  total: number;
  currentFilename: string;
  destination: string;
}

interface SortingSessionStoreState {
  session: SortingSession | null;
  viewMode: ScreenView;
  isLoading: boolean;
  isScanning: boolean;
  error: string | null;
  duplicateStrategy: DuplicateStrategy;
  processingProgress: ProcessingProgress | null;
  processingResult: ProcessingResult | null;
  hasSavedSession: boolean;
  outputFolder: string | null;
  sortName: string;
  fileOperation: FileOperation;
  recentFolders: RecentFolder[];
  categories: ClassificationMeta[];
  isCategoryModalOpen: boolean;

  // AI State
  aiSettings: AISettings;
  isAISettingsModalOpen: boolean;
  isAIAnalyzing: boolean;
  aiProgress: { current: number; total: number } | null;

  // Dependency Injections
  fsAdapter: IFileSystemAdapter;
  sessionRepo: LocalStorageSessionRepository;

  // Actions
  initialize: () => Promise<void>;
  selectFolderAndScan: () => Promise<void>;
  scanFolder: (folderPath: string) => Promise<void>;
  classifyCurrent: (classification: Classification) => void;
  rateCurrent: (rating: PortfolioRating) => void;
  goToPhoto: (index: number) => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  toggleAutoAdvance: () => void;
  setDuplicateStrategy: (strategy: DuplicateStrategy) => void;
  openReview: () => void;
  openConfirmation: () => void;
  selectOutputFolder: () => Promise<void>;
  setSortName: (name: string) => void;
  setFileOperation: (operation: FileOperation) => void;
  backToCulling: () => void;
  executeSeparation: () => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => void;
  goHome: () => Promise<void>;
  openRecentFolder: (folderPath: string) => Promise<void>;

  // Category Actions
  openCategoryModal: () => void;
  closeCategoryModal: () => void;
  setCategories: (categories: ClassificationMeta[]) => void;
  addCategory: (category: Omit<ClassificationMeta, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ClassificationMeta>) => void;
  removeCategory: (id: string) => void;
  resetCategoriesToDefault: () => void;

  // AI Actions
  openAISettingsModal: () => void;
  closeAISettingsModal: () => void;
  setAISettings: (settings: Partial<AISettings>) => void;
  autoClassifyCurrentPhoto: () => Promise<void>;
  autoClassifyBatch: () => Promise<void>;
}

const fsAdapter = new TauriFileSystemAdapter();
const sessionRepo = new LocalStorageSessionRepository();

const LOCAL_AI_SETTINGS_KEY = 'fotosort_ai_settings';

export const useSortingSessionStore = create<SortingSessionStoreState>((set, get) => ({
  session: null,
  viewMode: 'WELCOME',
  isLoading: false,
  isScanning: false,
  error: null,
  duplicateStrategy: 'RENAME',
  processingProgress: null,
  processingResult: null,
  hasSavedSession: false,
  outputFolder: null,
  sortName: '',
  fileOperation: 'COPY',
  recentFolders: [],
  categories: DEFAULT_CLASSIFICATIONS,
  isCategoryModalOpen: false,

  aiSettings: DEFAULT_AI_SETTINGS,
  isAISettingsModalOpen: false,
  isAIAnalyzing: false,
  aiProgress: null,
  fsAdapter,
  sessionRepo,

  initialize: async () => {
    set({ recentFolders: sessionRepo.loadRecentFolders() });
    const savedCategories = sessionRepo.loadCustomCategories();
    const categories = savedCategories && savedCategories.length > 0 ? savedCategories : DEFAULT_CLASSIFICATIONS;
    set({ categories });

    try {
      const rawAi = localStorage.getItem(LOCAL_AI_SETTINGS_KEY);
      if (rawAi) {
        set({ aiSettings: { ...DEFAULT_AI_SETTINGS, ...JSON.parse(rawAi) } });
      }
    } catch {
      // ignore
    }

    try {
      const savedSession = await sessionRepo.loadActiveSession();
      if (savedSession && savedSession.photos.length > 0 && savedSession.status !== SessionStatus.COMPLETED) {
        set({
          hasSavedSession: true,
          session: {
            ...savedSession,
            categories: savedSession.categories || categories,
          },
        });
      }
    } catch {
      set({ hasSavedSession: false });
    }
  },

  selectFolderAndScan: async () => {
    set({ isLoading: true, error: null });
    try {
      const selectedFolder = await get().fsAdapter.selectFolder();
      if (!selectedFolder) {
        set({ isLoading: false });
        return;
      }

      await get().scanFolder(selectedFolder);
    } catch (err: any) {
      set({
        isLoading: false,
        viewMode: 'ERROR',
        error: err.message || 'Gagal memilih folder.',
      });
    }
  },

  scanFolder: async (folderPath: string) => {
    set({ isScanning: true, viewMode: 'SCANNING', error: null });
    try {
      const photos = await get().fsAdapter.scanDirectory(folderPath);

      if (photos.length === 0) {
        set({
          isLoading: false,
          isScanning: false,
          viewMode: 'EMPTY',
          error: 'Tidak ditemukan file foto yang didukung di folder ini. (Hanya JPG, PNG, HEIC)',
        });
        return;
      }

      const categories = get().categories;
      const newSession = createSortingSession(folderPath, photos, categories);
      await sessionRepo.saveSession(newSession);
      sessionRepo.saveRecentFolder(folderPath);

      set({
        session: newSession,
        isLoading: false,
        isScanning: false,
        viewMode: 'CULLING',
        hasSavedSession: true,
        recentFolders: sessionRepo.loadRecentFolders(),
      });
    } catch (err: any) {
      set({
        isLoading: false,
        isScanning: false,
        viewMode: 'ERROR',
        error: err.message || 'Gagal memindai folder foto.',
      });
    }
  },

  classifyCurrent: (classification: Classification) => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession = classifyCurrentPhoto(session, classification);
    set({ session: updatedSession, hasSavedSession: true });
    sessionRepo.saveSession(updatedSession);
  },

  rateCurrent: (rating: PortfolioRating) => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession = rateCurrentPhoto(session, rating);
    set({ session: updatedSession, hasSavedSession: true });
    sessionRepo.saveSession(updatedSession);
  },

  goToPhoto: (index: number) => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession = navigateToPhoto(session, index);
    set({ session: updatedSession });
    sessionRepo.saveSession(updatedSession);
  },

  nextPhoto: () => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession = navigateNext(session);
    set({ session: updatedSession });
    sessionRepo.saveSession(updatedSession);
  },

  prevPhoto: () => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession = navigatePrevious(session);
    set({ session: updatedSession });
    sessionRepo.saveSession(updatedSession);
  },

  toggleAutoAdvance: () => {
    const { session, sessionRepo } = get();
    if (!session) return;

    const updatedSession: SortingSession = {
      ...session,
      autoAdvance: !session.autoAdvance,
    };
    set({ session: updatedSession });
    sessionRepo.saveSession(updatedSession);
  },

  setDuplicateStrategy: (strategy: DuplicateStrategy) => {
    set({ duplicateStrategy: strategy });
  },

  openReview: () => {
    const { session } = get();
    if (!session) return;
    set({ viewMode: 'REVIEW' });
  },

  openConfirmation: () => {
    const { session } = get();
    if (!session) return;

    const progress = calculateProgress(session);
    if (progress.reviewed === 0) {
      set({ error: 'Belum ada foto yang diklasifikasikan.' });
      return;
    }

    set({ viewMode: 'CONFIRMATION' });
  },

  backToCulling: () => {
    set({ viewMode: 'CULLING', error: null });
  },

  selectOutputFolder: async () => {
    set({ isLoading: true, error: null });
    try {
      const selectedFolder = await get().fsAdapter.selectFolder();
      if (selectedFolder) set({ outputFolder: selectedFolder });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isLoading: false });
    }
  },

  setSortName: (name: string) => {
    set({ sortName: name });
  },

  setFileOperation: (operation: FileOperation) => {
    set({ fileOperation: operation });
  },

  openRecentFolder: async (folderPath: string) => {
    await get().scanFolder(folderPath);
  },

  openCategoryModal: () => set({ isCategoryModalOpen: true }),
  closeCategoryModal: () => set({ isCategoryModalOpen: false }),

  setCategories: (categories: ClassificationMeta[]) => {
    sessionRepo.saveCustomCategories(categories);
    const session = get().session;
    const updatedSession = session ? { ...session, categories } : null;
    if (updatedSession) sessionRepo.saveSession(updatedSession);
    set({ categories, session: updatedSession });
  },

  addCategory: (newCategory: Omit<ClassificationMeta, 'id'>) => {
    const id = `CAT_${Date.now()}`;
    const category: ClassificationMeta = { ...newCategory, id, isDefault: false };
    const categories = [...get().categories, category];
    get().setCategories(categories);
  },

  updateCategory: (id: string, updates: Partial<ClassificationMeta>) => {
    const categories = get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    get().setCategories(categories);
  },

  removeCategory: (id: string) => {
    const categories = get().categories.filter((c) => c.id !== id);
    get().setCategories(categories);
  },

  resetCategoriesToDefault: () => {
    get().setCategories(DEFAULT_CLASSIFICATIONS);
  },

  executeSeparation: async () => {
    const { session, duplicateStrategy, sessionRepo, outputFolder, sortName, fileOperation } = get();
    if (!session) return;

    if (!outputFolder) {
      set({ error: 'Pilih folder tujuan yang dapat ditulis sebelum memulai pemisahan.' });
      return;
    }

    const plan = buildSeparationPlan(session, duplicateStrategy, outputFolder, sortName);
    if (plan.items.length === 0) {
      set({ error: 'Tidak ada file untuk dipisahkan.' });
      return;
    }

    set({ viewMode: 'PROCESSING', error: null });

    const startedAt = new Date().toISOString();
    let successful = 0;
    let failed = 0;
    let skipped = 0;
    const errors: SeparationError[] = [];

    const categoryTotals: Record<string, number> = {};
    (session.categories || DEFAULT_CLASSIFICATIONS).forEach((c) => {
      categoryTotals[c.id] = 0;
    });

    // 1. Ensure destination directories exist
    for (const dirPath of plan.destinationFoldersNeeded) {
      try {
        await get().fsAdapter.createDirectory(dirPath);
      } catch (err: any) {
        console.error(`Failed to create destination dir: ${dirPath}`, err);
      }
    }

    // 2. Copy files step by step
    for (let i = 0; i < plan.items.length; i++) {
      const item = plan.items[i];

      set({
        processingProgress: {
          current: i + 1,
          total: plan.items.length,
          currentFilename: item.filename,
          destination: item.destinationPath,
        },
      });

      try {
        const resultPath = await get().fsAdapter.copyFile(
          item.sourcePath,
          item.destinationPath,
          duplicateStrategy,
          fileOperation
        );

        const verified = await get().fsAdapter.verifyFileExists(resultPath);
        if (verified) {
          successful++;
          categoryTotals[item.classification] = (categoryTotals[item.classification] || 0) + 1;
        } else {
          failed++;
          errors.push({
            photoId: item.photoId,
            sourcePath: item.sourcePath,
            destinationPath: item.destinationPath,
            operation: 'copy',
            reason: 'Verifikasi keberadaan file hasil salinan gagal.',
          });
        }
      } catch (err: any) {
        failed++;
        errors.push({
          photoId: item.photoId,
          sourcePath: item.sourcePath,
          destinationPath: item.destinationPath,
          operation: 'copy',
          reason: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const completedAt = new Date().toISOString();
    const result: ProcessingResult = {
      totalProcessed: plan.items.length,
      successful,
      failed,
      skipped,
      categoryTotals,
      errors,
      startedAt,
      completedAt,
    };

    const completedSession: SortingSession = {
      ...session,
      status: SessionStatus.COMPLETED,
    };

    await sessionRepo.saveSession(completedSession);

    set({
      session: completedSession,
      viewMode: 'COMPLETED',
      processingResult: result,
      processingProgress: null,
      hasSavedSession: false,
      outputFolder: null,
      sortName: '',
      fileOperation: 'COPY',
    });
  },


  resumeSession: async () => {
    const { session, sessionRepo } = get();
    set({ isLoading: true, error: null });

    if (session && session.photos.length > 0) {
      set({
        isLoading: false,
        viewMode: 'CULLING',
      });
      return;
    }

    try {
      const savedSession = await sessionRepo.loadActiveSession();
      if (savedSession && savedSession.photos.length > 0) {
        set({
          session: savedSession,
          isLoading: false,
          viewMode: 'CULLING',
          hasSavedSession: true,
        });
      } else {
        set({
          isLoading: false,
          error: 'Sesi tersimpan tidak ditemukan.',
          hasSavedSession: false,
        });
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Gagal memuat sesi tersimpan.',
      });
    }
  },

  resetSession: () => {
    const { sessionRepo } = get();
    sessionRepo.clearActiveSession();
    set({
      session: null,
      viewMode: 'WELCOME',
      isLoading: false,
      isScanning: false,
      error: null,
      processingProgress: null,
      processingResult: null,
      hasSavedSession: false,
      outputFolder: null,
      sortName: '',
      fileOperation: 'COPY',
    });
  },

  goHome: async () => {
    const { session, sessionRepo } = get();
    const canResumeInMemory = !!(
      session &&
      session.photos.length > 0 &&
      session.status !== SessionStatus.COMPLETED
    );

    // Switch immediately so the Home button is never held behind persistence I/O.
    set({
      viewMode: 'WELCOME',
      hasSavedSession: canResumeInMemory,
      isLoading: false,
      error: null,
    });

    // The in-memory session contains the newest decisions. Only load from storage
    // when this store does not already have a session (for example after reload).
    if (canResumeInMemory) return;

    try {
      const saved = await sessionRepo.loadActiveSession();
      const canResumeSaved = !!(
        saved &&
        saved.photos.length > 0 &&
        saved.status !== SessionStatus.COMPLETED
      );

      set({
        session: canResumeSaved ? saved : null,
        hasSavedSession: canResumeSaved,
      });
    } catch {
      set({ hasSavedSession: false });
    }
  },

  openRecentFolder: async (folderPath: string) => {
    const { scanFolder } = get();
    await scanFolder(folderPath);
  },

  // AI Actions Implementation
  openAISettingsModal: () => set({ isAISettingsModalOpen: true }),
  closeAISettingsModal: () => set({ isAISettingsModalOpen: false }),

  setAISettings: (newSettings) => {
    const updated = { ...get().aiSettings, ...newSettings };
    set({ aiSettings: updated });
    try {
      localStorage.setItem(LOCAL_AI_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  autoClassifyCurrentPhoto: async () => {
    const { session, categories, aiSettings, fsAdapter } = get();
    if (!session) return;
    const currentPhoto = session.photos[session.currentIndex];
    if (!currentPhoto) return;

    if (!aiSettings.apiKey) {
      set({ isAISettingsModalOpen: true });
      return;
    }

    set({ isAIAnalyzing: true, error: null });

    try {
      // Get base64 or URL representation of image
      let base64 = currentPhoto.fullUrl || currentPhoto.thumbnailUrl || '';
      if (!base64.startsWith('data:image')) {
        base64 = await fsAdapter.generateThumbnail(currentPhoto.sourcePath, 800);
      }

      const result = await analyzePhotoWithAI(base64, categories, aiSettings);

      const currentDecision = session.decisions[currentPhoto.id] || {
        photoId: currentPhoto.id,
        classification: null,
        rating: null,
        reviewed: false,
        updatedAt: new Date().toISOString(),
      };

      const updatedDecision = {
        ...currentDecision,
        aiAnalysis: {
          recommendedClassificationId: result.recommendedClassificationId,
          confidence: result.confidence,
          reasoning: result.reasoning,
        },
        // Auto-assign classification if confidence meets threshold
        classification:
          result.confidence >= aiSettings.autoConfidenceThreshold
            ? result.recommendedClassificationId
            : currentDecision.classification,
        reviewed:
          result.confidence >= aiSettings.autoConfidenceThreshold
            ? true
            : currentDecision.reviewed,
        updatedAt: new Date().toISOString(),
      };

      const updatedDecisions = {
        ...session.decisions,
        [currentPhoto.id]: updatedDecision,
      };

      const updatedSession = {
        ...session,
        decisions: updatedDecisions,
        updatedAt: new Date().toISOString(),
      };

      set({ session: updatedSession, isAIAnalyzing: false });
    } catch (err: any) {
      set({
        isAIAnalyzing: false,
        error: `Auto-Sort AI Gagal: ${err.message || err}`,
      });
    }
  },

  autoClassifyBatch: async () => {
    const { session, categories, aiSettings, fsAdapter } = get();
    if (!session) return;

    if (!aiSettings.apiKey) {
      set({ isAISettingsModalOpen: true });
      return;
    }

    const unclassifiedPhotos = session.photos.filter((p) => {
      const dec = session.decisions[p.id];
      return !dec || !dec.classification;
    });

    if (unclassifiedPhotos.length === 0) return;

    set({
      isAIAnalyzing: true,
      aiProgress: { current: 0, total: unclassifiedPhotos.length },
      error: null,
    });

    let updatedDecisions = { ...session.decisions };

    for (let i = 0; i < unclassifiedPhotos.length; i++) {
      const photo = unclassifiedPhotos[i];
      set({ aiProgress: { current: i + 1, total: unclassifiedPhotos.length } });

      try {
        let base64 = photo.fullUrl || photo.thumbnailUrl || '';
        if (!base64.startsWith('data:image')) {
          base64 = await fsAdapter.generateThumbnail(photo.sourcePath, 600);
        }

        const result = await analyzePhotoWithAI(base64, categories, aiSettings);
        const currentDecision = updatedDecisions[photo.id] || {
          photoId: photo.id,
          classification: null,
          rating: null,
          reviewed: false,
          updatedAt: new Date().toISOString(),
        };

        updatedDecisions[photo.id] = {
          ...currentDecision,
          aiAnalysis: {
            recommendedClassificationId: result.recommendedClassificationId,
            confidence: result.confidence,
            reasoning: result.reasoning,
          },
          classification:
            result.confidence >= aiSettings.autoConfidenceThreshold
              ? result.recommendedClassificationId
              : currentDecision.classification,
          reviewed:
            result.confidence >= aiSettings.autoConfidenceThreshold
              ? true
              : currentDecision.reviewed,
          updatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn(`AI batch error for photo ${photo.filename}:`, err);
      }
    }

    const updatedSession = {
      ...session,
      decisions: updatedDecisions,
      updatedAt: new Date().toISOString(),
    };

    set({
      session: updatedSession,
      isAIAnalyzing: false,
      aiProgress: null,
    });
  },
}));
