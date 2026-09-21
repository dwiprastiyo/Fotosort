import { Classification } from './Classification';

export interface SeparationError {
  photoId: string;
  sourcePath: string;
  destinationPath: string;
  operation: 'copy' | 'create_dir';
  reason: string;
}

export interface SeparationItem {
  photoId: string;
  filename: string;
  sourcePath: string;
  destinationPath: string;
  classification: Classification;
}

export interface SeparationPlan {
  sourceFolder: string;
  items: SeparationItem[];
  destinationFoldersNeeded: string[];
  totalFiles: number;
  categoryCounts: Record<string, number>;
}

export interface ProcessingResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  categoryTotals: Record<string, number>;
  errors: SeparationError[];
  startedAt: string;
  completedAt: string;
}

