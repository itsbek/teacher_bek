"use client";

// Google Analytics 4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific events
export const trackCTAClick = (location: string, method: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${location}_${method}`,
  });
};

export const trackContactFormSubmit = (method: string) => {
  event({
    action: 'contact_form_submit',
    category: 'conversion',
    label: method,
  });
};

export const trackLanguageSwitch = (from: string, to: string) => {
  event({
    action: 'language_switch',
    category: 'engagement',
    label: `${from}_to_${to}`,
  });
};

export const trackScrollDepth = (depth: number) => {
  event({
    action: `scroll_depth_${depth}`,
    category: 'engagement',
    value: depth,
  });
};

export const trackBlogRead = (slug: string, title: string) => {
  event({
    action: 'blog_post_read',
    category: 'engagement',
    label: `${slug}: ${title}`,
  });
};

export const trackNewsletterSubscribe = (subscriberType: string) => {
  event({
    action: 'newsletter_subscribe',
    category: 'conversion',
    label: subscriberType,
  });
};

// Declare gtag on window object
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

// Microsoft Clarity
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

export const initClarity = () => {
  if (typeof window !== 'undefined' && CLARITY_PROJECT_ID && !window.clarity) {
    (function(c: any,l: any,a: any,r: any,i: any,t: any,y: any){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID, null, null);
  }
};
