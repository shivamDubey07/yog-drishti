import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogPost, BlogCategory } from '../../types/database';
import { formatDate } from '../../utils/formatters';
import { SEO } from '../../components/common/SEO';

export const BlogListingPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      const { data: catData } = await supabase.from('blog_categories').select('*').order('name');
      if (catData) setCategories(catData);

      let query = supabase
        .from('blogs')
        .select('*, blog_categories(*)')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (selectedCatId) {
        query = query.eq('category_id', selectedCatId);
      }

      const { data: blogData } = await query;
      if (blogData) setBlogs(blogData);
      setLoading(false);
    }

    fetchBlogData();
  }, [selectedCatId]);

  return (
    <>
      <SEO
        title="Journal & Articles"
        description="Insights on mindful wellness, yoga philosophy, and balanced living from Yog Drishti, Gomti Nagar, Lucknow."
        canonicalUrl="https://yogdrishti.org/blog"
      />

      <div className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">Journal</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mt-2 mb-4">
              Writings & Reflections
            </h1>
            <p className="text-sm text-charcoal/70">
              Deepen your understanding of yoga beyond the mat.
            </p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <button
                onClick={() => setSelectedCatId(null)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCatId === null
                    ? 'bg-forest text-cream'
                    : 'bg-white text-charcoal/70 border border-sage/30 hover:border-forest'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCatId(c.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCatId === c.id
                      ? 'bg-forest text-cream'
                      : 'bg-white text-charcoal/70 border border-sage/30 hover:border-forest'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-forest animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-sage/20 p-8 max-w-lg mx-auto">
              <p className="text-charcoal/60 text-sm">
                No published articles found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <article
                  key={b.id}
                  className="bg-white rounded-3xl overflow-hidden border border-sage/30 shadow-soft flex flex-col justify-between group hover:shadow-luxury transition-all"
                >
                  <div>
                    <div className="aspect-[16/10] bg-cream relative overflow-hidden">
                      {b.cover_image_url ? (
                        <img
                          src={b.cover_image_url}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-xs">
                          Yog Drishti Article
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
                        {b.blog_categories?.name || 'Wellness'}
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-forest group-hover:text-gold transition-colors mt-2 mb-3">
                        <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                      </h2>
                      <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-sage/10 text-xs text-charcoal/60">
                    <span>{formatDate(b.published_at)}</span>
                    <Link
                      to={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-forest hover:text-gold transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};