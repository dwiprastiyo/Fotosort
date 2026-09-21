import React from 'react';
import { useSortingSessionStore } from '../../application/stores/useSortingSessionStore';
import { SessionStatus } from '../../domain/models/SortingSession';
import {
  FolderOpen,
  Layers,
  Sun,
  Menu,
  FileCheck,
  Keyboard,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const {
    selectFolderAndScan,
    resumeSession,
    session,
    hasSavedSession,
    isLoading,
    goHome,
    recentFolders,
    openRecentFolder,
  } = useSortingSessionStore();
  const canContinueSession =
    hasSavedSession ||
    !!(session && session.photos.length > 0 && session.status !== SessionStatus.COMPLETED);

  return (
    <div className="welcome-root">
      {/* ─── Top Navigation ─── */}
      <header className="top-nav">
        <div className="nav-brand" onClick={goHome} title="Ke Beranda (Home)">
          <div className="logo-mark">
            <Layers className="logo-svg" />
          </div>
          <span className="logo-text">FotoSort</span>
        </div>

        <div className="nav-actions">
          <button type="button" className="nav-btn" title="Toggle theme">
            <Sun className="nav-btn-icon" />
          </button>
          <button type="button" className="nav-btn" title="Menu">
            <Menu className="nav-btn-icon" />
          </button>
        </div>
      </header>

      {/* ─── Split Body ─── */}
      <main className="split-body">
        {/* Left Hero */}
        <section className="hero-col">
          <div className="hero-content">
            <span className="kicker">PHOTO CULLING WORKFLOW</span>
            <h1 className="hero-title">Review once.<br />Decide fast.<br />Separate later.</h1>
            <p className="hero-desc">
              FotoSort walks you through a folder one frame at a time. Classify, rate
              for portfolio, and only move files when every decision is made.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn-gold"
                onClick={selectFolderAndScan}
                disabled={isLoading}
              >
                <FolderOpen className="btn-icon" />
                <span>Select folder</span>
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={resumeSession}
                disabled={isLoading || !canContinueSession}
              >
                <span>Continue last session</span>
              </button>
            </div>
          </div>

          <div className="hero-foot">
            <span className="foot-chip">
              <FileCheck className="chip-icon" />
              <span>Originals stay untouched</span>
            </span>
            <span className="foot-chip">
              <Keyboard className="chip-icon" />
              <span>Keyboard-first</span>
            </span>
          </div>
        </section>

        {/* Right Recent Folders */}
        <section className="recent-col">
          <div className="recent-bg" />
          <div className="recent-content">
            <span className="kicker">RECENT FOLDERS</span>

            <div className="recent-list">
              {recentFolders.length === 0 ? (
                <div className="recent-empty">No recent folders yet.</div>
              ) : recentFolders.map((folder) => (
                <button
                  type="button"
                  className="recent-card available"
                  key={folder.path}
                  onClick={() => openRecentFolder(folder.path)}
                  disabled={isLoading}
                >
                  <div className="rc-left">
                    <div className="rc-icon available"><FolderOpen className="rc-svg" /></div>
                    <div className="rc-info">
                      <span className="rc-title">{folder.name}</span>
                      <span className="rc-meta" title={folder.path}>{folder.path}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .welcome-root {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;
          background-color: var(--bg-app);
          overflow: hidden;
          color: var(--text-primary);
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 32px;
          background: var(--bg-surface);
          border-bottom: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          position: relative;
          z-index: 10;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent-gold);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .logo-svg { width: 18px; height: 18px; stroke-width: 2.5; }

        .logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          color: var(--text-primary);
        }

        .nav-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: var(--shadow-md);
          background: var(--bg-surface-hover);
        }

        .nav-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .nav-btn-icon { width: 18px; height: 18px; }

        .split-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          height: calc(100vh - 60px);
          overflow: hidden;
        }

        /* ── Left Hero ── */
        .hero-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 64px 56px 44px 56px;
          background-color: var(--bg-app);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          max-width: 480px;
        }

        .kicker {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-primary);
          background: var(--accent-gold);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          margin-bottom: 24px;
          width: fit-content;
        }

        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 36px;
          max-width: 440px;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 24px;
          background: var(--accent-gold);
          color: var(--text-primary);
          font-weight: 800;
          font-size: 0.95rem;
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
        }

        .btn-gold:hover:not(:disabled) {
          background: var(--accent-gold-hover);
          transform: translate(-1.5px, -1.5px);
          box-shadow: var(--shadow-lg);
        }

        .btn-gold:active:not(:disabled) {
          transform: translate(1.5px, 1.5px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 13px 22px;
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 2.5px solid var(--border-dark);
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .btn-ghost:hover:not(:disabled) {
          color: var(--text-primary);
          background: var(--bg-surface-hover);
          transform: translate(-1.5px, -1.5px);
          box-shadow: var(--shadow-md);
        }

        .btn-ghost:active:not(:disabled) {
          transform: translate(1.5px, 1.5px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .btn-icon { width: 18px; height: 18px; }

        .hero-foot {
          display: flex;
          align-items: center;
          gap: 18px;
          padding-top: 24px;
          border-top: 2px solid var(--border-dark);
        }

        .foot-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
        }

        .chip-icon { width: 14px; height: 14px; color: var(--text-primary); }

        /* ── Right Recent Folders ── */
        .recent-col {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 64px 52px;
          border-left: 2.5px solid var(--border-dark);
          background: #FAF7F0;
          overflow: hidden;
        }

        .recent-bg {
          display: none;
        }

        .recent-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: 460px;
          width: 100%;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recent-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
        }

        .recent-card.available:hover {
          background: var(--bg-surface-hover);
          transform: translate(-1.5px, -1.5px);
          box-shadow: var(--shadow-lg);
        }

        .recent-card.available:active {
          transform: translate(1.5px, 1.5px);
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .recent-card.empty {
          opacity: 0.85;
          box-shadow: var(--shadow-sm);
        }

        .recent-card.unavailable {
          opacity: 0.60;
          cursor: not-allowed;
          box-shadow: none;
        }

        .rc-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .rc-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          background: var(--accent-gold);
          border: 2px solid var(--border-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          flex-shrink: 0;
          box-shadow: 1.5px 1.5px 0px var(--border-dark);
        }

        .rc-icon.unavailable {
          background: var(--poor-bg);
          border-color: var(--border-dark);
          color: var(--poor-accent);
        }

        .rc-svg { width: 20px; height: 20px; stroke-width: 2.2; }
        .rc-svg.warn { color: var(--poor-accent); }

        .rc-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .rc-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rc-meta {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .rc-chevron {
          width: 18px;
          height: 18px;
          color: var(--text-primary);
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .recent-card.available:hover .rc-chevron {
          transform: translateX(3px);
        }

        @media (max-width: 900px) {
          .split-body { grid-template-columns: 1fr; }
          .recent-col { display: none; }
        }
      `}</style>
    </div>
  );
};
