import { FaTimes } from 'react-icons/fa';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya', cancelText = 'Batal', danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-cream-100 border border-cream-200 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-cream-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-950">{title}</h2>
          <button onClick={onClose} className="text-primary-600 hover:text-primary-950" aria-label="Tutup">✕</button>
        </div>
        <div className="p-6">
          <p className="text-primary-700">{message}</p>
          <div className="flex justify-end gap-3 pt-6">
            <button onClick={onClose} className="btn-secondary px-6 py-2">{cancelText}</button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${danger ? 'bg-red-500 text-white hover:bg-red-600' : 'btn-primary'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
