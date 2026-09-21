import React from 'react';
import { Layers, Loader2 } from 'lucide-react';

export const ScanningScreen: React.FC = () => {
  return (
    <div className="sc">
      <div className="sc-box">
        <div className="sc-logo-wrap">
          <div className="sc-logo">
            <Layers className="sc-logo-svg" />
          </div>
          <Loader2 className="sc-spinner" />
        </div>
        <h2 className="sc-title">Memindai Folder Foto...</h2>
        <p className="sc-desc">Mendeteksi file foto yang didukung (JPG, PNG, HEIC) dan membuat pratayang.</p>
        <div className="sc-dots">
          <span className="sc-dot" />
          <span className="sc-dot" />
          <span className="sc-dot" />
        </div>
      </div>

      <style>{`
        .sc {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: var(--bg-app);
        }

        .sc-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .sc-logo-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .sc-logo {
          width: 44px;
          height: 44px;
          background: var(--accent-gold);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .sc-logo-svg { width: 24px; height: 24px; stroke-width: 2; }

        .sc-spinner {
          position: absolute;
          width: 60px;
          height: 60px;
          color: rgba(219, 181, 107, 0.25);
          animation: spin 1s linear infinite;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .sc-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }
        .sc-desc { font-size: 0.85rem; color: var(--text-secondary); max-width: 360px; }

        .sc-dots {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .sc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-gold);
          opacity: 0.3;
          animation: pulse-dot 1.2s ease-in-out infinite;
        }

        .sc-dot:nth-child(2) { animation-delay: 0.15s; }
        .sc-dot:nth-child(3) { animation-delay: 0.30s; }

        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
