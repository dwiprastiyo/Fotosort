export type DuplicateStrategy = 'REPLACE' | 'RENAME' | 'SKIP';

export interface DuplicateConfig {
  strategy: DuplicateStrategy;
}
