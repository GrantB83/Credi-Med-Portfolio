import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

const UTMTracker = () => {
  useEffect(() => {
    const captureUTMParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams: UTMParams = {};
      
      // Capture UTM parameters
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      utmKeys.forEach(key => {
        const value = urlParams.get(key);
        if (value) {
          utmParams[key as keyof UTMParams] = value;
        }
      });

      // Capture click IDs
      const gclid = urlParams.get('gclid');
      const fbclid = urlParams.get('fbclid');
      if (gclid) utmParams.gclid = gclid;
      if (fbclid) utmParams.fbclid = fbclid;

      // Only proceed if we have UTM parameters
      if (Object.keys(utmParams).length === 0) return;

      // Store in sessionStorage for persistence across page navigation
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));

      // Track UTM capture event
      supabase
        .from('analytics_events')
        .insert({
          event_type: 'utm_captured',
          event_data: {
            ...utmParams,
            referrer: document.referrer,
            landing_page: window.location.href
          },
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          session_id: sessionStorage.getItem('session_id') || crypto.randomUUID()
        })
        .then(({ error }) => {
          if (error) {
            console.error('Error tracking UTM parameters:', error);
          }
        });
    };

    // Capture on component mount
    captureUTMParams();

    // Also capture on URL changes (for SPAs)
    const handlePopState = () => {
      captureUTMParams();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return null; // This component doesn't render anything
};

// Utility function to get UTM parameters from storage
export const getStoredUTMParams = (): UTMParams => {
  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Utility function to track conversion with UTM data
export const trackConversionWithUTM = async (
  conversionType: string, 
  additionalData: Record<string, any> = {}
) => {
  const utmParams = getStoredUTMParams();
  
  await supabase
    .from('analytics_events')
    .insert({
      event_type: 'conversion',
      event_data: {
        conversion_type: conversionType,
        ...utmParams,
        ...additionalData
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      session_id: sessionStorage.getItem('session_id') || crypto.randomUUID()
    });
};

export default UTMTracker;