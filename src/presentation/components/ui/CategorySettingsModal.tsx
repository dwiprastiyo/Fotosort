import React, { useState } from 'react';
import { useSortingSessionStore } from '../../../application/stores/useSortingSessionStore';
import { ClassificationMeta } from '../../../domain/models/Classification';
import { X, Plus, Trash2, RotateCcw, Save, Settings } from 'lucide-react';

export const CategorySettingsModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    closeCategoryModal,
    categories,
    setCategories,
    resetCategoriesToDefault,
  } = useSortingSessionStore();

  const [localCategories, setLocalCategories] = useState<ClassificationMeta[]>(categories);
  const [newLabel, setNewLabel] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newShortcut, setNewShortcut] = useState('R');
  const [newDescription, setNewDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when modal opens
  React.useEffect(() => {
    if (isCategoryModalOpen) {
      setLocalCategories(categories);
      setErrorMsg('');
    }
  }, [isCategoryModalOpen, categories]);

  if (!isCategoryModalOpen) return null;

  const handleUpdate = (id: string, field: keyof ClassificationMeta, value: string) => {
    setLocalCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleRemove = (id: string) => {
    setLocalCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newLabel.trim() || !newFolderName.trim() || !newShortcut.trim()) {
      setErrorMsg('Nama kategori, nama folder, dan shortcut wajib diisi.');
      return;
    }

    const shortcutUpper = newShortcut.trim().toUpperCase();

    // Reserved keys check
    const reservedKeys = ['1', '2', '3', '4', '5'];
    if (reservedKeys.includes(shortcutUpper)) {
      setErrorMsg(`Tombol shortcut '${shortcutUpper}' digunakan untuk rating bintang.`);
      return;
    }

    // Check duplicate shortcut
    if (localCategories.some((c) => c.shortcut.toUpperCase() === shortcutUpper)) {
      setErrorMsg(`Shortcut '${shortcutUpper}' sudah digunakan oleh kategori lain.`);
      return;
    }

    const newCategory: ClassificationMeta = {
      id: `CAT_${Date.now()}`,
      label: newLabel.trim(),
      folderName: newFolderName.trim().replace(/[\\/:*?"<>|]/g, '_'),
      shortcut: shortcutUpper,
      description: newDescription.trim() || `Folder: ${newFolderName.trim()}`,
      color: 'custom',
      isDefault: false,
    };

    setLocalCategories([...localCategories, newCategory]);
    setNewLabel('');
    setNewFolderName('');
    setNewShortcut('');
    setNewDescription('');
  };

  const handleSave = () => {
    // Validate uniqueness of shortcuts and folder names
    const shortcuts = new Set<string>();
    for (const cat of localCategories) {
      const s = cat.shortcut.toUpperCase().trim();
      if (!s) {
        setErrorMsg('Semua kategori harus memiliki shortcut keyboard.');
        return;
      }
      if (shortcuts.has(s)) {
        setErrorMsg(`Shortcut '${s}' digunakan oleh lebih dari 1 kategori.`);
        return;
      }
      shortcuts.add(s);
    }

    setCategories(localCategories);
    closeCategoryModal();
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua kategori ke pengaturan awal default (Sempurna, Blur, Kurang Bagus)?')) {
      resetCategoriesToDefault();
      closeCategoryModal();
    }
  };

  return (
    <div className="csm-overlay">
      <div className="csm-modal">
        <div className="csm-header">
          <div className="csm-header-title">
            <Settings className="csm-icon" />
            <h3>Pengaturan Kategori Sortir & Folder</h3>
          </div>
          <button type="button" className="csm-btn-close" onClick={closeCategoryModal}>
            <X className="csm-aicon" />
          </button>
        </div>

        <div className="csm-body">
          <p className="csm-desc">
            Sesuaikan nama kategori, nama subfolder hasil pemisahan, dan tombol shortcut keyboard sesuai kebutuhan culling Anda.
          </p>

          {errorMsg && <div className="csm-error">{errorMsg}</div>}

          <div className="csm-list">
            {localCategories.map((cat, idx) => (
              <div key={cat.id} className="csm-row">
                <div className="csm-col-idx">{idx + 1}</div>
                <div className="csm-col-field">
                  <label>Label</label>
                  <input
                    value={cat.label}
                    onChange={(e) => handleUpdate(cat.id, 'label', e.target.value)}
                    placeholder="Nama Kategori"
                  />
                </div>
                <div className="csm-col-field">
                  <label>Nama Folder</label>
                  <input
                    value={cat.folderName}
                    onChange={(e) => handleUpdate(cat.id, 'folderName', e.target.value)}
                    placeholder="Folder Tujuan"
                  />
                </div>
                <div className="csm-col-shortcut">
                  <label>Shortcut</label>
                  <input
                    value={cat.shortcut}
                    maxLength={2}
                    onChange={(e) => handleUpdate(cat.id, 'shortcut', e.target.value.toUpperCase())}
                    placeholder="Key"
                  />
                </div>
                <div className="csm-col-action">
                  {!cat.isDefault && (
                    <button
                      type="button"
                      className="csm-btn-delete"
                      onClick={() => handleRemove(cat.id)}
                      title="Hapus kategori kustom"
                    >
                      <Trash2 className="csm-aicon" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCategory} className="csm-add-form">
            <h4 className="csm-add-title">
              <Plus className="csm-aicon" /> Tambah Kategori Kustom Baru
            </h4>
            <div className="csm-add-grid">
              <input
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                  if (!newFolderName) setNewFolderName(e.target.value);
                }}
                placeholder="Label Kategori (e.g. Cetak)"
              />
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nama Folder (e.g. Siap Cetak)"
              />
              <input
                value={newShortcut}
                maxLength={2}
                onChange={(e) => setNewShortcut(e.target.value.toUpperCase())}
                placeholder="Shortcut (e.g. R)"
              />
              <button type="submit" className="csm-btn-add">
                <Plus className="csm-aicon" /> Tambah
              </button>
            </div>
          </form>
        </div>

        <div className="csm-footer">
          <button type="button" className="csm-btn-reset" onClick={handleReset}>
            <RotateCcw className="csm-aicon" /> Reset Default
          </button>
          <div className="csm-footer-right">
            <button type="button" className="csm-btn-cancel" onClick={closeCategoryModal}>
              Batal
            </button>
            <button type="button" className="csm-btn-save" onClick={handleSave}>
              <Save className="csm-aicon" /> Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .csm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }

        .csm-modal {
          width: 100%;
          max-width: 680px;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .csm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 2.5px solid var(--border-dark);
          background: var(--accent-gold);
        }

        .csm-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
        }
        .csm-header-title h3 {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .csm-icon { width: 22px; height: 22px; color: var(--text-primary); }
        .csm-aicon { width: 16px; height: 16px; }

        .csm-btn-close {
          background: var(--bg-surface);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          color: var(--text-primary);
          padding: 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .csm-btn-close:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }

        .csm-body {
          padding: 20px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--bg-app);
        }

        .csm-desc {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .csm-error {
          padding: 10px 14px;
          background: var(--poor-bg);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          color: var(--poor-text);
          font-size: 0.82rem;
          font-weight: 800;
          box-shadow: var(--shadow-sm);
        }

        .csm-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .csm-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-surface);
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
        }

        .csm-col-idx {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-secondary);
          width: 20px;
        }

        .csm-col-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .csm-col-field label, .csm-col-shortcut label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .csm-col-field input, .csm-col-shortcut input {
          width: 100%;
          padding: 8px 10px;
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-xs);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .csm-col-field input:focus, .csm-col-shortcut input:focus {
          outline: 2.5px solid var(--border-dark);
          background: #FFF;
        }

        .csm-col-shortcut {
          width: 75px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .csm-col-action {
          width: 36px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 16px;
        }

        .csm-btn-delete {
          background: var(--poor-bg);
          color: var(--poor-text);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-xs);
          padding: 7px;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .csm-btn-delete:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }

        .csm-add-form {
          margin-top: 10px;
          background: var(--bg-surface);
          border: 2.5px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .csm-add-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .csm-add-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 85px auto;
          gap: 10px;
        }

        .csm-add-grid input {
          padding: 8px 12px;
          background: var(--bg-app);
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-xs);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .csm-btn-add {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: var(--accent-gold);
          color: var(--text-primary);
          font-weight: 800;
          font-size: 0.82rem;
          border-radius: var(--radius-xs);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .csm-btn-add:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); background: var(--accent-gold-hover); }

        .csm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 2.5px solid var(--border-dark);
          background: var(--bg-surface);
        }

        .csm-footer-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .csm-btn-reset {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-app);
          color: var(--text-primary);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .csm-btn-reset:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }

        .csm-btn-cancel {
          padding: 9px 18px;
          background: var(--bg-app);
          color: var(--text-primary);
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }
        .csm-btn-cancel:hover { transform: translate(-1px, -1px); box-shadow: var(--shadow-md); }

        .csm-btn-save {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          background: var(--perfect-accent);
          color: white;
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: transform 0.1s ease;
        }
        .csm-btn-save:hover { transform: translate(-1.5px, -1.5px); box-shadow: var(--shadow-lg); background: #047857; }
      `}</style>
    </div>
  );
};

