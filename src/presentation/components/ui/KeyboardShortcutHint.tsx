import React from 'react';

interface KeyboardShortcutHintProps {
  shortcut: string;
  label?: string;
}

export const KeyboardShortcutHint: React.FC<KeyboardShortcutHintProps> = ({ shortcut, label }) => {
  return (
    <span className="shortcut-hint">
      <kbd className="key">{shortcut}</kbd>
      {label && <span className="key-label">{label}</span>}
      <style>{`
        .shortcut-hint {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        .key {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-secondary);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .key-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      `}</style>
    </span>
  );
};
