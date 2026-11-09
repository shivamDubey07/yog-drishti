import React, { useEffect, useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { supabase, uploadMediaFile } from '../../lib/supabase';
import type { GalleryImage } from '../../types/database';

export const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Studio Space');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const { publicUrl, storagePath } = await uploadMediaFile(file, 'gallery');

        await supabase.from('gallery_images').insert([
          {
            image_url: publicUrl,
            storage_path: storagePath,
            caption: caption.trim() || 'Yog Drishti Studio',
            alt_text: caption.trim() || 'Yog Drishti Yoga Centre in Gomti Nagar, Lucknow',
            category: category.trim() || 'Studio Space',
          },
        ]);
      }
      setCaption('');
      setSelectedFiles(null);
      fetchGallery();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    if (img.storage_path) {
      await supabase.storage.from('media').remove([img.storage_path]);
    }
    await supabase.from('gallery_images').delete().eq('id', img.id);
    fetchGallery();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest">Gallery Management</h1>
        <p className="text-xs text-charcoal/60 mt-1">
          Upload studio photos and organize them into categories.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-2xl border border-sage/30 shadow-soft space-y-4"
      >
        <h2 className="font-serif text-xl font-bold text-forest">Upload Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Select Image(s) *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="input-field py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Caption / Alt Text *</label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Morning Asana Practice"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Studio Space, Classes, Events"
              className="input-field"
            />
          </div>
        </div>
        <button type="submit" disabled={uploading} className="btn-primary py-2.5 px-6 text-xs">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload to Gallery</span>
            </>
          )}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-2xl overflow-hidden border border-sage/30 shadow-soft flex flex-col justify-between"
          >
            <div className="aspect-square bg-cream">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="truncate">
                <p className="text-xs font-semibold text-charcoal truncate">{img.caption}</p>
                <span className="text-[10px] text-gold">{img.category}</span>
              </div>
              <button
                onClick={() => handleDelete(img)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};