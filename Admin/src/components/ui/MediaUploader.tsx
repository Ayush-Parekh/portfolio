import React, { useState, useRef } from 'react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { UploadCloud, Loader2, Copy, Check, Trash2, FileText } from 'lucide-react';

interface MediaUploaderProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  accept?: string;
  helperText?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*,application/pdf',
  helperText = 'PNG, JPG, WebP, AVIF, or PDF up to 10MB',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      error('File exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await api.uploadFile(file);
      onChange(response.secureUrl);
      success('File uploaded to Cloudinary successfully!');
    } catch (err: any) {
      error(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isPdf = value?.toLowerCase().includes('.pdf');

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative border border-[#262626] light:border-[#C6B7A0] rounded-lg p-3 bg-[#181818] light:bg-[#D5C8B4] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isPdf ? (
              <div className="w-12 h-12 rounded bg-red-900/30 border border-red-500/30 flex items-center justify-center text-[#e91010] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <img
                src={value}
                alt="Uploaded media preview"
                className="w-12 h-12 object-cover rounded border border-neutral-700 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-mono text-neutral-300 light:text-neutral-800 truncate max-w-xs">{value}</p>
              <p className="text-[10px] text-neutral-400">Cloudinary CDN</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyUrl}
              aria-label="Copy media CDN URL to clipboard"
              title="Copy URL"
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove uploaded asset"
              title="Remove asset"
              className="p-1.5 rounded text-neutral-400 hover:text-[#e91010] hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            aria-label={`Select file for ${label}`}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-colors bg-[#141414] light:bg-[#DFD4C2] disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
                <span className="text-xs font-medium">Direct Streaming to Cloudinary...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-200 light:text-neutral-800">
                  Click to Upload or Drag and Drop
                </span>
                <span className="text-[11px] text-neutral-500">{helperText}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
