import { SortingSession } from '../models/SortingSession';
import { CLASSIFICATION_CONFIG, DEFAULT_CLASSIFICATIONS, ClassificationMeta } from '../models/Classification';
import { SeparationPlan, SeparationItem } from '../models/ProcessingResult';
import { DuplicateStrategy } from '../models/DuplicateStrategy';

export function buildSeparationPlan(
  session: SortingSession,
  _duplicateStrategy: DuplicateStrategy = 'RENAME',
  destinationRoot: string = session.sourceFolder,
  sortName?: string
): SeparationPlan {
  const items: SeparationItem[] = [];
  const destinationFoldersSet = new Set<string>();

  const categories: ClassificationMeta[] = session.categories && session.categories.length > 0
    ? session.categories
    : DEFAULT_CLASSIFICATIONS;

  const categoryMap: Record<string, ClassificationMeta> = categories.reduce(
    (acc, cat) => ({ ...acc, [cat.id]: cat }),
    { ...CLASSIFICATION_CONFIG }
  );

  const categoryCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryCounts[cat.id] = 0;
  });

  const pathSeparator = destinationRoot.includes('\\') ? '\\' : '/';
  const normalizedSortName = sortName?.trim().replace(/[\\/:*?"<>|]/g, '_');
  const sortRoot = normalizedSortName
    ? `${destinationRoot}${pathSeparator}${normalizedSortName}`
    : destinationRoot;

  for (const photo of session.photos) {
    const decision = session.decisions[photo.id];

    // Only include reviewed/classified photos
    if (decision && decision.reviewed && decision.classification) {
      const classification = decision.classification;
      const meta = categoryMap[classification];
      const rawFolderName = meta ? meta.folderName : classification;
      const sanitizedFolderName = rawFolderName.trim().replace(/[\\/:*?"<>|]/g, '_') || classification;

      const destFolder = `${sortRoot}${pathSeparator}${sanitizedFolderName}`;
      const destPath = `${destFolder}${pathSeparator}${photo.filename}`;

      destinationFoldersSet.add(destFolder);
      categoryCounts[classification] = (categoryCounts[classification] || 0) + 1;

      items.push({
        photoId: photo.id,
        filename: photo.filename,
        sourcePath: photo.sourcePath,
        destinationPath: destPath,
        classification,
      });
    }
  }

  return {
    sourceFolder: sortRoot,
    items,
    destinationFoldersNeeded: Array.from(destinationFoldersSet),
    totalFiles: items.length,
    categoryCounts,
  };
}

