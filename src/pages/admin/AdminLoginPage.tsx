import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Sign In" noIndex />
      <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-sage/30 shadow-luxury">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-forest">Admin Portal</h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Authorised access for Yog Drishti administrators
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@yogdrishti.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-xs font-semibold"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-sage/20 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-forest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to public website</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};