import { Photo } from '../../domain/models/Photo';
import { DuplicateStrategy } from '../../domain/models/DuplicateStrategy';
import { FileOperation } from '../../domain/models/FileOperation';

export interface IFileSystemAdapter {
  selectFolder(): Promise<string | null>;
  scanDirectory(folderPath: string): Promise<Photo[]>;
  createDirectory(dirPath: string): Promise<void>;
  copyFile(sourcePath: string, destPath: string, strategy: DuplicateStrategy, operation?: FileOperation): Promise<string>;
  verifyFileExists(filePath: string): Promise<boolean>;
  getFileUrl(filePath: string): string;
  generateThumbnail(filePath: string, width?: number): Promise<string>;
}
