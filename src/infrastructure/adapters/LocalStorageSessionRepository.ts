import { ISessionRepository } from './ISessionRepository';
import { SortingSession } from '../../domain/models/SortingSession';
import { ClassificationMeta } from '../../domain/models/Classification';

const ACTIVE_SESSION_KEY = 'fotosort_active_session_v1';
const RECENT_FOLDERS_KEY = 'fotosort_recent_folders_v1';
const CUSTOM_CATEGORIES_KEY = 'fotosort_custom_categories_v1';

export interface RecentFolder {
  path: string;
  name: string;
  lastUsedAt: string;
}

export class LocalStorageSessionRepository implements ISessionRepository {
  async saveSession(session: SortingSession): Promise<void> {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to persist session to LocalStorage:', e);
    }
  }

  async loadActiveSession(): Promise<SortingSession | null> {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as SortingSession;
    } catch (e) {
      console.error('Failed to load active session from LocalStorage:', e);
      return null;
    }
  }

  async clearActiveSession(): Promise<void> {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear active session:', e);
    }
  }

  loadRecentFolders(): RecentFolder[] {
    try {
      const data = localStorage.getItem(RECENT_FOLDERS_KEY);
      return data ? (JSON.parse(data) as RecentFolder[]).slice(0, 3) : [];
    } catch {
      return [];
    }
  }

  saveRecentFolder(path: string): void {
    try {
      const folders = this.loadRecentFolders().filter((folder) => folder.path !== path);
      const name = path.split(/[\\/]/).filter(Boolean).pop() || path;
      folders.unshift({ path, name, lastUsedAt: new Date().toISOString() });
      localStorage.setItem(RECENT_FOLDERS_KEY, JSON.stringify(folders.slice(0, 3)));
    } catch (e) {
      console.error('Failed to persist recent folders:', e);
    }
  }

  loadCustomCategories(): ClassificationMeta[] | null {
    try {
      const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
      return data ? (JSON.parse(data) as ClassificationMeta[]) : null;
    } catch (e) {
      console.error('Failed to load custom categories:', e);
      return null;
    }
  }

  saveCustomCategories(categories: ClassificationMeta[]): void {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save custom categories:', e);
    }
  }
}

