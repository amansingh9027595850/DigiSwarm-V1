import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';
import { mediaApi } from '@/api/media.api';

const ToolButton = ({ active, disabled, onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={clsx(
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-600 transition hover:bg-ink-100 hover:text-ink-900',
      active && 'bg-brand-50 text-brand-700 hover:bg-brand-100',
      disabled && 'opacity-40 cursor-not-allowed',
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start writing…', folder = 'content' }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-xl my-3' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none min-h-[220px] focus:outline-none px-4 py-3',
      },
    },
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || '', false);
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await mediaApi.uploadSingle(file, folder);
      editor.chain().focus().setImage({ src: res.data.media.url }).run();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ink-100 bg-ink-50/60 px-2 py-1.5">
        <ToolButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></ToolButton>
        <ToolButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></ToolButton>
        <span className="mx-1 h-5 w-px bg-ink-200" />
        <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolButton>
        <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolButton>
        <ToolButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></ToolButton>
        <span className="mx-1 h-5 w-px bg-ink-200" />
        <ToolButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolButton>
        <ToolButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolButton>
        <ToolButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={15} /></ToolButton>
        <span className="mx-1 h-5 w-px bg-ink-200" />
        <ToolButton label="Link" active={editor.isActive('link')} onClick={setLink}><LinkIcon size={15} /></ToolButton>
        <ToolButton label="Image" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-ink-200" />
        <ToolButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={15} /></ToolButton>
        <ToolButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={15} /></ToolButton>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImage(e.target.files?.[0])}
      />
    </div>
  );
}
