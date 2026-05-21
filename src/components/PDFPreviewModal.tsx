import React, { useEffect, useMemo } from 'react';
import { Download, X } from 'lucide-react';
import { downloadBlob } from '../lib/exportEstimatePDF';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  fileName: string;
}

function PDFPreviewModal({ isOpen, onClose, pdfBlob, fileName }: PDFPreviewModalProps): React.JSX.Element | null {
  const pdfUrl = useMemo(
    () => (pdfBlob ? URL.createObjectURL(pdfBlob) : null),
    [pdfBlob],
  );

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (!isOpen || !pdfBlob || !pdfUrl) return null;

  function handleDownload(): void {
    downloadBlob(pdfBlob!, fileName);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="PDF Preview"
    >
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">PDF Preview</h3>
            <p className="text-sm text-slate-500">{fileName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 overflow-hidden bg-slate-100 p-4">
          <iframe
            src={pdfUrl}
            className="h-full w-full rounded-2xl border border-slate-200"
            title="PDF Preview"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PDFPreviewModal;
