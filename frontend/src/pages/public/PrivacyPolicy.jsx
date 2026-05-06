import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import PageReveal from '../../components/PageReveal';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/SettingsContext';

const PrivacyPolicy = ({ splashFinished }) => {
    const { settings, getWhatsAppLink } = useSettings();
    const containerRef = useRef();

    // Scroll-driven background color transition
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["#ffffff", "#F0F7FF", "#E8F4FD"]
    );

    const contentBoxStyle = {
        maxWidth: '860px',
        margin: '0 auto',
        padding: '40px 28px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#333333',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
        lineHeight: '1.7',
        position: 'relative',
        zIndex: 10,
    };

    const headerStyle = {
        color: '#1A237E',
        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
        fontWeight: '900',
        marginBottom: '10px',
        textAlign: 'center',
        letterSpacing: '-0.03em',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    };

    const lastUpdatedStyle = {
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        tracking: '0.2em',
        marginBottom: '60px',
        opacity: 0.6,
    };

    const sectionStyle = {
        marginBottom: '45px',
    };

    const h2Style = {
        color: '#1A237E',
        fontSize: '1.6rem',
        fontWeight: '800',
        marginTop: '40px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '2px solid rgba(26, 35, 126, 0.1)',
        paddingBottom: '10px',
    };

    const listStyle = {
        paddingLeft: '20px',
        marginTop: '15px',
    };

    const listItemStyle = {
        marginBottom: '12px',
    };

    const linkStyle = {
        color: '#0096D6',
        textDecoration: 'none',
        fontWeight: '700',
    };

    const contactBoxStyle = {
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        padding: '30px',
        borderRadius: '20px',
        marginTop: '30px',
        borderLeft: '6px solid #1A237E',
    };

    return (
        <motion.div
            ref={containerRef}
            style={{ backgroundColor: dynamicBackground }}
            className="relative w-full min-h-screen"
        >
            <SEO 
                title="MILKU | Privacy Policy"
                description="Our commitment to your privacy. Learn how Milku (Jay Gayatri Dairy) safeguards your data and business information."
                canonical="https://milkudairy.com/privacy-policy"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={4} />

                {/* Top Padding to fix Navbar Overlap */}
                <div className="pt-[120px] md:pt-[160px] pb-20 px-6">
                    <div style={contentBoxStyle}>
                        <h1 style={headerStyle}>Privacy Policy</h1>
                        <p style={lastUpdatedStyle}>Last Updated: June 2026</p>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>1. Introduction</h2>
                            <p>
                                Welcome to <strong>Milku</strong>, a registered trademark of <strong>Jay Gayatri Dairy Products</strong>.
                                We are committed to protecting your personal information and your right to privacy. This Privacy Policy
                                explains how we collect, use, and safeguard your data when you visit our website
                                <a href={settings.websiteUrl || "https://milkudairy.com"} style={linkStyle}> {settings.websiteUrl?.replace('https://', '') || 'milkudairy.com'}</a> and interact with our services.
                                By using our website, you agree to the terms outlined in this policy.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>2. Information We Collect</h2>
                            <p>We collect information that you provide directly to us, as well as data gathered automatically through your use of the website:</p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}><strong>Personal Details:</strong> Name, WhatsApp number, and email address provided during enquiries.</li>
                                <li style={listItemStyle}><strong>Business Information:</strong> Business name and location details for B2B procurement and bulk pricing quotes.</li>
                                <li style={listItemStyle}><strong>Technical Data:</strong> Browser type, device information, IP address, and usage patterns collected via Google Analytics.</li>
                                <li style={listItemStyle}><strong>Cookies:</strong> We use session cookies for administrative purposes and analytical cookies to understand website performance.</li>
                                <li style={listItemStyle}><strong>No Payment Info:</strong> We do NOT collect or store credit card, debit card, or bank account details on our servers.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>3. How We Use Your Information</h2>
                            <p>Your data is used to provide a seamless experience and improve our services:</p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}>To respond to your product enquiries via WhatsApp or email.</li>
                                <li style={listItemStyle}>To provide customized B2B bulk pricing quotes and product brochures.</li>
                                <li style={listItemStyle}>To analyze website traffic and optimize user interface performance.</li>
                                <li style={listItemStyle}>We <strong>DO NOT</strong> sell, rent, or trade your personal information to third parties.</li>
                                <li style={listItemStyle}>We do not send promotional spam without your explicit prior consent.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>4. WhatsApp Communication</h2>
                            <p>
                                Our website features direct WhatsApp links (wa.me) for quick assistance. When you click these links,
                                messages are sent directly to our official business number. We only use your number to respond to
                                your specific enquiry. We do not add your number to broadcast lists without your voluntary opt-in.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>5. Data Storage and Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. Our website uses HTTPS encryption
                                for all data transmission. Admin access is restricted via JWT (JSON Web Token) authentication.
                                All data is stored on secure cloud servers with strict access controls.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>6. Cookies</h2>
                            <p>
                                We use anonymous Google Analytics cookies to track visitor trends. Session cookies are utilized
                                exclusively for admin dashboard functionality. A cookie consent banner is displayed upon your first visit.
                                You can choose to disable cookies through your browser settings, though some website features may be affected.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>7. Third Party Services</h2>
                            <p>We utilize the following trusted third-party services to operate our platform:</p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}><strong>Google Analytics:</strong> For website traffic analysis.</li>
                                <li style={listItemStyle}><strong>Google Maps:</strong> To display our physical store and factory locations.</li>
                                <li style={listItemStyle}><strong>WhatsApp:</strong> For real-time customer support.</li>
                                <li style={listItemStyle}><strong>Netlify/GitHub Pages:</strong> For secure website hosting.</li>
                                <li style={listItemStyle}><strong>MongoDB Atlas:</strong> For secure database management.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>8. Your Rights</h2>
                            <p>
                                In accordance with the <strong>Indian IT Act 2000</strong> and the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>,
                                you have the right to access, correct, or request the deletion of your personal data. If you wish to exercise
                                these rights or have any grievances, please contact our Data Grievance Officer at
                                <a href={`mailto:${settings.email}`} style={linkStyle}> {settings.email}</a>.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>9. FSSAI Compliance</h2>
                            <p>
                                As a responsible food business, we maintain strict compliance with FSSAI regulations. Our
                                <strong> FSSAI License No. {settings.fssaiNumber}</strong> is displayed on all our digital and physical
                                assets. All product information provided on this website matches the FSSAI-approved packaging standards.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>10. Contact Us</h2>
                            <div style={contactBoxStyle}>
                                <p><strong>Jay Gayatri Dairy Products (Milku)</strong></p>
                                <p>{settings.address}</p>
                                <p style={{ marginTop: '10px' }}><strong>Phone:</strong> +91 {String(settings.whatsappNumber).replace(/\D/g, '').slice(-10)}</p>
                                <p><strong>Email:</strong> {settings.email}</p>
                                <p><strong>Website:</strong> {settings.websiteUrl?.replace('https://', '') || 'milkudairy.com'}</p>
                            </div>
                        </section>

                        <div style={{ textAlign: 'center', marginTop: '60px', padding: '20px' }}>
                            <Link to="/" className="btn-pill" style={{
                                display: 'inline-flex',
                                backgroundColor: '#1A237E',
                                color: 'white',
                                padding: '14px 32px',
                                borderRadius: '100px',
                                textDecoration: 'none',
                                fontWeight: '900',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </PageReveal>
        </motion.div>
    );
};

export default PrivacyPolicy;

