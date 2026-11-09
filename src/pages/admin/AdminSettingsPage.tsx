import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const { error } = await supabase
      .from('site_settings')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    setSaving(false);
    if (!error) {
      await refreshSettings();
      setSavedSuccess(true);
    } else {
      alert(`Error updating settings: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest">Website Settings</h1>
        <p className="text-xs text-charcoal/60 mt-1">
          Configure official contact details, opening hours, philosophy text, and default SEO.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-sage/30 shadow-soft space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Business Name</label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => handleChange('business_name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Official Phone Number</label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Official Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Opening Hours</label>
            <input
              type="text"
              value={formData.opening_hours}
              onChange={(e) => handleChange('opening_hours', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1">Studio Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Hero Heading</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={formData.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1">About Summary (Home & Header)</label>
          <textarea
            rows={2}
            value={formData.about_summary}
            onChange={(e) => handleChange('about_summary', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1">Detailed Studio Story</label>
          <textarea
            rows={4}
            value={formData.about_full}
            onChange={(e) => handleChange('about_full', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Philosophy Text</label>
            <textarea
              rows={3}
              value={formData.philosophy_text}
              onChange={(e) => handleChange('philosophy_text', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Mission & Vision</label>
            <textarea
              rows={3}
              value={formData.mission_vision}
              onChange={(e) => handleChange('mission_vision', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sage/20">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Default SEO Title</label>
            <input
              type="text"
              value={formData.seo_default_title}
              onChange={(e) => handleChange('seo_default_title', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Default SEO Description</label>
            <input
              type="text"
              value={formData.seo_default_description}
              onChange={(e) => handleChange('seo_default_description', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8 text-xs">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Settings</span>
          </button>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated live!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};