import ReactGA from "react-ga4";

/**
 * Milku Analytics Engine — GA4 Implementation
 * Based on user privacy consent (localStorage: milku_cookie_consent)
 */

const CONSENT_KEY = "milku_cookie_consent";

const hasConsent = () => {
  return localStorage.getItem(CONSENT_KEY) === "accepted";
};

/**
 * Initialize GA4 only if consent is granted
 */
export const initializeGA = (measurementId) => {
  if (hasConsent()) {
    ReactGA.initialize(measurementId);
    console.log("📊 GA4 Initialized for Milku");
  }
};

/**
 * Track Page Views
 */
export const trackPageView = (path, title) => {
  if (hasConsent()) {
    ReactGA.send({ hitType: "pageview", page: path, title: title });
  }
};

/**
 * Track Custom Events
 */
export const trackEvent = (eventName, params = {}) => {
  if (hasConsent()) {
    ReactGA.event(eventName, params);
  }
};

/**
 * PRE-BUILT EVENT CALLERS
 */

export const trackWhatsAppClick = (productName, pageLocation) => {
  trackEvent("whatsapp_click", {
    product_name: productName,
    page_location: pageLocation,
    brand: "Milku"
  });
};

export const trackProductView = (productName, category, price) => {
  trackEvent("product_view", {
    item_name: productName,
    item_category: category,
    price: price,
    currency: "INR"
  });
};

export const trackBrochureRequest = (productName) => {
  trackEvent("brochure_request", {
    item_name: productName
  });
};

export const trackPartnerEnquiry = (businessType, city) => {
  trackEvent("partner_enquiry_submit", {
    business_type: businessType,
    location_city: city
  });
};

export const trackContactClick = (method) => {
  trackEvent("contact_click", {
    contact_method: method // "phone", "whatsapp", "email"
  });
};

/**
 * Reset Consent (User wants to change settings)
 */
export const resetConsent = () => {
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
};
