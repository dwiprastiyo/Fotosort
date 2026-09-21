import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { DEFAULT_CLASSIFICATIONS } from '../../domain/models/Classification';
import { CheckCircle, AlertTriangle, RefreshCw, AlertOctagon } from 'lucide-react';

export const CompletionScreen: React.FC = () => {
  const { session, categories, processingResult, resetSession } = useSortingSessionStore();
  if (!processingResult) return null;

  const hasFailures = processingResult.failed > 0;
  const activeCategories = session?.categories && session.categories.length > 0
    ? session.categories
    : (categories && categories.length > 0 ? categories : DEFAULT_CLASSIFICATIONS);

  return (
    <div className="cm">
      <div className="cm-card">
        <div className={`cm-banner ${hasFailures ? 'warn' : 'ok'}`}>
          {hasFailures ? <AlertTriangle className="cm-banner-icon" /> : <CheckCircle className="cm-banner-icon" />}
        </div>

        <h2 className="cm-title">
          {hasFailures ? 'Pemisahan Selesai Dengan Catatan' : 'Pemisahan Foto Berhasil!'}
        </h2>
        <p className="cm-sub">
          {processingResult.successful} foto berhasil dipisahkan ke folder tujuan masing-masing.
        </p>

        <div className="cm-grid">
          {activeCategories.map((cat) => {
            const count = processingResult.categoryTotals[cat.id] || 0;
            const colorClass = cat.color || cat.id.toLowerCase();
            return (
              <div key={cat.id} className={`cm-result ${colorClass}`}>
                <span className="cm-label">{cat.label}</span>
                <span className="cm-count">{count}</span>
                <span className="cm-folder">📁 {cat.folderName}/</span>
              </div>
            );
          })}
        </div>


        {hasFailures && (
          <div className="cm-errors">
            <div className="cm-errors-head">
              <AlertOctagon className="cm-err-icon" />
              <h3>{processingResult.failed} File Gagal</h3>
            </div>
            <div className="cm-errors-list">
              {processingResult.errors.map((err, i) => (
                <div key={i} className="cm-err-item">
                  <strong>{err.sourcePath.split(/[\/\\]/).pop()}</strong>
                  <p>{err.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="cm-foot">
          <button type="button" className="cm-btn" onClick={resetSession}>
            <RefreshCw className="cm-btn-icon" />
            <span>Mulai Sesi Culling Baru</span>
          </button>
        </footer>
      </div>

      <style>{`
        .cm {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          padding: 24px;
        }

        .cm-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 540px;
          width: 100%;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-lg);
          padding: 36px 30px;
          gap: 18px;
          box-shadow: var(--shadow-xl);
        }

        .cm-banner {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cm-banner.ok {
          background: var(--perfect-bg);
        }
        .cm-banner.warn {
          background: var(--blur-bg);
        }

        .cm-banner-icon { width: 30px; height: 30px; }
        .cm-banner.ok .cm-banner-icon { color: var(--perfect-text); }
        .cm-banner.warn .cm-banner-icon { color: var(--blur-text); }

        .cm-title { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); }
        .cm-sub { font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); }

        .cm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; width: 100%; }

        .cm-result {
          display: flex;
          flex-direction: column;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          gap: 3px;
          text-align: left;
        }
        .cm-result.perfect { background: var(--perfect-bg); }
        .cm-result.blur { background: var(--blur-bg); }
        .cm-result.poor { background: var(--poor-bg); }
        .cm-result.custom { background: var(--custom-bg); }

        .cm-label { font-size: 0.72rem; color: var(--text-primary); font-weight: 800; }
        .cm-count { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); }
        .cm-folder { font-size: 0.68rem; color: var(--text-secondary); font-family: var(--font-mono); font-weight: 600; }

        .cm-errors {
          width: 100%;
          text-align: left;
          background: var(--poor-bg);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
          padding: 14px 16px;
        }

        .cm-errors-head {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--poor-text);
          margin-bottom: 8px;
        }
        .cm-errors-head h3 { font-size: 0.88rem; font-weight: 800; }
        .cm-err-icon { width: 18px; height: 18px; }

        .cm-errors-list { display: flex; flex-direction: column; gap: 6px; max-height: 100px; overflow-y: auto; }
        .cm-err-item strong { display: block; font-size: 0.78rem; color: var(--text-primary); font-family: var(--font-mono); }
        .cm-err-item p { font-size: 0.72rem; color: var(--text-secondary); }

        .cm-foot { width: 100%; margin-top: 6px; }

        .cm-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 20px;
          background: var(--accent-gold);
          color: var(--text-primary);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 0.9rem;
          transition: transform 0.1s ease;
        }
        .cm-btn:hover { transform: translate(-1.5px, -1.5px); box-shadow: var(--shadow-lg); background: var(--accent-gold-hover); }
        .cm-btn:active { transform: translate(1.5px, 1.5px); box-shadow: 1px 1px 0px var(--border-dark); }
        .cm-btn-icon { width: 18px; height: 18px; }
      `}</style>
    </div>
  );
};

