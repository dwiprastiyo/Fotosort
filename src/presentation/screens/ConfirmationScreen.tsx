import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { DEFAULT_CLASSIFICATIONS } from '../../domain/models/Classification';
import { calculateProgress } from '../../domain/services/ProgressCalculator';
import { AlertCircle, FolderPlus, Copy, ArrowLeft } from 'lucide-react';

export const ConfirmationScreen: React.FC = () => {
  const {
    session,
    categories,
    outputFolder,
    sortName,
    setSortName,
    fileOperation,
    setFileOperation,
    isLoading,
    error,
    selectOutputFolder,
    executeSeparation,
    backToCulling,
  } = useSortingSessionStore();
  if (!session) return null;
  const progress = calculateProgress(session);

  const activeCategories = session.categories && session.categories.length > 0
    ? session.categories
    : (categories && categories.length > 0 ? categories : DEFAULT_CLASSIFICATIONS);

  return (
    <div className="cf-overlay">
      <div className="cf-modal">
        <div className="cf-icon-box"><AlertCircle className="cf-icon" /></div>
        <h2 className="cf-title">Konfirmasi Eksekusi Pemisahan File</h2>
        <p className="cf-desc">
          Anda akan <strong>{fileOperation === 'MOVE' ? 'memindahkan' : 'menyalin'} {progress.reviewed} foto</strong> ke subfolder di folder tujuan:
        </p>
        <div className="cf-path"><code>📁 {outputFolder || 'Belum dipilih'}</code></div>
        <button type="button" className="cf-btn-folder" onClick={selectOutputFolder} disabled={isLoading}>
          <FolderPlus className="cf-aicon" />
          <span>{outputFolder ? 'Ganti Folder Tujuan' : 'Pilih Folder Tujuan'}</span>
        </button>
        {error && <p className="cf-error">{error}</p>}

        <label className="cf-name-field">
          <span>Nama sortir</span>
          <input
            value={sortName}
            onChange={(event) => setSortName(event.target.value)}
            placeholder="Contoh: Wisuda 2026"
            maxLength={80}
          />
          <small>Folder kategori akan dibuat di dalam nama ini.</small>
        </label>

        <div className="cf-operation" role="radiogroup" aria-label="Mode pemrosesan file">
          <span className="cf-operation-label">Mode file</span>
          <label className={fileOperation === 'COPY' ? 'selected' : ''}>
            <input type="radio" name="file-operation" checked={fileOperation === 'COPY'} onChange={() => setFileOperation('COPY')} />
            <Copy className="cf-aicon" />
            <span>Salin, simpan file asli</span>
          </label>
          <label className={fileOperation === 'MOVE' ? 'selected' : ''}>
            <input type="radio" name="file-operation" checked={fileOperation === 'MOVE'} onChange={() => setFileOperation('MOVE')} />
            <Copy className="cf-aicon" />
            <span>Pindahkan, hapus dari sumber</span>
          </label>
        </div>

        <div className="cf-summary">
          <p className="cf-summary-title">Folder tujuan yang akan dibuat:</p>
          <ul className="cf-list">
            {activeCategories.map((cat) => {
              const count = progress.classificationCounts[cat.id] || 0;
              if (count === 0) return null;
              const colorClass = cat.color || cat.id.toLowerCase();
              return (
                <li key={cat.id}>
                  <FolderPlus className={`cf-li-icon ${colorClass}`} />
                  <span><strong>{cat.folderName}/</strong> ({count} foto)</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="cf-actions">
          <button type="button" className="cf-btn-cancel" onClick={backToCulling}>
            <ArrowLeft className="cf-aicon" /><span>Kembali</span>
          </button>
          <button type="button" className="cf-btn-confirm" onClick={executeSeparation} disabled={!outputFolder || !sortName.trim() || isLoading}>
            <Copy className="cf-aicon" /><span>Ya, Mulai Pemisahan Foto</span>
          </button>
        </div>
      </div>


      <style>{`
        .cf-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          padding: 24px;
        }

        .cf-modal {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 520px;
          width: 100%;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          box-shadow: var(--shadow-xl);
        }

        .cf-btn-folder {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 14px;
          margin-bottom: 14px;
          color: var(--text-primary);
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.85rem;
          transition: transform 0.1s ease;
        }
        .cf-btn-folder:hover:not(:disabled) { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); background: var(--accent-gold-hover); }

        .cf-btn-folder:disabled, .cf-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
        .cf-error { width: 100%; color: var(--poor-text); font-size: 0.8rem; font-weight: 700; margin-bottom: 12px; }

        .cf-name-field {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          gap: 6px;
          margin-bottom: 16px;
          text-align: left;
        }
        .cf-name-field > span { color: var(--text-primary); font-size: 0.78rem; font-weight: 800; }
        .cf-name-field input {
          width: 100%;
          padding: 10px 12px;
          color: var(--text-primary);
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          font: inherit;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .cf-name-field input:focus { outline: 2.5px solid var(--border-dark); background: #FFF; }
        .cf-name-field small { color: var(--text-secondary); font-size: 0.7rem; font-weight: 600; }

        .cf-operation { width: 100%; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; text-align: left; }
        .cf-operation-label { color: var(--text-primary); font-size: 0.78rem; font-weight: 800; }
        .cf-operation label { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 2px solid var(--border-dark); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.8rem; font-weight: 700; background: var(--bg-app); cursor: pointer; }
        .cf-operation label.selected { border-color: var(--border-dark); color: var(--text-primary); background: var(--accent-gold); box-shadow: var(--shadow-sm); }
        .cf-operation input { accent-color: var(--border-dark); }

        .cf-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--accent-gold);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .cf-icon { width: 26px; height: 26px; color: var(--text-primary); }

        .cf-title { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
        .cf-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px; font-weight: 600; }
        .cf-desc strong { color: var(--text-primary); }

        .cf-path {
          width: 100%;
          padding: 10px 12px;
          background: var(--accent-gold-muted);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          overflow-x: auto;
          margin-bottom: 16px;
          text-align: left;
        }

        .cf-summary {
          width: 100%;
          text-align: left;
          background: var(--bg-app);
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
        }

        .cf-summary-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cf-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .cf-list li { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
        .cf-li-icon { width: 18px; height: 18px; }
        .cf-li-icon.perfect { color: var(--perfect-accent); }
        .cf-li-icon.blur { color: var(--blur-accent); }
        .cf-li-icon.poor { color: var(--poor-accent); }

        .cf-actions { display: flex; gap: 12px; width: 100%; }

        .cf-btn-cancel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 14px;
          background: var(--bg-app);
          color: var(--text-primary);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.85rem;
          transition: transform 0.1s ease;
        }
        .cf-btn-cancel:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }

        .cf-btn-confirm {
          flex: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 14px;
          background: var(--perfect-accent);
          color: white;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.85rem;
          transition: transform 0.1s ease;
        }
        .cf-btn-confirm:hover:not(:disabled) { transform: translate(-1.5px, -1.5px); box-shadow: var(--shadow-lg); background: #047857; }
      `}</style>
    </div>
  );
};

