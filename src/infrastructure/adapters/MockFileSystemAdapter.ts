import { IFileSystemAdapter } from './IFileSystemAdapter';
import { Photo, isSupportedImageFile } from '../../domain/models/Photo';
import { DuplicateStrategy } from '../../domain/models/DuplicateStrategy';
import { FileOperation } from '../../domain/models/FileOperation';

// High resolution photographer sample images for realistic preview & testing
const SAMPLE_PHOTOS: Omit<Photo, 'id' | 'sourcePath' | 'filename'>[] = [
  {
    fileSize: 4200000,
    mimeType: 'image/jpeg',
    fullUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=70',
    metadata: { dimensions: { width: 4000, height: 2667 }, camera: 'Sony A7IV 85mm f/1.8', dateTimeOriginal: '2026-08-15 14:22:01' },
  },
  {
    fileSize: 3800000,
    mimeType: 'image/jpeg',
    fullUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=300&q=70',
    metadata: { dimensions: { width: 3840, height: 2560 }, camera: 'Canon EOS R6 35mm f/1.4', dateTimeOriginal: '2026-08-15 14:23:45' },
  },
  {
    fileSize: 5100000,
    mimeType: 'image/jpeg',
    fullUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=70',
    metadata: { dimensions: { width: 5120, height: 3413 }, camera: 'Fujifilm X-T5 56mm f/1.2', dateTimeOriginal: '2026-08-15 14:25:10' },
  },
  {
    fileSize: 4600000,
    mimeType: 'image/jpeg',
    fullUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=300&q=70',
    metadata: { dimensions: { width: 4200, height: 2800 }, camera: 'Nikon Z8 24-70mm f/2.8', dateTimeOriginal: '2026-08-15 14:28:33' },
  },
  {
    fileSize: 3200000,
    mimeType: 'image/jpeg',
    fullUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=300&q=70',
    metadata: { dimensions: { width: 3600, height: 2400 }, camera: 'Sony A7IV 50mm f/1.4', dateTimeOriginal: '2026-08-15 14:30:12' },
  },
];

export class MockFileSystemAdapter implements IFileSystemAdapter {
  private mockFiles: Map<string, Photo[]> = new Map();

  constructor() {
    // Default demo folder
    const defaultFolder = '/Users/demo/Pictures/Session_2026_08_15';
    const photos: Photo[] = Array.from({ length: 12 }, (_, i) => {
      const sample = SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length];
      const filename = `IMG_${String(i + 1).padStart(4, '0')}.JPG`;
      return {
        id: `mock_photo_${i + 1}`,
        filename,
        sourcePath: `${defaultFolder}/${filename}`,
        fileSize: sample.fileSize,
        mimeType: sample.mimeType,
        fullUrl: sample.fullUrl,
        thumbnailUrl: sample.thumbnailUrl,
        metadata: sample.metadata,
      };
    });
    this.mockFiles.set(defaultFolder, photos);
  }

  async selectFolder(): Promise<string | null> {
    // In web mode, return default demo folder
    return '/Users/demo/Pictures/Session_2026_08_15';
  }

  async scanDirectory(folderPath: string): Promise<Photo[]> {
    // Simulate async scanning delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (this.mockFiles.has(folderPath)) {
      return this.mockFiles.get(folderPath)!;
    }

    // Generate simulated photos for custom paths
    const count = 15;
    const photos: Photo[] = Array.from({ length: count }, (_, i) => {
      const sample = SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length];
      const filename = `DSC_${String(i + 1001).padStart(4, '0')}.JPG`;
      return {
        id: `custom_photo_${i + 1}`,
        filename,
        sourcePath: `${folderPath}/${filename}`,
        fileSize: sample.fileSize,
        mimeType: sample.mimeType,
        fullUrl: sample.fullUrl,
        thumbnailUrl: sample.thumbnailUrl,
        metadata: sample.metadata,
      };
    });

    return photos.filter((p) => isSupportedImageFile(p.filename));
  }

  async createDirectory(_dirPath: string): Promise<void> {
    // Simulated directory creation
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  async copyFile(
    _sourcePath: string,
    destPath: string,
    _strategy: DuplicateStrategy,
    _operation: FileOperation = 'COPY'
  ): Promise<string> {
    // Simulate async file copying (100-200ms per photo for realistic UX)
    await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 100));
    return destPath;
  }

  async verifyFileExists(_filePath: string): Promise<boolean> {
    return true;
  }

  getFileUrl(filePath: string): string {
    return filePath;
  }

  async generateThumbnail(filePath: string): Promise<string> {
    return filePath;
  }
}
