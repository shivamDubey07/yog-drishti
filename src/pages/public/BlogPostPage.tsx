import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types/database';
import { formatDate } from '../../utils/formatters';
import { SEO } from '../../components/common/SEO';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);

      const { data } = await supabase
        .from('blogs')
        .select('*, blog_categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (data) {
        setPost(data);

        // Fetch up to 2 related articles
        const { data: relData } = await supabase
          .from('blogs')
          .select('*, blog_categories(*)')
          .eq('is_published', true)
          .neq('id', data.id)
          .limit(2);

        if (relData) setRelated(relData);
      }
      setLoading(false);
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-forest mb-4">Article Not Found</h1>
        <p className="text-charcoal/70 text-sm mb-6">
          The requested article may have been moved or unpublished.
        </p>
        <Link to="/blog" className="btn-primary">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        ogType="article"
        ogImage={post.cover_image_url}
        publishedTime={post.published_at || undefined}
        canonicalUrl={`https://yogdrishti.org/blog/${post.slug}`}
      />

      <article className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-forest/80 hover:text-forest mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all articles</span>
          </Link>

          <header className="mb-10">
            {post.blog_categories && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                <Tag className="w-3.5 h-3.5" />
                <span>{post.blog_categories.name}</span>
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-charcoal/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.published_at)}
              </span>
            </div>
          </header>

          {post.cover_image_url && (
            <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-soft border border-sage/30">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-sage/20 shadow-soft mb-16">
            <div
              className="prose prose-stone max-w-none text-charcoal/85 leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="pt-8 border-t border-sage/20">
              <h2 className="font-serif text-2xl font-bold text-forest mb-6">More from the Journal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    to={`/blog/${item.slug}`}
                    className="p-6 bg-white rounded-2xl border border-sage/20 hover:border-forest transition-all"
                  >
                    <span className="text-[11px] text-gold font-semibold uppercase">
                      {item.blog_categories?.name}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-forest mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 line-clamp-2">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
};