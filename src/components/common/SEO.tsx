import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = 'https://yogdrishti.org',
  ogType = 'website',
  ogImage,
  publishedTime,
  noIndex = false,
}) => {
  const { settings } = useSiteSettings();

  const siteTitle = title
    ? `${title} | ${settings.business_name}`
    : settings.seo_default_title || `${settings.business_name} | Yoga Centre in Gomti Nagar, Lucknow`;

  const metaDesc = description || settings.seo_default_description;
  const defaultOgImage = 'https://yogdrishti.org/og-cover.jpg';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    'additionalType': 'https://schema.org/ExerciseGym',
    'name': settings.business_name,
    'url': 'https://yogdrishti.org',
    'description': metaDesc,
    'telephone': settings.phone_number,
    'email': settings.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '5/53 Vikas Khand, near Dayal Chauraha',
      'addressLocality': 'Gomti Nagar, Lucknow',
      'addressRegion': 'Uttar Pradesh',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 26.8530,
      'longitude': 80.9995,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '06:00',
        'closes': '20:00',
      },
    ],
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDesc} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:site_name" content={settings.business_name} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Local Business JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};