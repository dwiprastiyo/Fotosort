export interface PhotoMetadata {
  dimensions?: {
    width: number;
    height: number;
  };
  camera?: string;
  dateTimeOriginal?: string;
}

export interface Photo {
  id: string;
  filename: string;
  sourcePath: string;
  fileSize: number;
  mimeType: string;
  metadata?: PhotoMetadata;
  thumbnailUrl?: string;
  fullUrl?: string;
}

export const SUPPORTED_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'heic',
  'heif',
  'webp',
] as const;

export function isSupportedImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return false;
  return SUPPORTED_IMAGE_EXTENSIONS.includes(ext as any);
}
