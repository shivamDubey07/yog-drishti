import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/database';

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  business_name: 'Yog Drishti',
  tagline: 'A Sanctuary for Mindful Movement & Inner Stillness in Lucknow',
  phone_number: '[Phone Number Pending - Update in Admin]',
  email: 'contact@yogdrishti.org',
  address: '5/53 Vikas Khand, near Dayal Chauraha, Gomti Nagar, Lucknow, Uttar Pradesh, India',
  google_maps_embed_url: 'https://google.com',
  google_maps_directions_url: 'https://google.com',
  opening_hours: 'Monday – Saturday: [Update Morning Hours] & [Update Evening Hours] | Sunday: Closed',
  hero_title: 'Cultivate Balance, Clarity, and Inner Peace',
  hero_subtitle: 'Welcome to Yog Drishti in Gomti Nagar, Lucknow. Experience authentic yoga practices tailored to every stage of your wellness journey.',
  about_summary: '[Placeholder: Brief introduction to Yog Drishti. You can edit this anytime from the Admin Settings panel to reflect your authentic journey and space.]',
  about_full: '[Placeholder: Detailed history and background of Yog Drishti. Update this section with your genuine story from the Admin dashboard.]',
  philosophy_text: '[Placeholder: Describe the core yoga philosophy practiced at Yog Drishti, focusing on holistic well-being, breath awareness, and mindful living.]',
  mission_vision: '[Placeholder: Share your mission and vision for bringing authentic wellness to the Lucknow community.]',
  instructors_json: [
    {
      name: '[Instructor Name Placeholder]',
      role: '[Role / Specialization Placeholder]',
      bio: '[Editable instructor bio placeholder. Add authentic qualifications and experience via Admin Settings.]',
      image_url: '',
    },
  ],
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  seo_default_title: 'Yog Drishti | Yoga Centre in Gomti Nagar, Lucknow',
  seo_default_description: 'Join Yog Drishti at 5/53 Vikas Khand, near Dayal Chauraha, Gomti Nagar, Lucknow for mindful yoga sessions in a calm, welcoming studio.',
  updated_at: new Date().toISOString(),
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: FALLBACK_SETTINGS,
  loading: true,
  refreshSettings: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setSettings({
          ...FALLBACK_SETTINGS,
          ...data,
          instructors_json: Array.isArray(data.instructors_json)
            ? data.instructors_json
            : FALLBACK_SETTINGS.instructors_json,
        });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
