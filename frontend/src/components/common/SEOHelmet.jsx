import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Markaz IT Madinah';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

export default function SEOHelmet({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalPath,
  jsonLd,
  noIndex = false,
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const canonical = canonicalPath || location.pathname;
  const url = `${window.location.origin}${canonical}`;
  const translatedTitle = title ? t(title, title) : '';
  const fullTitle = translatedTitle ? `${translatedTitle} - ${SITE_NAME}` : SITE_NAME;
  const languages = ['id', 'en', 'ar'];

  const schemaOrg = jsonLd || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: window.location.origin,
    description: 'Program studi intensif yang memadukan ilmu syari, tahfidz Al-Quran, dan teknologi informasi di Madinah Al-Munawwarah.',
    inLanguage: i18n.language,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${window.location.origin}${ogImage}`} />
      <meta property="og:locale" content={i18n.language === 'id' ? 'id_ID' : i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${window.location.origin}${ogImage}`} />

      {/* Hreflang */}
      {languages.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
