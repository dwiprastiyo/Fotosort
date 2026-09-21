import React, { useState } from 'react';
import { useSortingSessionStore } from '../../../application/stores/useSortingSessionStore';
import { Sparkles, Key, Check, X, ShieldAlert, Cpu } from 'lucide-react';

export const AISettingsModal: React.FC = () => {
  const { isAISettingsModalOpen, closeAISettingsModal, aiSettings, setAISettings } =
    useSortingSessionStore();

  const [provider, setProvider] = useState<'gemini' | 'openai'>(aiSettings.provider);
  const [apiKey, setApiKey] = useState(aiSettings.apiKey);
  const [model, setModel] = useState(aiSettings.model);
  const [autoConfidenceThreshold, setAutoConfidenceThreshold] = useState(
    aiSettings.autoConfidenceThreshold
  );
  const [enabled, setEnabled] = useState(aiSettings.enabled);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isAISettingsModalOpen) return null;

  const handleSave = () => {
    setAISettings({
      enabled,
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'),
      autoConfidenceThreshold,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      closeAISettingsModal();
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="ai-badge-icon">
              <Sparkles className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h2 className="modal-title">Pengaturan Auto-Sort AI</h2>
              <p className="modal-subtitle">Gunakan AI Vision milik Anda untuk menyortir foto otomatis</p>
            </div>
          </div>
          <button onClick={closeAISettingsModal} className="close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          {/* Toggle Enable AI */}
          <div className="setting-box flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm block text-gray-900">Aktifkan Fitur AI</span>
              <span className="text-xs text-gray-600 block">
                Tampilkan tombol sortir otomatis di ruang kerja
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Provider Selection */}
          <div className="field-group">
            <label className="field-label">Penyedia AI (Vision Model)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`provider-card ${provider === 'gemini' ? 'active' : ''}`}
                onClick={() => {
                  setProvider('gemini');
                  setModel('gemini-1.5-flash');
                }}
              >
                <Cpu className="w-5 h-5 text-emerald-700" />
                <div className="text-left">
                  <div className="font-extrabold text-sm">Google Gemini</div>
                  <div className="text-[11px] text-emerald-800 font-bold">Gratis & Sangat Cepat</div>
                </div>
              </button>

              <button
                type="button"
                className={`provider-card ${provider === 'openai' ? 'active' : ''}`}
                onClick={() => {
                  setProvider('openai');
                  setModel('gpt-4o-mini');
                }}
              >
                <Sparkles className="w-5 h-5 text-purple-700" />
                <div className="text-left">
                  <div className="font-extrabold text-sm">OpenAI GPT-4o</div>
                  <div className="text-[11px] text-purple-800 font-bold">Akurasi Tinggi</div>
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="field-group">
            <label className="field-label flex items-center justify-between">
              <span>{provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}</span>
              <a
                href={
                  provider === 'gemini'
                    ? 'https://aistudio.google.com/app/apikey'
                    : 'https://platform.openai.com/api-keys'
                }
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-amber-800 hover:underline"
              >
                Dapatkan API Key Gratis ↗
              </a>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                className="input-neubrutal pl-9 font-mono text-sm"
              />
            </div>
            <p className="privacy-note">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 inline mr-1" />
              API Key Anda disimpan secara privat di komputer Anda (tidak dikirim ke server FotoSort).
            </p>
          </div>

          {/* Model selection */}
          <div className="field-group">
            <label className="field-label">Model Nama</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. gemini-1.5-flash"
              className="input-neubrutal text-sm font-mono"
            />
          </div>

          {/* Confidence threshold */}
          <div className="field-group">
            <label className="field-label flex justify-between">
              <span>Batas Keyakinan Auto-Sort ({Math.round(autoConfidenceThreshold * 100)}%)</span>
              <span className="text-xs text-gray-500">Minimal kepastian untuk otomatisasi</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={autoConfidenceThreshold}
              onChange={(e) => setAutoConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button onClick={closeAISettingsModal} className="btn-cancel">
            Batal
          </button>
          <button onClick={handleSave} className="btn-save flex items-center gap-1.5">
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" /> Tersimpan!
              </>
            ) : (
              <>Simpan Pengaturan AI</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(30, 30, 36, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .modal-card {
          background: var(--bg-card, #FFFFFF);
          border: 2.5px solid var(--border-dark, #1E1E24);
          box-shadow: var(--shadow-lg, 5px 5px 0px #1E1E24);
          border-radius: var(--radius-lg, 12px);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          animation: popIn 0.15s ease-out;
        }

        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          background: #FEF3C7;
          border-bottom: 2.5px solid var(--border-dark, #1E1E24);
        }

        .ai-badge-icon {
          background: #FDE047;
          border: 2px solid var(--border-dark, #1E1E24);
          padding: 6px;
          border-radius: var(--radius-sm, 6px);
          box-shadow: 2px 2px 0px #1E1E24;
        }

        .modal-title {
          font-weight: 900;
          font-size: 1.1rem;
          color: #1E1E24;
          margin: 0;
          line-height: 1.2;
        }

        .modal-subtitle {
          font-size: 0.78rem;
          color: #4B5563;
          font-weight: 600;
          margin: 0;
        }

        .close-btn {
          background: #FFFFFF;
          border: 2px solid var(--border-dark, #1E1E24);
          border-radius: var(--radius-sm, 6px);
          padding: 4px;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .close-btn:hover {
          transform: translate(-1px, -1px);
          background: #FEE2E2;
        }

        .modal-body {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .setting-box {
          background: var(--bg-app, #FDFBF7);
          border: 2px solid var(--border-dark, #1E1E24);
          padding: 10px 14px;
          border-radius: var(--radius-md, 8px);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #E5E7EB;
          border: 2px solid #1E1E24;
          transition: .2s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: #1E1E24;
          transition: .2s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: #FDE047; }
        input:checked + .slider:before { transform: translateX(20px); }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          font-weight: 800;
          font-size: 0.8rem;
          color: #1E1E24;
        }

        .provider-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--bg-app, #FDFBF7);
          border: 2px solid var(--border-dark, #1E1E24);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .provider-card.active {
          background: #FEF3C7;
          box-shadow: 2.5px 2.5px 0px #1E1E24;
          transform: translate(-1px, -1px);
        }

        .input-neubrutal {
          width: 100%;
          padding: 8px 12px;
          background: #FFFFFF;
          border: 2px solid var(--border-dark, #1E1E24);
          border-radius: var(--radius-md, 8px);
          font-weight: 600;
          color: #1E1E24;
          outline: none;
        }
        .input-neubrutal:focus {
          box-shadow: 2.5px 2.5px 0px #1E1E24;
        }

        .privacy-note {
          font-size: 0.72rem;
          color: #6B7280;
          font-weight: 600;
          margin-top: 2px;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          background: var(--bg-app, #FDFBF7);
          border-top: 2.5px solid var(--border-dark, #1E1E24);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cancel {
          padding: 8px 16px;
          background: #FFFFFF;
          border: 2px solid var(--border-dark, #1E1E24);
          border-radius: var(--radius-sm, 6px);
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .btn-save {
          padding: 8px 18px;
          background: #FDE047;
          border: 2px solid var(--border-dark, #1E1E24);
          box-shadow: 2px 2px 0px #1E1E24;
          border-radius: var(--radius-sm, 6px);
          font-weight: 900;
          font-size: 0.82rem;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .btn-save:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px #1E1E24;
        }
      `}</style>
    </div>
  );
};
