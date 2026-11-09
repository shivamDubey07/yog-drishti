import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { GalleryImage } from '../../types/database';
import { SEO } from '../../components/common/SEO';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalImage, setActiveModalImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (data) {
        setImages(data);
        const uniqueCats = Array.from(new Set(data.map((img) => img.category))).filter(Boolean);
        setCategories(['All', ...uniqueCats]);
      }
      setLoading(false);
    }
    loadGallery();
  }, []);

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  return (
    <>
      <SEO
        title="Studio Gallery & Atmosphere"
        description="A visual glimpse into Yog Drishti yoga centre in Gomti Nagar, Lucknow."
        canonicalUrl="https://yogdrishti.org/gallery"
      />

      <div className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">Atmosphere</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mt-2 mb-4">
              Inside Our Sanctuary
            </h1>
            <p className="text-sm text-charcoal/70">
              A serene and dedicated environment crafted to support mindfulness, stillness, and growth.
            </p>
          </div>

          {/* Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-forest text-cream'
                      : 'bg-white text-charcoal/70 border border-sage/30 hover:border-forest'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-forest animate-spin" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-sage/20 p-8 max-w-lg mx-auto">
              <p className="text-charcoal/60 text-sm">
                No gallery photos added yet. Upload studio photos via the Admin Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveModalImage(img)}
                  className="group relative aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer border border-sage/30 shadow-soft"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-cream">
                    <p className="text-xs font-semibold">{img.caption}</p>
                    <span className="text-[10px] text-cream/75">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 bg-forest-dark/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveModalImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activeModalImage.image_url}
              alt={activeModalImage.alt_text}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            {activeModalImage.caption && (
              <p className="mt-4 text-sm text-cream/90 text-center font-serif">
                {activeModalImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};