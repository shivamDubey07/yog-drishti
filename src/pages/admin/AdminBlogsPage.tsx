import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Check, X, Loader2 } from 'lucide-react';
import { supabase, uploadMediaFile } from '../../lib/supabase';
import type { BlogPost, BlogCategory } from '../../types/database';
import { slugify, formatDate } from '../../utils/formatters';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const fetchBlogs = async () => {
    const [{ data: bData }, { data: cData }] = await Promise.all([
      supabase.from('blogs').select('*, blog_categories(*)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name'),
    ]);
    if (bData) setBlogs(bData);
    if (cData) setCategories(cData);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetEditor = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategoryId(categories[0]?.id || '');
    setCoverUrl('');
    setSeoTitle('');
    setSeoDesc('');
    setIsPublished(false);
    setShowEditor(false);
  };

  const startEdit = (b: BlogPost) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setCategoryId(b.category_id || '');
    setCoverUrl(b.cover_image_url || '');
    setSeoTitle(b.seo_title || '');
    setSeoDesc(b.seo_description || '');
    setIsPublished(b.is_published);
    setShowEditor(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const { publicUrl } = await uploadMediaFile(file, 'blogs');
      setCoverUrl(publicUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cover image upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const finalSlug = slug.trim() ? slugify(slug) : slugify(title);
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      content,
      cover_image_url: coverUrl,
      category_id: categoryId || null,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDesc.trim() || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('blogs').update(payload).eq('id', editingId);
    } else {
      await supabase.from('blogs').insert([payload]);
    }

    setSaving(false);
    resetEditor();
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article permanently?')) return;
    await supabase.from('blogs').delete().eq('id', id);
    fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest">Blog Management</h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Write articles, manage SEO metadata, and publish wellness insights.
          </p>
        </div>
        {!showEditor && (
          <button onClick={() => setShowEditor(true)} className="btn-primary py-2.5 px-5 text-xs">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        )}
      </div>

      {showEditor && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-sage/30 shadow-soft space-y-4"
        >
          <div className="flex items-center justify-between border-b border-sage/20 pb-3">
            <h2 className="font-serif text-2xl font-bold text-forest">
              {editingId ? 'Edit Article' : 'Write New Article'}
            </h2>
            <button type="button" onClick={resetEditor} className="text-charcoal/50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) setSlug(slugify(e.target.value));
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Cover Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="input-field py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Short Excerpt *</label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">
              Article Content (Supports HTML formatting: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;) *
            </label>
            <textarea
              rows={10}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field font-mono text-xs"
              placeholder="<p>Write your article content here...</p>"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sage/20">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">SEO Meta Description</label>
              <input
                type="text"
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="blog_pub"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="blog_pub" className="text-xs font-medium">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6 text-xs">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Article</span>
            </button>
            <button type="button" onClick={resetEditor} className="btn-secondary py-2.5 px-6 text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-2xl border border-sage/30 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    b.is_published
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {b.is_published ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-gold font-medium">
                  {b.blog_categories?.name || 'Uncategorized'}
                </span>
                <span className="text-xs text-charcoal/40">{formatDate(b.created_at)}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">{b.title}</h3>
              <p className="text-xs text-charcoal/70 mt-1 line-clamp-1">{b.excerpt}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => startEdit(b)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-gold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};