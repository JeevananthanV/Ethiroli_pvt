import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Ethiroli — Premier Branding, Marketing & Automation Agency';
const DEFAULT_DESCRIPTION =
  'Ethiroli is a premier branding, performance marketing, and marketing automation agency in Tamil Nadu. We craft iconic brand identities, high-impact campaigns, and data-driven marketing funnels to scale ambitious businesses.';
const DEFAULT_KEYWORDS =
  'branding agency, marketing agency, branding and marketing agency, marketing automation, performance marketing, digital marketing, SEO, AEO, GEO, answer engine optimization, generative engine optimization, brand identity, lead generation, social media marketing, Salem marketing agency, Tamil Nadu branding agency, Ethiroli';
const DOMAIN = 'https://ethiroli.net';
const DEFAULT_IMAGE = `${DOMAIN}/assets/images/banner/golden_ribbon_hero.jpg`;

const updateMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateLinkTag = (rel, href) => {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageCanonical = canonical || `${DOMAIN}${currentPath === '/' ? '' : currentPath}`;
  const pageTitle = title ? (title.includes('Ethiroli') ? title : `${title} | Ethiroli Branding & Marketing Agency`) : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Document Title
    document.title = pageTitle;

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', typeof keywords === 'string' ? keywords : keywords.join(', '));
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('name', 'author', 'Ethiroli Pvt. Ltd.');

    // 3. Canonical Link
    updateLinkTag('canonical', pageCanonical);

    // 4. Open Graph Tags
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', pageCanonical);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:site_name', 'Ethiroli Branding & Marketing Agency');
    updateMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    if (schema) {
      let script = document.getElementById('route-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'route-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [pageTitle, description, keywords, pageCanonical, ogImage, ogType, schema]);

  return null;
};

export default SEO;
