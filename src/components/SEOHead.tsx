import { useEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogType = 'website',
  ogImage = '/og-image.png'
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Update canonical URL
    if (canonical) {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.setAttribute('href', canonical);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    // Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('og:type', ogType);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:site_name', 'CrediMed');
    if (canonical) updateMetaTag('og:url', canonical);

    // Twitter meta tags
    const updateTwitterTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
    updateTwitterTag('twitter:image', ogImage);

    // Add structured data for medical aid comparison service
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "CrediMed",
      "description": "Medical aid comparison platform for South Africa",
      "url": "https://www.credi.co.za/credimed",
      "logo": "https://www.credi.co.za/credimed/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+27-861-273-341",
        "contactType": "Customer Service",
        "areaServed": "ZA",
        "availableLanguage": ["English", "Afrikaans"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ZA",
        "addressRegion": "Western Cape"
      },
      "serviceType": "Medical Aid Comparison",
      "areaServed": {
        "@type": "Country",
        "name": "South Africa"
      }
    };

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Track page view for analytics
    trackPageView(title, {
      page_title: title,
      page_description: description
    });

  }, [title, description, keywords, canonical, ogType, ogImage]);

  return null;
};

export default SEOHead;