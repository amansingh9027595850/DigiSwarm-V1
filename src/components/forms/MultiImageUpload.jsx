import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { mediaApi } from '@/api/media.api';

export default function MultiImageUpload({ label, value = [], onChange, folder = 'gallery', hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (fileList) => {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      const res = await mediaApi.uploadMultiple(Array.from(fileList), folder);
      const items = res.data.media.map((m) => ({ url: m.url, publicId: m.publicId, alt: '' }));
      onChange([...value, ...items]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div>
      {label && <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((item, idx) => (
          <div
            key={`${item.publicId || item.url}-${idx}`}
            className="group relative overflow-hidden rounded-xl border border-ink-200 bg-ink-50"
          >
            <img src={item.url} alt={item.alt} className="aspect-square w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink-700 shadow-soft opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/60 text-ink-500 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-xs font-medium">Add image</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {hint && <p className="mt-2 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
