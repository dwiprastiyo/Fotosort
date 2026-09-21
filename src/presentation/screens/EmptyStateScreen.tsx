import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { FolderSearch, AlertTriangle, ArrowLeft } from 'lucide-react';

export const EmptyStateScreen: React.FC = () => {
  const { resetSession, error } = useSortingSessionStore();

  return (
    <div className="es">
      <div className="es-card">
        <div className="es-icon-box info">
          <FolderSearch className="es-icon" />
        </div>
        <h2 className="es-title">Tidak Ada Foto Ditemukan</h2>
        <p className="es-desc">{error || 'Folder yang dipilih tidak berisi file foto dengan format yang didukung (JPG, PNG, HEIC).'}</p>
        <button type="button" className="es-btn" onClick={resetSession}>
          <ArrowLeft className="es-btn-icon" />
          <span>Pilih Folder Lain</span>
        </button>
      </div>

      <style>{`
        .es {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          padding: 24px;
        }

        .es-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 400px;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          gap: 14px;
          box-shadow: var(--shadow-lg);
        }

        .es-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .es-icon-box.info { background: rgba(59, 130, 246, 0.10); color: #60a5fa; }
        .es-icon-box.error { background: rgba(244, 63, 94, 0.10); color: var(--poor-accent); }
        .es-icon { width: 24px; height: 24px; }

        .es-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
        .es-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

        .es-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 11px 16px;
          background: var(--text-primary);
          color: var(--text-inverse);
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
          margin-top: 6px;
          transition: all 0.12s ease;
        }
        .es-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .es-btn-icon { width: 16px; height: 16px; }
      `}</style>
    </div>
  );
};

export const ErrorStateScreen: React.FC = () => {
  const { resetSession, error } = useSortingSessionStore();

  return (
    <div className="es">
      <div className="es-card">
        <div className="es-icon-box error">
          <AlertTriangle className="es-icon" />
        </div>
        <h2 className="es-title">Terjadi Kesalahan</h2>
        <p className="es-desc">{error || 'Terjadi kesalahan sistem saat mengakses folder atau file.'}</p>
        <button type="button" className="es-btn" onClick={resetSession}>
          <ArrowLeft className="es-btn-icon" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <style>{`
        .es {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
          padding: 24px;
        }

        .es-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 400px;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          gap: 14px;
          box-shadow: var(--shadow-lg);
        }

        .es-icon-box { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .es-icon-box.error { background: rgba(244, 63, 94, 0.10); color: var(--poor-accent); }
        .es-icon { width: 24px; height: 24px; }

        .es-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
        .es-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

        .es-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 11px 16px;
          background: var(--text-primary);
          color: var(--text-inverse);
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
          margin-top: 6px;
          transition: all 0.12s ease;
        }
        .es-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .es-btn-icon { width: 16px; height: 16px; }
      `}</style>
    </div>
  );
};
