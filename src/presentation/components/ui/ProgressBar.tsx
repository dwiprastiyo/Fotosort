import React from 'react';

interface ProgressBarProps {
  reviewed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ reviewed, total }) => {
  const pct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  return (
    <div className="prog">
      <div className="prog-row">
        <span className="prog-text">
          <strong>{reviewed}</strong> / {total} foto
        </span>
        <span className="prog-pct">{pct}%</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%` }} />
      </div>

      <style>{`
        .prog {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 200px;
        }

        .prog-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .prog-text strong { color: var(--text-primary); }

        .prog-pct {
          font-weight: 700;
          color: var(--accent-gold);
          font-size: 0.75rem;
        }

        .prog-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .prog-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-gold), var(--perfect-accent));
          border-radius: 2px;
          transition: width 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};
