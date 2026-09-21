import React from 'react';
import { Classification, CLASSIFICATION_CONFIG } from '../../../domain/models/Classification';
import { useSortingSessionStore } from '../../../application/stores/useSortingSessionStore';
import { CheckCircle2, AlertTriangle, XCircle, Tag } from 'lucide-react';

interface StatusBadgeProps {
  classification: Classification | null;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ classification, size = 'md' }) => {
  const { session, categories } = useSortingSessionStore();

  if (!classification) {
    return (
      <span className={`sbadge unreviewed size-${size}`}>
        Belum Diklasifikasi
      </span>
    );
  }

  const activeCategories = session?.categories || categories || [];
  const meta = activeCategories.find((c) => c.id === classification) || CLASSIFICATION_CONFIG[classification];

  const label = meta ? meta.label : classification;
  const colorClass = meta?.color || classification.toLowerCase();

  const getIcon = () => {
    switch (classification) {
      case Classification.PERFECT:
        return <CheckCircle2 className="sbadge-icon" />;
      case Classification.BLUR:
        return <AlertTriangle className="sbadge-icon" />;
      case Classification.POOR:
        return <XCircle className="sbadge-icon" />;
      default:
        return <Tag className="sbadge-icon" />;
    }
  };

  return (
    <span className={`sbadge ${colorClass} size-${size}`}>
      {getIcon()}
      <span>{label}</span>
      <style>{`
        .sbadge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          letter-spacing: 0.01em;
          border: 1px solid transparent;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .size-sm { padding: 1px 7px; font-size: 0.68rem; }
        .size-md { padding: 3px 10px; font-size: 0.78rem; }
        .size-lg { padding: 5px 14px; font-size: 0.9rem; }

        .sbadge-icon { width: 13px; height: 13px; }
        .size-lg .sbadge-icon { width: 16px; height: 16px; }

        .unreviewed {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .perfect {
          background: rgba(16, 185, 129, 0.14);
          color: var(--perfect-text);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .blur {
          background: rgba(245, 158, 11, 0.14);
          color: var(--blur-text);
          border-color: rgba(245, 158, 11, 0.25);
        }

        .poor {
          background: rgba(244, 63, 94, 0.14);
          color: var(--poor-text);
          border-color: rgba(244, 63, 94, 0.25);
        }

        /* Custom Category Badge Styling */
        .sbadge.custom,
        .sbadge:not(.perfect):not(.blur):not(.poor):not(.unreviewed) {
          background: rgba(244, 201, 93, 0.14);
          color: var(--accent-gold);
          border-color: rgba(244, 201, 93, 0.3);
        }
      `}</style>
    </span>
  );
};

