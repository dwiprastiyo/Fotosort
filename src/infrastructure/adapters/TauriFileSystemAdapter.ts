import { IFileSystemAdapter } from './IFileSystemAdapter';
import { Photo, isSupportedImageFile } from '../../domain/models/Photo';
import { DuplicateStrategy } from '../../domain/models/DuplicateStrategy';
import { FileOperation } from '../../domain/models/FileOperation';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export class TauriFileSystemAdapter implements IFileSystemAdapter {
  private isTauriAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('__TAURI__' in window || '__TAURI_INTERNALS__' in window)
    );
  }

  async selectFolder(): Promise<string | null> {
    if (!this.isTauriAvailable()) {
      throw new Error('FotoSort harus dijalankan sebagai aplikasi desktop Tauri.');
    }

    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Pilih Folder Foto Utama',
      });

      if (Array.isArray(selected)) return selected[0] || null;
      return selected;
    } catch (e) {
      throw new Error(`Gagal membuka dialog folder: ${getErrorMessage(e)}`);
    }
  }

  async scanDirectory(folderPath: string): Promise<Photo[]> {
    if (!this.isTauriAvailable()) {
      throw new Error('Pemindaian folder hanya tersedia di aplikasi desktop FotoSort.');
    }

    try {
      const { readDir } = await import('@tauri-apps/plugin-fs');
      const entries = await readDir(folderPath);

      const photos: Photo[] = [];
      const pathSeparator = folderPath.includes('\\') ? '\\' : '/';

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.isFile && entry.name && isSupportedImageFile(entry.name)) {
          const fullPath = `${folderPath}${pathSeparator}${entry.name}`;
          photos.push({
            id: `photo_${i}_${Date.now()}`,
            filename: entry.name,
            sourcePath: fullPath,
            fileSize: 1024 * 1024, // default estimate if stat unavailable
            mimeType: `image/${entry.name.split('.').pop()?.toLowerCase() || 'jpeg'}`,
            fullUrl: convertFileSrc(fullPath),
            thumbnailUrl: convertFileSrc(fullPath),
          });
        }
      }

      return photos;
    } catch (e) {
      throw new Error(`Gagal membaca folder foto: ${getErrorMessage(e)}`);
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    if (!this.isTauriAvailable()) {
      throw new Error('Operasi file hanya tersedia di aplikasi desktop FotoSort.');
    }

    try {
      const result = await invoke<{ success: boolean; error?: string }>('create_directory', {
        req: { dir_path: dirPath },
      });
      if (!result.success) {
        throw new Error(result.error || 'Operasi membuat folder gagal.');
      }
    } catch (e) {
      throw new Error(`Gagal membuat folder tujuan: ${getErrorMessage(e)}`);
    }
  }

  async copyFile(
    sourcePath: string,
    destPath: string,
    strategy: DuplicateStrategy,
    operation: FileOperation = 'COPY'
  ): Promise<string> {
    if (!this.isTauriAvailable()) {
      throw new Error('Operasi file hanya tersedia di aplikasi desktop FotoSort.');
    }

    try {
      const result = await invoke<{
        success: boolean;
        destination_path: string;
        error?: string;
      }>('copy_file', {
        req: {
          source_path: sourcePath,
          destination_path: destPath,
          strategy,
          operation,
        },
      });
      if (!result.success) {
        throw new Error(result.error || 'Operasi menyalin file gagal.');
      }
      return result.destination_path;
    } catch (e) {
      const message = getErrorMessage(e);
      console.error(`Failed to copy file ${sourcePath} -> ${destPath}:`, message);
      throw new Error(`Gagal menyalin file: ${message}`);
    }
  }

  async verifyFileExists(filePath: string): Promise<boolean> {
    if (!this.isTauriAvailable()) {
      return false;
    }

    try {
      const result = await invoke<{ exists: boolean }>('verify_file_exists', {
        req: { file_path: filePath },
      });
      return result.exists;
    } catch {
      return false;
    }
  }

  getFileUrl(filePath: string): string {
    return convertFileSrc(filePath);
  }

  async generateThumbnail(filePath: string): Promise<string> {
    return convertFileSrc(filePath);
  }
}
