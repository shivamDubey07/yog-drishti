import React, { useEffect, useState } from 'react';
import { Search, Trash2, PhoneCall } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Enquiry, EnquiryStatus } from '../../types/database';
import { formatDate } from '../../utils/formatters';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchEnquiries = async () => {
    const { data } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEnquiries(data);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: EnquiryStatus) => {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    fetchEnquiries();
  };

  const deleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    await supabase.from('enquiries').delete().eq('id', id);
    fetchEnquiries();
  };

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      (e.message && e.message.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest">Enquiry Management</h1>
        <p className="text-xs text-charcoal/60 mt-1">
          View, search, and update lead statuses from website visitors.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-sage/30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or message..."
            className="input-field pl-10 py-2.5 text-xs"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'New', 'Contacted', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-forest text-cream'
                  : 'bg-cream text-charcoal/70 hover:bg-sage/20'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((enq) => (
          <div
            key={enq.id}
            className="bg-white p-6 rounded-2xl border border-sage/30 shadow-soft flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-serif text-xl font-bold text-forest">{enq.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    enq.status === 'New'
                      ? 'bg-amber-100 text-amber-800'
                      : enq.status === 'Contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {enq.status}
                </span>
                <span className="text-xs text-charcoal/50">{formatDate(enq.created_at)}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-charcoal/80">
                <a
                  href={`tel:${enq.phone}`}
                  className="inline-flex items-center gap-1 font-semibold text-forest hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{enq.phone}</span>
                </a>
                {enq.email && <span>Email: {enq.email}</span>}
                {enq.interested_class && (
                  <span className="text-gold font-medium">Batch: {enq.interested_class}</span>
                )}
              </div>

              <p className="text-xs text-charcoal/80 bg-cream p-3.5 rounded-xl mt-2 leading-relaxed">
                {enq.message}
              </p>
            </div>

            <div className="flex md:flex-col justify-end gap-2 shrink-0">
              {(['New', 'Contacted', 'Resolved'] as EnquiryStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateStatus(enq.id, st)}
                  disabled={enq.status === st}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    enq.status === st
                      ? 'bg-sage/20 border-sage text-charcoal/40 cursor-not-allowed'
                      : 'border-sage/40 text-charcoal hover:border-forest'
                  }`}
                >
                  Mark {st}
                </button>
              ))}
              <button
                onClick={() => deleteEnquiry(enq.id)}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 border border-transparent"
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