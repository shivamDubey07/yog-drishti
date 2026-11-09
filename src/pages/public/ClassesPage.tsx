import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { YogaClass } from '../../types/database';
import { SEO } from '../../components/common/SEO';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (data) setClasses(data);
      setLoading(false);
    }
    loadClasses();
  }, []);

  return (
    <>
      <SEO
        title="Yoga Classes & Schedule"
        description="Explore classes at Yog Drishti in Gomti Nagar, Lucknow. From foundational practices to calming mindful sessions."
        canonicalUrl="https://yogdrishti.org/classes"
      />

      <div className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">Schedule</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mt-2 mb-6">
              Our Yoga Offerings
            </h1>
            <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
              Find the rhythm that aligns with your lifestyle. All sessions are structured to nurture mindful alignment, strength, and inner calm.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-forest animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-8 border border-sage/30 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-3 py-1 bg-sage-light text-forest rounded-full">
                        {c.experience_level}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-forest mb-3">{c.title}</h2>
                    <p className="text-xs text-charcoal/70 leading-relaxed mb-6">
                      {c.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <h3 className="text-[11px] uppercase font-bold tracking-wider text-charcoal/50">
                        Key Benefits
                      </h3>
                      {c.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-charcoal/80">
                          <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-sage/20 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-charcoal/70">
                      <Clock className="w-4 h-4 text-gold shrink-0" />
                      <span>{c.schedule_text}</span>
                    </div>
                    {c.instructor_name && (
                      <div className="flex items-center gap-2 text-xs text-charcoal/70">
                        <User className="w-4 h-4 text-forest shrink-0" />
                        <span>Teacher: {c.instructor_name}</span>
                      </div>
                    )}
                    <Link
                      to={`/contact?class=${encodeURIComponent(c.title)}`}
                      className="btn-primary w-full text-center py-3 text-xs justify-center"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};