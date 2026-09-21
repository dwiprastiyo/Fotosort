import React from 'react';
import { Photo } from '../../../domain/models/Photo';
import { PhotoDecision } from '../../../domain/models/PhotoDecision';
import { StatusBadge } from './StatusBadge';

interface PhotoThumbnailProps {
  photo: Photo;
  isActive: boolean;
  decision?: PhotoDecision;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
  photo,
  isActive,
  decision,
  onClick,
  size = 'md',
}) => {
  const imageUrl = photo.thumbnailUrl || photo.fullUrl;

  return (
    <button
      type="button"
      className={`thumb ${isActive ? 'active' : ''} size-${size}`}
      onClick={onClick}
    >
      <div className="thumb-img">
        <img
          src={imageUrl}
          alt={photo.filename}
          loading="lazy"
        />
        {decision && decision.reviewed && (
          <div className="thumb-badge">
            <StatusBadge classification={decision.classification} size="sm" />
          </div>
        )}
        {decision && decision.rating !== null && (
          <div className="thumb-rating">★ {decision.rating}</div>
        )}
      </div>

      <style>{`
        .thumb {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-card);
          border: 1.5px solid var(--border-subtle);
          transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          flex-shrink: 0;
        }

        .thumb:hover {
          border-color: var(--border-focus);
          transform: scale(1.03);
        }

        .thumb.active {
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .size-sm { width: 72px; height: 52px; }
        .size-md { width: 120px; height: 82px; }
        .size-lg { width: 160px; height: 108px; }

        .thumb-img {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .thumb-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .thumb-badge {
          position: absolute;
          bottom: 3px;
          left: 3px;
          right: 3px;
          display: flex;
          justify-content: center;
        }

        .thumb-rating {
          position: absolute;
          top: 3px;
          right: 3px;
          background: rgba(0, 0, 0, 0.70);
          color: var(--star-filled);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: var(--radius-xs);
        }

      `}</style>
    </button>
  );
};
