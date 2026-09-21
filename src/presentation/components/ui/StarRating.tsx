import React, { useState } from 'react';
import { PortfolioRating } from '../../../domain/models/PortfolioRating';
import { Star } from 'lucide-react';
import { KeyboardShortcutHint } from './KeyboardShortcutHint';

interface StarRatingProps {
  rating: PortfolioRating;
  onChange: (rating: PortfolioRating) => void;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (disabled) return;
    if (rating === value) {
      onChange(null);
    } else {
      onChange(value as PortfolioRating);
    }
  };

  return (
    <div className="sr-wrap">
      <div className="sr-label-row">
        <span className="sr-label">Rating Portofolio</span>
        <KeyboardShortcutHint shortcut="1–5" label="opsional" />
      </div>

      <div className="sr-stars">
        {[1, 2, 3, 4, 5].map((v) => {
          const isFilled = (hoverValue !== null ? hoverValue : rating || 0) >= v;
          return (
            <button
              key={v}
              type="button"
              className={`star ${isFilled ? 'on' : ''}`}
              onMouseEnter={() => !disabled && setHoverValue(v)}
              onMouseLeave={() => !disabled && setHoverValue(null)}
              onClick={() => handleClick(v)}
              disabled={disabled}
              title={`${v} bintang`}
            >
              <Star className="star-svg" />
            </button>
          );
        })}
        {rating !== null && (
          <button
            type="button"
            className="sr-clear"
            onClick={() => onChange(null)}
            disabled={disabled}
            title="Hapus rating"
          >
            Hapus
          </button>
        )}
      </div>

      <style>{`
        .sr-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .sr-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sr-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sr-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .star {
          padding: 5px;
          border-radius: var(--radius-xs);
          color: var(--star-empty);
          transition: color 0.12s ease, transform 0.12s ease;
        }

        .star:hover:not(:disabled) {
          transform: scale(1.18);
          color: var(--star-hover);
        }

        .star.on {
          color: var(--star-filled);
        }

        .star-svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .sr-clear {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-left: 8px;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .sr-clear:hover { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};
