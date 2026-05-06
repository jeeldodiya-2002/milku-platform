import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeGA } from '../utils/analytics';

/**
 * Milku Cookie Consent Banner
 * High-fidelity, privacy-compliant consent terminal
 */
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const CONSENT_KEY = "milku_cookie_consent";
  const MEASUREMENT_ID = "G-4VN38TY82Q";

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX entrance
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    initializeGA(MEASUREMENT_ID);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      id="milku-cookie-banner"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 99999,
        background: '#FFFFFF',
        borderTop: '3px solid #1A237E',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @media (max-width: 768px) {
            #milku-cookie-banner {
              flex-direction: column !important;
              text-align: center !important;
              padding: 24px 20px !important;
            }
            .banner-actions {
              width: 100% !important;
              margin-top: 16px !important;
              flex-direction: column !important;
            }
            .banner-btn {
              width: 100% !important;
            }
          }
        `}
      </style>
      
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#334155',
            fontWeight: '500',
            fontFamily: 'sans-serif'
          }}>
            We use cookies to improve your experience and analyze site traffic at <strong>Jay Gayatri Dairy</strong>. 
            By clicking Accept, you agree to our use of cookies as described in our{' '}
            <Link to="/privacy-policy" style={{ color: '#0096D6', textDecoration: 'none', fontWeight: '700' }}>Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/terms-conditions" style={{ color: '#0096D6', textDecoration: 'none', fontWeight: '700' }}>Terms</Link>.
          </p>
        </div>

        <div className="banner-actions" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button 
            onClick={handleDecline}
            className="banner-btn"
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1.5px solid #e2e8f0',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="banner-btn"
            style={{
              background: '#0096D6',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 150, 214, 0.25)',
              transition: 'all 0.3s'
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
