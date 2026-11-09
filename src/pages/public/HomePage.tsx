import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin, Check, Heart, Shield, Sun } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SEO } from '../../components/common/SEO';
import { EnquiryForm } from '../../components/common/EnquiryForm';
import { supabase } from '../../lib/supabase';
import type { YogaClass, BlogPost } from '../../types/database';
import { formatDate } from '../../utils/formatters';

export const HomePage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [featuredClasses, setFeaturedClasses] = useState<YogaClass[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadHomeData() {
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .limit(3);

      if (classesData) setFeaturedClasses(classesData);

      const { data: blogsData } = await supabase
        .from('blogs')
        .select('*, blog_categories(*)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (blogsData) setRecentBlogs(blogsData);
    }
    loadHomeData();
  }, []);

  return (
    <>
      <SEO />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36 bg-gradient-to-b from-cream via-cream to-sage-light/20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-forest/10 text-forest text-xs font-semibold tracking-wider uppercase mb-6 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Gomti Nagar, Lucknow</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-forest tracking-tight leading-[1.1] mb-6">
              {settings.hero_title}
            </h1>

            <p className="text-base sm:text-xl text-charcoal/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/classes" className="btn-primary w-full sm:w-auto text-sm">
                <span>Explore Classes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-secondary w-full sm:w-auto text-sm">
                <span>Reach the Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Introduction Preview */}
      <section className="py-20 bg-white border-y border-sage/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-semibold tracking-widest text-gold">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                A conscious return to mindful living and stillness.
              </h2>
              <p className="text-charcoal/75 leading-relaxed text-sm sm:text-base">
                {settings.about_summary}
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-gold transition-colors"
                >
                  <span>Learn more about our space and teachers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-cream border border-sage/20 shadow-soft">
                <Sun className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-serif text-xl font-semibold text-forest mb-2">Grounding Spaces</h3>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Clean, well-ventilated, and distraction-free studio environment designed for pure practice.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-cream border border-sage/20 shadow-soft">
                <Heart className="w-8 h-8 text-forest mb-4" />
                <h3 className="font-serif text-xl font-semibold text-forest mb-2">Individual Focus</h3>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Batches curated to honor every individual’s natural pace, posture alignment, and capacity.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-cream border border-sage/20 shadow-soft sm:col-span-2">
                <Shield className="w-8 h-8 text-sage mb-4" />
                <h3 className="font-serif text-xl font-semibold text-forest mb-2">Safe Progression</h3>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Emphasis on anatomically safe alignment, mindful breathing, and authentic yogic principles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Preview */}
      <section className="py-24 bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">
              Sessions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-2 mb-4">
              Yoga Classes at Yog Drishti
            </h2>
            <p className="text-sm text-charcoal/70">
              Thoughtfully curated classes to support your physical vitality and inner harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredClasses.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-8 border border-sage/30 shadow-soft flex flex-col justify-between hover:shadow-luxury transition-all duration-300"
              >
                <div>
                  <div className="inline-block px-3 py-1 bg-sage-light/50 text-forest text-xs font-semibold rounded-full mb-4">
                    {item.experience_level}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-forest mb-3">{item.title}</h3>
                  <p className="text-xs text-charcoal/75 leading-relaxed mb-6">
                    {item.short_description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {item.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-charcoal/80">
                        <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-sage/20">
                  <p className="text-xs font-medium text-charcoal/60 mb-3">{item.schedule_text}</p>
                  <Link
                    to="/contact"
                    className="btn-secondary w-full text-center py-2.5 text-xs justify-center"
                  >
                    Enquire for this Batch
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/classes" className="btn-primary">
              <span>View Full Class Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Articles */}
      {recentBlogs.length > 0 && (
        <section className="py-20 bg-white border-t border-sage/20">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase font-semibold tracking-widest text-gold">Journal</span>
                <h2 className="font-serif text-3xl font-bold text-forest mt-1">Reflections & Articles</h2>
              </div>
              <Link to="/blog" className="mt-4 md:mt-0 text-sm font-semibold text-forest hover:text-gold">
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <article key={blog.id} className="group flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] bg-cream rounded-xl overflow-hidden mb-4 border border-sage/20">
                      {blog.cover_image_url ? (
                        <img
                          src={blog.cover_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-xs">
                          Yog Drishti Journal
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
                      {blog.blog_categories?.name || 'Wellness'}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-forest group-hover:text-gold transition-colors mt-1 mb-2">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-sage/10 text-[11px] text-charcoal/50">
                    {formatDate(blog.published_at)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Studio Location & Quick Enquiry */}
      <section className="py-24 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <span className="text-xs uppercase font-semibold tracking-widest text-gold">Visit Us</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                Start your practice in Gomti Nagar
              </h2>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                We are conveniently located in Vikas Khand, near Dayal Chauraha, making it easily accessible for practitioners across Gomti Nagar and greater Lucknow.
              </p>

              <div className="p-6 bg-white rounded-2xl border border-sage/30 shadow-soft space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">Studio Address</h4>
                    <p className="text-xs text-charcoal/70 mt-0.5">{settings.address}</p>
                  </div>
                </div>
              </div>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-sage/30 shadow-soft bg-white">
                <iframe
                  title="Yog Drishti Lucknow Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.749718442885!2d80.9856191!3d26.8504068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2c2446f2e8b%3A0xb15ad7e96b8e8f23!2sDayal%20Chauraha%2C%20Vikas%20Khand%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%20226010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sage/30 shadow-luxury">
              <h3 className="font-serif text-2xl font-bold text-forest mb-2">Connect With Us</h3>
              <p className="text-xs text-charcoal/70 mb-6">
                Have questions about batch timings or starting out? Drop us a message below.
              </p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};