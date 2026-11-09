import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EnquiryFormProps {
  preselectedClass?: string;
  onSuccess?: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ preselectedClass, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestedClass, setInterestedClass] = useState(preselectedClass || '');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Hidden field to trap spam bots

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Bot detection: If the hidden honeypot is populated, silently fake success
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, contact phone number, and message.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          interested_class: interestedClass.trim() || null,
          message: message.trim(),
          status: 'New',
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-sage/10 border border-sage/30 rounded-2xl p-8 text-center animate-in fade-in">
        <CheckCircle2 className="w-12 h-12 text-forest mx-auto mb-4" />
        <h4 className="font-serif text-2xl font-bold text-forest mb-2">Thank You</h4>
        <p className="text-charcoal/70 text-sm max-w-md mx-auto">
          We have received your enquiry. Our team will contact you shortly to guide you regarding class schedules and details.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setPhone('');
            setEmail('');
            setMessage('');
          }}
          className="mt-6 text-xs text-forest underline font-semibold hover:text-gold"
        >
          Submit another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field for spam prevention */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave this empty</label>
        <input
          id="website_url"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aditi Sharma"
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aditi@example.com"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
          Interested Class / Batch (Optional)
        </label>
        <input
          type="text"
          value={interestedClass}
          onChange={(e) => setInterestedClass(e.target.value)}
          placeholder="e.g. Morning Foundational Yoga"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
          Message / Health Goals *
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you are looking to achieve, or ask any questions regarding our timings..."
          className="input-field resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-sm font-semibold tracking-wide disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Enquiry...</span>
          </>
        ) : (
          <>
            <span>Send Enquiry to Studio</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};