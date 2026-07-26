import React, { useEffect, useRef,useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { useAuth } from '@/context/AuthContext';
import { createInsight, updateInsight } from '@/services/insightService';
import { uploadMedia } from '@/services/propertyService';
import type { Insight } from '@/types';

interface InsightFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  insight?: Insight;
}

const CATEGORIES = ['Market Outlook', 'Investment Guide', 'Analisis', 'Tips & Trik', 'Berita'];

export const InsightFormModal: React.FC<InsightFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  insight
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (insight) {
      setTitle(insight.title);
      setSlug(insight.slug);
      setCategory(insight.category);
      setExcerpt(insight.excerpt);
      setBody(insight.body);
      setCoverImage(insight.coverImage || '');
      setStatus(insight.status);
    } else {
      setTitle('');
      setSlug('');
      setCategory(CATEGORIES[0]);
      setExcerpt('');
      setBody('');
      setCoverImage('');
      setStatus('draft');
    }
  }, [insight, isOpen]);

  // Update editor content when modal opens or insight changes
  useEffect(() => {
    if (editorRef.current && isOpen) {
      editorRef.current.innerHTML = insight?.body || '';
    }
  }, [isOpen, insight]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!insight) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { url } = await uploadMedia(file);
      setCoverImage(url);
    } catch (err) {
      console.error('Failed to upload image', err);
      setError('Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    const currentBody = editorRef.current?.innerHTML || '';

    if (!title || !slug || !excerpt || !currentBody) {
      setError('Mohon lengkapi semua field yang wajib');
      return;
    }

    const payload = {
      title,
      slug,
      category,
      excerpt,
      body: currentBody,
      coverImage,
      status,
      authorId: user?.id || 'unknown',
      authorName: user?.name || 'Unknown',
    };

    try {
      setIsSaving(true);
      setError('');
      if (insight) {
        await updateInsight(insight.id, payload);
      } else {
        await createInsight(payload);
      }
      onSaved();
    } catch (err) {
      console.error('Failed to save insight', err);
      setError('Gagal menyimpan artikel');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface w-full max-w-4xl rounded-lg shadow-xl my-8 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-lg">
          <h2 className="font-headline-md text-on-surface">
            {insight ? 'Edit Artikel' : 'Tulis Artikel Baru'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
          {error && (
            <div className="p-3 bg-heritage-red/10 text-heritage-red rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Judul Artikel</Label>
              <Input value={title} onChange={handleTitleChange} placeholder="Masukkan judul..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Slug URL</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-artikel" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Kategori</Label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="w-4 h-4 text-heritage-red focus:ring-heritage-red"
                  />
                  <span className="font-body-md">Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="w-4 h-4 text-heritage-red focus:ring-heritage-red"
                  />
                  <span className="font-body-md">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              {coverImage && (
                <img src={coverImage} alt="Cover" className="w-32 h-24 object-cover rounded border border-outline-variant" />
              )}
              <div>
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Mengunggah...' : (coverImage ? 'Ganti Gambar' : 'Unggah Gambar')}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ringkasan (Excerpt)</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tulis ringkasan 2-3 baris..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Konten Artikel</Label>
            <div className="border border-outline-variant rounded-md overflow-hidden flex flex-col">
              <div className="bg-surface-container-high p-2 flex flex-wrap gap-1 border-b border-outline-variant">
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  className="p-1 hover:bg-surface rounded text-on-surface"
                  title="Bold"
                >
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  className="p-1 hover:bg-surface rounded text-on-surface"
                  title="Italic"
                >
                  <span className="material-symbols-outlined text-[18px]">format_italic</span>
                </button>
                <div className="w-px h-6 bg-outline-variant mx-1 self-center" />
                <button
                  type="button"
                  onClick={() => handleFormat('formatBlock', 'H2')}
                  className="p-1 hover:bg-surface rounded text-on-surface font-bold text-sm"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('formatBlock', 'H3')}
                  className="p-1 hover:bg-surface rounded text-on-surface font-bold text-sm"
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="w-px h-6 bg-outline-variant mx-1 self-center" />
                <button
                  type="button"
                  onClick={() => handleFormat('insertUnorderedList')}
                  className="p-1 hover:bg-surface rounded text-on-surface"
                  title="Bullet List"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('insertOrderedList')}
                  className="p-1 hover:bg-surface rounded text-on-surface"
                  title="Numbered List"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                </button>
                <div className="w-px h-6 bg-outline-variant mx-1 self-center" />
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Masukkan URL:');
                    if (url) handleFormat('createLink', url);
                  }}
                  className="p-1 hover:bg-surface rounded text-on-surface"
                  title="Link"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
              </div>
              <div
                ref={editorRef}
                className="p-4 min-h-[300px] outline-none prose max-w-none focus:ring-2 focus:ring-heritage-red/20 focus:border-heritage-red"
                contentEditable
                onInput={(e) => setBody(e.currentTarget.innerHTML)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant flex justify-end gap-4 bg-surface sticky bottom-0 rounded-b-lg">
          <Button onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isUploading}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
};
