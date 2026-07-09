import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { mediaApi } from '@/api/media.api';

export default function ImageUpload({ label, value, onChange, folder = 'misc', hint, error }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await mediaApi.uploadSingle(file, folder);
      const { url, publicId } = res.data.media;
      onChange({ url, publicId });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clear = () => onChange({ url: '', publicId: '' });

  return (
    <div>
      {label && <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>}

      {value?.url ? (
        <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
          <img src={value.url} alt="" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 shadow-soft hover:bg-white"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/60 text-ink-500 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs">PNG, JPG, WebP, SVG — up to 10MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
