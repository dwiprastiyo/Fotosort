import React, { useEffect, useRef } from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { DEFAULT_CLASSIFICATIONS } from '../../domain/models/Classification';
import { PortfolioRating } from '../../domain/models/PortfolioRating';
import { ClassificationButton } from '../components/ui/ClassificationButton';
import { CategorySettingsModal } from '../components/ui/CategorySettingsModal';
import { StarRating } from '../components/ui/StarRating';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PhotoThumbnail } from '../components/ui/PhotoThumbnail';
import { calculateProgress } from '../../domain/services/ProgressCalculator';
import { AISettingsModal } from '../components/ui/AISettingsModal';
import { CheckCircle2, ArrowRight, ToggleLeft, ToggleRight, Layers, List, FileImage, HardDrive, MapPin, Settings, Sparkles, Bot } from 'lucide-react';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const CullingWorkspaceScreen: React.FC = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const {
    session,
    categories,
    openCategoryModal,
    aiSettings,
    openAISettingsModal,
    autoClassifyCurrentPhoto,
    autoClassifyBatch,
    isAIAnalyzing,
    aiProgress,
    classifyCurrent,
    rateCurrent,
    nextPhoto,
    prevPhoto,
    goToPhoto,
    toggleAutoAdvance,
    openReview,
    openConfirmation,
    goHome,
  } = useSortingSessionStore();

  const activeCategories = session?.categories && session.categories.length > 0
    ? session.categories
    : (categories && categories.length > 0 ? categories : DEFAULT_CLASSIFICATIONS);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

      const rawKey = e.key;
      const keyUpper = rawKey.toUpperCase();
      const keyLower = rawKey.toLowerCase();

      // Check category shortcuts
      const matchedCat = activeCategories.find((c) => c.shortcut.toUpperCase() === keyUpper);
      if (matchedCat) {
        classifyCurrent(matchedCat.id);
        return;
      }

      switch (keyLower) {
        case '1': case '2': case '3': case '4': case '5':
          rateCurrent(parseInt(keyLower, 10) as PortfolioRating); break;
        case '0': case 'backspace': rateCurrent(null); break;
        case 'arrowleft': prevPhoto(); break;
        case 'arrowright': nextPhoto(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategories, classifyCurrent, rateCurrent, prevPhoto, nextPhoto]);

  if (!session || session.photos.length === 0) return null;

  const currentPhoto = session.photos[session.currentIndex];
  const currentDecision = currentPhoto ? session.decisions[currentPhoto.id] : undefined;

  const progress = calculateProgress(session);

  return (
    <div className="ws">
      <CategorySettingsModal />

      {/* ── Header ── */}
      <header className="ws-header">
        <div className="ws-h-left">
          <button type="button" className="ws-brand" onClick={goHome} title="Kembali ke Beranda">
            <div className="ws-logo">
              <Layers className="ws-logo-svg" />
            </div>
            <span className="ws-brand-text">FotoSort</span>
          </button>
          <span className="ws-folder" title={session.sourceFolder}>
            📁 {session.sourceFolder.split(/[\/\\]/).pop() || session.sourceFolder}
          </span>
        </div>

        <div className="ws-h-center">
          <ProgressBar reviewed={progress.reviewed} total={progress.total} />
        </div>

        <div className="ws-h-right">
          <button type="button" className="ws-toggle" onClick={openCategoryModal} title="Atur Kategori & Folder">
            <Settings className="ws-tog-icon" />
            <span>Kategori</span>
          </button>
          <button
            type="button"
            className="ws-toggle ai-btn"
            onClick={openAISettingsModal}
            title="Pengaturan AI Auto-Sort"
          >
            <Sparkles className="ws-tog-icon text-amber-900" />
            <span>AI Settings</span>
          </button>
          <button type="button" className="ws-toggle" onClick={toggleAutoAdvance}
            title="Auto-advance after classify">
            {session.autoAdvance ? <ToggleRight className="ws-tog-icon on" /> : <ToggleLeft className="ws-tog-icon" />}
            <span>Auto Advance</span>
          </button>
          <button type="button" className="ws-review-btn" onClick={openReview}>
            <span>Tinjau Hasil ({progress.reviewed})</span>
            <ArrowRight className="ws-ri" />
          </button>
        </div>
      </header>

      {/* ── Main Photo Stage ── */}
      <main className="ws-body">
        <aside className="ws-file-info" aria-label="Informasi file foto">
          <div className="ws-info-head">
            <FileImage className="ws-info-icon" />
            <span>Info File</span>
          </div>
          <div className="ws-info-name" title={currentPhoto.filename}>{currentPhoto.filename}</div>
          <div className="ws-info-grid">
            <div className="ws-info-row">
              <span>Ukuran</span>
              <strong>{formatFileSize(currentPhoto.fileSize)}</strong>
            </div>
            <div className="ws-info-row">
              <span>Format</span>
              <strong>{currentPhoto.mimeType.replace('image/', '').toUpperCase()}</strong>
            </div>
            {currentPhoto.metadata?.dimensions && (
              <div className="ws-info-row">
                <span>Resolusi</span>
                <strong>{currentPhoto.metadata.dimensions.width} × {currentPhoto.metadata.dimensions.height}</strong>
              </div>
            )}
            {currentPhoto.metadata?.camera && (
              <div className="ws-info-row">
                <span>Kamera</span>
                <strong>{currentPhoto.metadata.camera}</strong>
              </div>
            )}
            {currentPhoto.metadata?.dateTimeOriginal && (
              <div className="ws-info-row">
                <span>Tanggal</span>
                <strong>{currentPhoto.metadata.dateTimeOriginal}</strong>
              </div>
            )}
          </div>
          <div className="ws-info-path" title={currentPhoto.sourcePath}>
            <MapPin className="ws-info-path-icon" />
            <span>{currentPhoto.sourcePath}</span>
          </div>
          <div className="ws-info-tip"><HardDrive className="ws-info-tip-icon" /> File asli tetap aman</div>
        </aside>

        <div className="ws-stage">
          <div className="ws-img-wrap">
            <img
              src={currentPhoto.fullUrl || currentPhoto.thumbnailUrl}
              alt={currentPhoto.filename}
              className="ws-main-img"
            />
            <div className="ws-overlay-top">
              <span className="ws-counter">{session.currentIndex + 1} / {session.photos.length}</span>
              <div className="flex items-center gap-2">
                {currentDecision?.aiAnalysis && (
                  <div
                    className="ai-recommendation-chip"
                    title={`Alasan AI: ${currentDecision.aiAnalysis.reasoning}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                    <span>AI: {Math.round(currentDecision.aiAnalysis.confidence * 100)}% Match</span>
                  </div>
                )}
                <StatusBadge classification={currentDecision?.classification || null} size="md" />
              </div>
            </div>
            <div className="ws-overlay-bot">
              <span className="ws-filename">{currentPhoto.filename}</span>
              {currentPhoto.metadata?.camera && (
                <span className="ws-camera">📷 {currentPhoto.metadata.camera}</span>
              )}
            </div>
          </div>
        </div>

        <aside className="ws-thumb-rail" aria-label="Daftar foto">
          <div className="ws-rail-head">
            <span><List className="ws-rail-icon" /> Foto</span>
            <span className="ws-rail-count">{session.photos.length}</span>
          </div>
          <div className="ws-thumb-list" ref={railRef}>
            {session.photos.map((photo, index) => (
              <div
                className="ws-thumb-item"
                key={photo.id}
                ref={index === session.currentIndex ? (element) => element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) : undefined}
              >
                <span className="ws-thumb-index">{index + 1}</span>
                <PhotoThumbnail
                  photo={photo}
                  isActive={index === session.currentIndex}
                  decision={session.decisions[photo.id]}
                  onClick={() => goToPhoto(index)}
                  size="md"
                />
              </div>
            ))}
          </div>
          <div className="ws-rail-nav">
            <button type="button" className="ws-rail-btn" onClick={prevPhoto} disabled={session.currentIndex === 0} title="Foto sebelumnya">↑</button>
            <button type="button" className="ws-rail-btn" onClick={nextPhoto} disabled={session.currentIndex === session.photos.length - 1} title="Foto berikutnya">↓</button>
          </div>
        </aside>
      </main>

      {/* ── Footer Controls ── */}
      <footer className="ws-footer">
        <div className="ws-controls">
          <div className="ws-cls-row">
            {activeCategories.map((cat) => (
              <ClassificationButton
                key={cat.id}
                category={cat}
                selected={currentDecision?.classification === cat.id}
                onClick={() => classifyCurrent(cat.id)}
              />
            ))}

            {/* AI Auto-Sort Action Buttons */}
            {aiSettings.enabled && (
              <div className="ai-actions-group">
                <button
                  type="button"
                  className="ai-single-btn"
                  onClick={autoClassifyCurrentPhoto}
                  disabled={isAIAnalyzing}
                  title="Klasifikasikan foto ini menggunakan AI Vision"
                >
                  <Sparkles className={`w-4 h-4 ${isAIAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAIAnalyzing ? 'Menganalisis...' : 'Auto-Sort AI'}</span>
                </button>

                <button
                  type="button"
                  className="ai-batch-btn"
                  onClick={autoClassifyBatch}
                  disabled={isAIAnalyzing}
                  title="Auto-Sort seluruh foto yang belum dikategorikan"
                >
                  <Bot className="w-4 h-4" />
                  <span>
                    {aiProgress
                      ? `Batch (${aiProgress.current}/${aiProgress.total})`
                      : 'Sort All with AI'}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="ws-bot-row">
            <StarRating rating={currentDecision?.rating || null} onChange={(r) => rateCurrent(r)} />
            {progress.isComplete && (
              <button type="button" className="ws-done-btn" onClick={openConfirmation}>
                <CheckCircle2 className="ws-done-icon" />
                <span>Semua Selesai — Pisahkan Foto</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      <CategorySettingsModal />
      <AISettingsModal />


      <style>{`
        .ws {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          overflow: hidden;
        }

        /* ── Header ── */
        .ws-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
          background: var(--bg-surface);
          border-bottom: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
          z-index: 10;
        }

        .ws-h-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .ws-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          flex-shrink: 0;
        }

        .ws-brand:hover {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
        }

        .ws-logo {
          width: 24px;
          height: 24px;
          background: var(--accent-gold);
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .ws-logo-svg { width: 14px; height: 14px; stroke-width: 2.5; }

        .ws-brand-text {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .ws-folder {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--accent-gold);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ws-h-center {
          flex: 1;
          max-width: 320px;
          margin: 0 16px;
        }

        .ws-h-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ws-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .ws-toggle:hover {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
          background: var(--bg-surface-hover);
        }

        .ws-tog-icon { width: 18px; height: 18px; }
        .ws-tog-icon.on { color: var(--perfect-accent); }

        .ws-review-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--accent-gold);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .ws-review-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
          background: var(--accent-gold-hover);
        }

        .ws-ri { width: 16px; height: 16px; }

        /* ── Body / Photo Stage ── */
        .ws-body {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 12px 16px 12px 20px;
          gap: 18px;
          overflow: hidden;
          background: var(--bg-photo-stage);
        }

        .ws-file-info {
          display: flex;
          flex-direction: column;
          width: 200px;
          align-self: stretch;
          padding: 16px 14px;
          gap: 12px;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-md);
          flex-shrink: 0;
          order: 0;
          overflow: hidden;
        }

        .ws-info-head {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ws-info-icon { width: 16px; height: 16px; color: var(--text-primary); }
        .ws-info-name {
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: var(--accent-gold-muted);
          padding: 4px 6px;
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-xs);
        }

        .ws-info-grid { display: flex; flex-direction: column; gap: 8px; }
        .ws-info-row { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ws-info-row span { color: var(--text-muted); font-size: 0.65rem; font-weight: 600; }
        .ws-info-row strong {
          color: var(--text-primary);
          font-size: 0.72rem;
          font-weight: 700;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ws-info-path {
          display: flex;
          align-items: flex-start;
          gap: 5px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 2px solid var(--border-dark);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          line-height: 1.35;
        }

        .ws-info-path span { overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        .ws-info-path-icon { width: 13px; height: 13px; flex-shrink: 0; color: var(--text-primary); }
        .ws-info-tip { display: flex; align-items: center; gap: 5px; color: var(--perfect-text); font-size: 0.68rem; font-weight: 700; }
        .ws-info-tip-icon { width: 13px; height: 13px; flex-shrink: 0; }

        .ws-thumb-rail {
          display: flex;
          flex-direction: column;
          width: 148px;
          height: 100%;
          padding: 10px;
          gap: 10px;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-md);
          flex-shrink: 0;
          order: 2;
        }

        .ws-rail-head {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .ws-rail-icon { width: 14px; height: 14px; }
        .ws-rail-count { color: var(--text-secondary); font-family: var(--font-mono); }

        .ws-thumb-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          overflow-y: auto;
          min-height: 0;
          padding: 2px;
        }

        .ws-thumb-item {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 100%;
          flex-shrink: 0;
        }

        .ws-thumb-item .thumb {
          width: 112px;
          height: 76px;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
        }
        .ws-thumb-index {
          width: 16px;
          color: var(--text-primary);
          font-size: 0.65rem;
          font-weight: 700;
          text-align: center;
          font-family: var(--font-mono);
        }

        .ws-rail-nav {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding-top: 6px;
          border-top: 2px solid var(--border-dark);
          flex-shrink: 0;
        }

        .ws-rail-btn {
          width: 44px;
          height: 28px;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-xs);
          color: var(--text-primary);
          background: var(--bg-surface);
          font-weight: 800;
        }

        .ws-rail-btn:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
          background: var(--accent-gold);
        }

        .ws-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          position: relative;
          order: 1;
        }

        .ws-img-wrap {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          border: 3px solid var(--border-dark);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          background: #000;
        }

        .ws-main-img {
          max-width: 100%;
          max-height: calc(100vh - 240px);
          object-fit: contain;
          display: block;
        }

        .ws-overlay-top {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .ws-counter {
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
        }

        .ws-overlay-bot {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 6px 12px;
          border-radius: var(--radius-xs);
        }

        .ws-filename {
          font-size: 0.78rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .ws-camera {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* ── Footer Controls ── */
        .ws-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px 16px;
          background: var(--bg-surface);
          border-top: 2.5px solid var(--border-dark);
          box-shadow: 0 -2px 0px var(--border-dark);
          flex-shrink: 0;
          z-index: 10;
        }

        .ws-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 720px;
          width: 100%;
        }

        .ws-cls-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .ws-bot-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .ws-done-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--perfect-accent);
          color: white;
          font-weight: 800;
          font-size: 0.85rem;
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .ws-done-btn:hover {
          transform: translate(-1.5px, -1.5px);
          box-shadow: var(--shadow-lg);
          background: #047857;
        }

        .ws-done-btn:active {
          transform: translate(1.5px, 1.5px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .ws-done-icon { width: 18px; height: 18px; }

        .ai-recommendation-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #FEF3C7;
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.75rem;
          color: #1E1E24;
          box-shadow: var(--shadow-sm);
        }

        .ai-btn {
          background: #FEF3C7 !important;
        }

        .ai-actions-group {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .ai-single-btn, .ai-batch-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-weight: 800;
          font-size: 0.8rem;
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .ai-single-btn {
          background: #FDE047;
          color: #1E1E24;
        }

        .ai-batch-btn {
          background: #EDE9FE;
          color: #1E1E24;
        }

        .ai-single-btn:hover:not(:disabled), .ai-batch-btn:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
        }

        .ai-single-btn:disabled, .ai-batch-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
