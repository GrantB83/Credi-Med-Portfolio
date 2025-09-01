// Analytics utility functions for GA4 and Meta Pixel integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 4 Events
export const trackGA4Event = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'medical_aid_comparison',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      custom_parameters: parameters,
      ...parameters
    });
  }
};

// Meta Pixel Events
export const trackMetaPixelEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Combined tracking function
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  // Track in GA4
  trackGA4Event(eventName, parameters);
  
  // Track in Meta Pixel (convert event names to Meta format)
  const metaEventName = convertToMetaEvent(eventName);
  if (metaEventName) {
    trackMetaPixelEvent(metaEventName, parameters);
  }
  
  // Also log to console for debugging (remove in production)
  console.log(`Analytics Event: ${eventName}`, parameters);
};

// Convert custom event names to Meta Pixel standard events
const convertToMetaEvent = (eventName: string): string | null => {
  const eventMap: { [key: string]: string } = {
    'questionnaire_started': 'InitiateCheckout',
    'questionnaire_completed': 'CompleteRegistration',
    'scheme_selected': 'AddToCart',
    'lead_generated': 'Lead',
    'user_registered': 'CompleteRegistration',
    'contact_form_submitted': 'Contact',
    'page_view': 'PageView'
  };
  
  return eventMap[eventName] || null;
};

// Questionnaire-specific tracking
export const trackQuestionnaireStep = (stepNumber: number, stepName: string, data: any = {}) => {
  trackEvent('questionnaire_step_completed', {
    step_number: stepNumber,
    step_name: stepName,
    questionnaire_data: data
  });
};

export const trackSchemeSelection = (scheme: any) => {
  trackEvent('scheme_selected', {
    scheme_id: scheme.id,
    scheme_name: scheme.scheme_name,
    plan_name: scheme.plan_name,
    monthly_premium: scheme.monthly_premium,
    currency: 'ZAR'
  });
};

export const trackLeadGeneration = (leadData: any) => {
  trackEvent('lead_generated', {
    lead_id: leadData.id,
    priority: leadData.priority,
    budget: leadData.questionnaire_responses?.budget,
    chronic_cover: leadData.questionnaire_responses?.chronic_cover,
    dependants_count: (leadData.questionnaire_responses?.dependants?.adults || 0) + 
                     (leadData.questionnaire_responses?.dependants?.children || 0)
  });
};

export const trackUserRegistration = (userData: any) => {
  trackEvent('user_registered', {
    user_id: userData.id,
    registration_method: userData.method || 'email',
    has_dependants: userData.dependants_count > 0
  });
};

// UTM Parameter tracking
export const getUTMParameters = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || 'direct',
    utm_medium: urlParams.get('utm_medium') || 'none',
    utm_campaign: urlParams.get('utm_campaign') || 'none',
    utm_term: urlParams.get('utm_term') || 'none',
    utm_content: urlParams.get('utm_content') || 'none'
  };
};

// Enhanced conversion tracking
export const trackConversion = (type: 'lead' | 'registration' | 'application', value?: number) => {
  const conversionData = {
    conversion_type: type,
    conversion_value: value || 0,
    currency: 'ZAR',
    ...getUTMParameters()
  };
  
  trackEvent('conversion', conversionData);
  
  // Send to Meta as Purchase for lead generation
  if (type === 'lead') {
    trackMetaPixelEvent('Purchase', {
      value: value || 100, // Assign lead value
      currency: 'ZAR'
    });
  }
};

// Page view tracking with enhanced data
export const trackPageView = (pageName: string, additionalData: Record<string, any> = {}) => {
  const pageData = {
    page_name: pageName,
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer,
    ...getUTMParameters(),
    ...additionalData
  };
  
  trackEvent('page_view', pageData);
  
  // Update GA4 page view
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};