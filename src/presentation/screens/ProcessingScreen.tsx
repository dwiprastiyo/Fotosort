import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { Loader2, Copy } from 'lucide-react';

export const ProcessingScreen: React.FC = () => {
  const { processingProgress } = useSortingSessionStore();
  const current = processingProgress?.current || 0;
  const total = processingProgress?.total || 1;
  const pct = Math.round((current / total) * 100);

  return (
    <div className="pr">
      <div className="pr-card">
        <div className="pr-icon-pulse">
          <Copy className="pr-copy-icon" />
          <Loader2 className="pr-spinner" />
        </div>

        <h2 className="pr-title">Memisahkan Foto...</h2>
        <p className="pr-sub">Menyalin file foto ke folder klasifikasi masing-masing.</p>

        <div className="pr-progress">
          <div className="pr-counter">
            <span className="pr-count-text">Foto <strong>{current}</strong> dari {total}</span>
            <span className="pr-pct">{pct}%</span>
          </div>
          <div className="pr-bar-track">
            <div className="pr-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {processingProgress && (
          <div className="pr-details">
            <div className="pr-detail-row">
              <span className="pr-dlabel">File saat ini</span>
              <span className="pr-dval mono">{processingProgress.currentFilename}</span>
            </div>
            <div className="pr-detail-row">
              <span className="pr-dlabel">Tujuan</span>
              <span className="pr-dval mono dim">{processingProgress.destination}</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          padding: 24px;
        }

        .pr-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 440px;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          gap: 18px;
          box-shadow: var(--shadow-lg);
        }

        .pr-icon-pulse {
          position: relative;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pr-copy-icon { width: 24px; height: 24px; color: var(--perfect-accent); }

        .pr-spinner {
          position: absolute;
          width: 48px;
          height: 48px;
          color: rgba(16, 185, 129, 0.25);
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .pr-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
        .pr-sub { font-size: 0.85rem; color: var(--text-secondary); }

        .pr-progress { display: flex; flex-direction: column; gap: 7px; width: 100%; }

        .pr-counter {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .pr-count-text strong { color: var(--text-primary); }
        .pr-pct { font-weight: 700; color: var(--accent-gold); font-family: var(--font-mono); }

        .pr-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
          overflow: hidden;
        }

        .pr-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-gold), var(--perfect-accent));
          border-radius: 3px;
          transition: width 0.15s ease-out;
        }

        .pr-details {
          display: flex;
          flex-direction: column;
          gap: 7px;
          width: 100%;
          background: var(--bg-card);
          padding: 11px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          text-align: left;
        }

        .pr-detail-row { display: flex; flex-direction: column; gap: 1px; }

        .pr-dlabel {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pr-dval {
          font-size: 0.78rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pr-dval.mono { font-family: var(--font-mono); font-weight: 600; }
        .pr-dval.dim { color: var(--text-secondary); font-weight: 400; }
      `}</style>
    </div>
  );
};
