import React from 'react';
import { Classification, ClassificationMeta, CLASSIFICATION_CONFIG } from '../../../domain/models/Classification';
import { KeyboardShortcutHint } from './KeyboardShortcutHint';
import { CheckCircle2, AlertTriangle, XCircle, Tag } from 'lucide-react';

interface ClassificationButtonProps {
  classification?: Classification;
  category?: ClassificationMeta;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ClassificationButton: React.FC<ClassificationButtonProps> = ({
  classification,
  category,
  selected,
  disabled = false,
  onClick,
}) => {
  const config = category || (classification ? CLASSIFICATION_CONFIG[classification] : null);

  if (!config) return null;

  const getIcon = () => {
    switch (config.id) {
      case Classification.PERFECT:
        return <CheckCircle2 className="btn-icon" />;
      case Classification.BLUR:
        return <AlertTriangle className="btn-icon" />;
      case Classification.POOR:
        return <XCircle className="btn-icon" />;
      default:
        return <Tag className="btn-icon" />;
    }
  };

  const colorClass = config.color || (config.id ? config.id.toLowerCase() : 'custom');

  return (
    <button
      className={`cls-btn ${colorClass} ${selected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      title={`${config.label} (${config.description || config.folderName})`}
    >
      <div className="cls-top">
        <KeyboardShortcutHint shortcut={config.shortcut} />
        {getIcon()}
      </div>
      <div className="cls-body">
        <span className="cls-label">{config.label}</span>
        <span className="cls-folder">📁 {config.folderName}/</span>
      </div>

      <style>{`
        .cls-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          min-width: 130px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .cls-btn:hover:not(:disabled) {
          transform: translate(-1.5px, -1.5px);
          box-shadow: var(--shadow-md);
          background: var(--bg-surface-hover);
        }

        .cls-btn:active:not(:disabled) {
          transform: translate(1.5px, 1.5px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .cls-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 8px;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          color: var(--text-primary);
          opacity: 0.7;
          transition: opacity 0.15s ease, color 0.15s ease;
        }

        .cls-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cls-label {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          transition: color 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cls-folder {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Perfect */
        .cls-btn.perfect.selected {
          background: var(--perfect-bg);
          border-color: var(--border-dark);
          box-shadow: var(--shadow-md);
        }
        .cls-btn.perfect.selected .cls-label { color: var(--perfect-text); }
        .cls-btn.perfect.selected .btn-icon { color: var(--perfect-text); opacity: 1; }

        /* Blur */
        .cls-btn.blur.selected {
          background: var(--blur-bg);
          border-color: var(--border-dark);
          box-shadow: var(--shadow-md);
        }
        .cls-btn.blur.selected .cls-label { color: var(--blur-text); }
        .cls-btn.blur.selected .btn-icon { color: var(--blur-text); opacity: 1; }

        /* Poor */
        .cls-btn.poor.selected {
          background: var(--poor-bg);
          border-color: var(--border-dark);
          box-shadow: var(--shadow-md);
        }
        .cls-btn.poor.selected .cls-label { color: var(--poor-text); }
        .cls-btn.poor.selected .btn-icon { color: var(--poor-text); opacity: 1; }

        /* Custom Category Fallback */
        .cls-btn.custom.selected,
        .cls-btn:not(.perfect):not(.blur):not(.poor).selected {
          background: var(--custom-bg);
          border-color: var(--border-dark);
          box-shadow: var(--shadow-md);
        }
        .cls-btn.custom.selected .cls-label,
        .cls-btn:not(.perfect):not(.blur):not(.poor).selected .cls-label { color: var(--custom-text); }
        .cls-btn.custom.selected .btn-icon,
        .cls-btn:not(.perfect):not(.blur):not(.poor).selected .btn-icon { color: var(--custom-text); opacity: 1; }
      `}</style>
    </button>
  );
};


