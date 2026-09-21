import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { DEFAULT_CLASSIFICATIONS } from '../../domain/models/Classification';
import { calculateProgress } from '../../domain/services/ProgressCalculator';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Tag, Settings2 } from 'lucide-react';

export const ReviewScreen: React.FC = () => {
  const {
    session,
    categories,
    duplicateStrategy,
    setDuplicateStrategy,
    backToCulling,
    openConfirmation,
  } = useSortingSessionStore();

  if (!session) return null;
  const progress = calculateProgress(session);

  const activeCategories = session.categories && session.categories.length > 0
    ? session.categories
    : (categories && categories.length > 0 ? categories : DEFAULT_CLASSIFICATIONS);

  const getStatIcon = (id: string) => {
    switch (id) {
      case 'PERFECT': return <CheckCircle2 className="rv-stat-icon" />;
      case 'BLUR': return <AlertTriangle className="rv-stat-icon" />;
      case 'POOR': return <XCircle className="rv-stat-icon" />;
      default: return <Tag className="rv-stat-icon" />;
    }
  };

  return (
    <div className="rv">
      <div className="rv-card">
        <header className="rv-head">
          <button type="button" className="rv-back" onClick={backToCulling}>
            <ArrowLeft className="rv-back-icon" />
            <span>Kembali Mengoreksi</span>
          </button>
          <h2 className="rv-title">Ringkasan Keputusan Culling</h2>
          <p className="rv-sub">Tinjau hasil pengelompokan sebelum pemisahan file dijalankan.</p>
        </header>

        <div className="rv-shield">
          <ShieldCheck className="rv-shield-icon" />
          <span>File asli Anda belum disentuh. Pemisahan hanya berupa penyalinan (COPY).</span>
        </div>

        <div className="rv-stats">
          {activeCategories.map((cat) => {
            const colorClass = cat.color || cat.id.toLowerCase();
            const count = progress.classificationCounts[cat.id] || 0;
            return (
              <div key={cat.id} className={`rv-stat ${colorClass}`}>
                <div className="rv-stat-head">{getStatIcon(cat.id)}<span>{cat.label}</span></div>
                <div className="rv-stat-val">{count}</div>
                <div className="rv-stat-sub">📁 {cat.folderName}/</div>
              </div>
            );
          })}
        </div>


        <div className="rv-ratings">
          <h3 className="rv-section">Distribusi Rating Portofolio</h3>
          <div className="rv-bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="rv-bar-row">
                <span className="rv-bar-label">★ {star}</span>
                <div className="rv-bar-track">
                  <div
                    className="rv-bar-fill"
                    style={{
                      width: `${progress.total > 0 ? ((progress.ratingCounts[star] || 0) / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="rv-bar-count">{progress.ratingCounts[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rv-settings">
          <div className="rv-settings-head">
            <Settings2 className="rv-settings-icon" />
            <h3 className="rv-section">Penanganan File Duplikat</h3>
          </div>
          <div className="rv-options">
            <label className={`rv-opt ${duplicateStrategy === 'RENAME' ? 'selected' : ''}`}>
              <input type="radio" name="dup" value="RENAME" checked={duplicateStrategy === 'RENAME'} onChange={() => setDuplicateStrategy('RENAME')} />
              <div className="rv-opt-info">
                <strong>Ubah Nama Otomatis</strong>
                <p>Tambah akhiran _copy jika nama sudah ada.</p>
              </div>
            </label>
            <label className={`rv-opt ${duplicateStrategy === 'SKIP' ? 'selected' : ''}`}>
              <input type="radio" name="dup" value="SKIP" checked={duplicateStrategy === 'SKIP'} onChange={() => setDuplicateStrategy('SKIP')} />
              <div className="rv-opt-info">
                <strong>Lewati (Skip)</strong>
                <p>Jangan salin jika file sudah ada.</p>
              </div>
            </label>
            <label className={`rv-opt ${duplicateStrategy === 'REPLACE' ? 'selected' : ''}`}>
              <input type="radio" name="dup" value="REPLACE" checked={duplicateStrategy === 'REPLACE'} onChange={() => setDuplicateStrategy('REPLACE')} />
              <div className="rv-opt-info">
                <strong>Timpa (Replace)</strong>
                <p>Gantikan file lama dengan file baru.</p>
              </div>
            </label>
          </div>
        </div>

        <footer className="rv-foot">
          <button type="button" className="rv-btn-secondary" onClick={backToCulling}>Kembali Mengoreksi</button>
          <button type="button" className="rv-btn-primary" onClick={openConfirmation} disabled={progress.reviewed === 0}>
            Lanjutkan Ke Konfirmasi Pemisahan
          </button>
        </footer>
      </div>

      <style>{`
        .rv {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          padding: 24px;
          overflow-y: auto;
        }

        .rv-card {
          display: flex;
          flex-direction: column;
          max-width: 660px;
          width: 100%;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-lg);
          padding: 32px;
          gap: 20px;
          box-shadow: var(--shadow-xl);
        }

        .rv-head { display: flex; flex-direction: column; gap: 6px; }

        .rv-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
          align-self: flex-start;
          margin-bottom: 4px;
          padding: 4px 10px;
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-xs);
          transition: transform 0.1s ease;
        }
        .rv-back:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }
        .rv-back-icon { width: 14px; height: 14px; }

        .rv-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
        .rv-sub { font-size: 0.88rem; color: var(--text-secondary); font-weight: 600; }

        .rv-shield {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--perfect-bg);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 11px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--perfect-text);
        }
        .rv-shield-icon { width: 18px; height: 18px; flex-shrink: 0; color: var(--perfect-text); }

        .rv-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }

        .rv-stat {
          padding: 14px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rv-stat.perfect { background: var(--perfect-bg); }
        .rv-stat.blur { background: var(--blur-bg); }
        .rv-stat.poor { background: var(--poor-bg); }
        .rv-stat.custom { background: var(--custom-bg); }

        .rv-stat-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .rv-stat-icon { width: 16px; height: 16px; color: var(--text-primary); }

        .rv-stat-val { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); }
        .rv-stat-sub { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); font-family: var(--font-mono); }

        .rv-section { font-size: 0.9rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }

        .rv-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-app);
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
        }

        .rv-bar-row { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; font-weight: 700; }
        .rv-bar-label { width: 44px; color: var(--star-filled); font-weight: 800; }

        .rv-bar-track {
          flex: 1;
          height: 8px;
          background: var(--bg-surface);
          border: 1.5px solid var(--border-dark);
          border-radius: 4px;
          overflow: hidden;
        }
        .rv-bar-fill { height: 100%; background: var(--star-filled); transition: width 0.2s ease; }
        .rv-bar-count { width: 32px; text-align: right; color: var(--text-primary); font-weight: 700; font-family: var(--font-mono); }

        .rv-settings { display: flex; flex-direction: column; gap: 8px; }
        .rv-settings-head { display: flex; align-items: center; gap: 7px; }
        .rv-settings-icon { width: 16px; height: 16px; color: var(--text-primary); }

        .rv-options { display: flex; flex-direction: column; gap: 10px; }

        .rv-opt {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: transform 0.1s ease, background 0.15s ease;
        }
        .rv-opt:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-sm); }
        .rv-opt.selected { border-color: var(--border-dark); background: var(--accent-gold); box-shadow: var(--shadow-sm); }
        .rv-opt input { margin-top: 3px; accent-color: var(--border-dark); }

        .rv-opt-info strong { display: block; font-size: 0.85rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
        .rv-opt-info p { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }

        .rv-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 2px solid var(--border-dark);
          gap: 12px;
        }

        .rv-btn-primary {
          padding: 11px 20px;
          background: var(--perfect-accent);
          color: white;
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.88rem;
          box-shadow: var(--shadow-md);
          transition: transform 0.1s ease;
        }
        .rv-btn-primary:hover:not(:disabled) { transform: translate(-1.5px, -1.5px); box-shadow: var(--shadow-lg); background: #047857; }

        .rv-btn-secondary {
          padding: 11px 18px;
          background: var(--bg-app);
          color: var(--text-primary);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.85rem;
          transition: transform 0.1s ease;
        }
        .rv-btn-secondary:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }
      `}</style>
    </div>
  );
};
