export type Classification = string;

export const CLASSIFICATION_PERFECT = 'PERFECT';
export const CLASSIFICATION_BLUR = 'BLUR';
export const CLASSIFICATION_POOR = 'POOR';

export const Classification = {
  PERFECT: CLASSIFICATION_PERFECT,
  BLUR: CLASSIFICATION_BLUR,
  POOR: CLASSIFICATION_POOR,
} as const;

export interface ClassificationMeta {
  id: string;
  label: string;
  folderName: string;
  shortcut: string;
  description: string;
  color?: string;
  isDefault?: boolean;
}

export const DEFAULT_CLASSIFICATIONS: ClassificationMeta[] = [
  {
    id: CLASSIFICATION_PERFECT,
    label: 'Sempurna',
    folderName: 'Sempurna',
    shortcut: 'Q',
    description: 'Foto tajam, komposisi pas, atau siap dipublikasi',
    color: 'perfect',
    isDefault: true,
  },
  {
    id: CLASSIFICATION_BLUR,
    label: 'Blur',
    folderName: 'Blur',
    shortcut: 'W',
    description: 'Fokus meleset, gerakan berbayang, atau tidak tajam',
    color: 'blur',
    isDefault: true,
  },
  {
    id: CLASSIFICATION_POOR,
    label: 'Kurang Bagus',
    folderName: 'Kurang Bagus',
    shortcut: 'E',
    description: 'Ekspresi jelek, mata terpejam, atau salah pencahayaan',
    color: 'poor',
    isDefault: true,
  },
];

export const CLASSIFICATION_CONFIG: Record<string, ClassificationMeta> = DEFAULT_CLASSIFICATIONS.reduce(
  (acc, item) => ({ ...acc, [item.id]: item }),
  {}
);

