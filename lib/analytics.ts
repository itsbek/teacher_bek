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
  }
}
