import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Bell, FileText, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Enquiry } from '../../types/database';
import { formatDate } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [counts, setCounts] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    publishedBlogs: 0,
    totalGallery: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    async function loadStats() {
      const [
        { count: totalEnq },
        { count: newEnq },
        { count: pubBlogs },
        { count: galleryCount },
        { data: recentData },
      ] = await Promise.all([
        supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setCounts({
        totalEnquiries: totalEnq || 0,
        newEnquiries: newEnq || 0,
        publishedBlogs: pubBlogs || 0,
        totalGallery: galleryCount || 0,
      });

      if (recentData) setRecentEnquiries(recentData);
    }

    loadStats();
  }, []);

  const cards = [
    { label: 'Total Enquiries', value: counts.totalEnquiries, icon: MessageSquare, link: '/admin/enquiries' },
    { label: 'New (Unread) Enquiries', value: counts.newEnquiries, icon: Bell, link: '/admin/enquiries' },
    { label: 'Published Blogs', value: counts.publishedBlogs, icon: FileText, link: '/admin/blogs' },
    { label: 'Gallery Photos', value: counts.totalGallery, icon: ImageIcon, link: '/admin/gallery' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest">Dashboard Overview</h1>
        <p className="text-xs text-charcoal/60 mt-1">
          Welcome back. Manage Yog Drishti enquiries, class schedules, and website content.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.link}
              className="bg-white p-6 rounded-2xl border border-sage/30 shadow-soft hover:border-forest transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal/60">{c.label}</span>
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <p className="font-serif text-4xl font-bold text-forest">{c.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-sage/30 shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-forest">Recent Enquiries</h2>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-gold"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-xs text-charcoal/50 py-8 text-center">No enquiries received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sage/20 text-[11px] uppercase text-charcoal/50">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Interested Class</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/15 text-xs">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-cream/50">
                    <td className="py-3.5 px-4 font-semibold text-charcoal">{enq.name}</td>
                    <td className="py-3.5 px-4">{enq.phone}</td>
                    <td className="py-3.5 px-4 text-charcoal/70">{enq.interested_class || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/60">{formatDate(enq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};