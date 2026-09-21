import { SortingSession } from '../../domain/models/SortingSession';

export interface ISessionRepository {
  saveSession(session: SortingSession): Promise<void>;
  loadActiveSession(): Promise<SortingSession | null>;
  clearActiveSession(): Promise<void>;
}
