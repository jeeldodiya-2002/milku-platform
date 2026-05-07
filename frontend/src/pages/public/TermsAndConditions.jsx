import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import PageReveal from '../../components/PageReveal';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/SettingsContext';

const TermsAndConditions = ({ splashFinished }) => {
    const { settings } = useSettings();
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
                title="MILKU | Terms & Condition"
                description="The legal terms governing your use of the Milku platform. Provided by Jay Gayatri Dairy Products."
                canonical="https://milkudairy.com/terms-conditions"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={4} />

                {/* Top Padding to fix Navbar Overlap */}
                <div className="pt-[120px] md:pt-[160px] pb-20 px-6">
                    <div style={contentBoxStyle}>
                        <h1 style={headerStyle}>Terms & Conditions</h1>
                        <p style={lastUpdatedStyle}>Last Updated: June 2026</p>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using <strong>{settings.websiteUrl?.replace('https://', '') || 'milkudairy.com'}</strong>, you acknowledge that you have read, 
                                understood, and agree to be bound by these Terms and Conditions. These terms apply to all 
                                website visitors, potential B2B partners, enquirers, and administrative users. If you do 
                                not agree with any part of these terms, you must discontinue use of the platform immediately.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>2. About the Platform</h2>
                            <p>
                                This website is an informational and B2B lead generation platform for <strong>Jay Gayatri Dairy Products</strong>. 
                                It is <strong>NOT</strong> an e-commerce website.
                            </p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}>There are no facilities for online ordering or direct digital payments on this website.</li>
                                <li style={listItemStyle}>All product procurement and business transactions are conducted via WhatsApp or direct offline communication.</li>
                                <li style={listItemStyle}>Prices shown on the website are indicative Maximum Retail Prices (MRP).</li>
                                <li style={listItemStyle}>Actual B2B wholesale pricing and bulk rates are communicated privately following a formal enquiry.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>3. Product Information</h2>
                            <p>
                                We strive to ensure the accuracy of all product data displayed.
                            </p>
                            <ul style={listStyle}>
                                {(settings.branches && settings.branches.length > 0 ? settings.branches : []).map((branch, idx) => (
                                    <li key={idx} style={listItemStyle}>
                                        All products associated with <strong>{branch.name}</strong> are FSSAI certified under <strong>License No. {branch.fssaiNumber || settings.fssaiNumber}</strong>.
                                    </li>
                                ))}
                                <li style={listItemStyle}>Nutritional information provided is approximate and based on standard FSSAI testing guidelines.</li>
                                <li style={listItemStyle}>Product availability is subject to seasonal changes and stock levels at our production units.</li>
                                <li style={listItemStyle}>Jay Gayatri Dairy Products reserves the right to modify, discontinue, or update the product range without prior notice.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>4. B2B Partner Terms</h2>
                            <p>
                                For businesses looking to partner with us:
                            </p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}>Submitting an enquiry via our forms or WhatsApp does not constitute a binding purchase order.</li>
                                <li style={listItemStyle}>Final pricing, Minimum Order Quantities (MOQ), and delivery schedules are finalized only after direct verification.</li>
                                <li style={listItemStyle}>Jay Gayatri Dairy Products reserves the absolute right to accept or reject any partnership request.</li>
                                <li style={listItemStyle}>All B2B pricing documents and brochures shared with you are confidential and intended for your business use only.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>5. WhatsApp Communication Terms</h2>
                            <p>
                                By clicking any "WhatsApp" button or link on our platform, you provide explicit consent to be contacted 
                                by our sales team. We will only contact you regarding your specific enquiry. You may opt-out of 
                                further communications at any time by replying "STOP" to our official business number.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>6. Intellectual Property</h2>
                            <p>
                                <strong>Milku®</strong> is a registered trademark. All content on this platform, including but not 
                                limited to logos, mascot designs, product imagery, text content, and UI elements, is the exclusive 
                                intellectual property of <strong>Jay Gayatri Dairy Products</strong>. Any unauthorized copying, 
                                redistribution, or commercial use of our assets is strictly prohibited and will be subject to 
                                legal action.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>7. Limitation of Liability</h2>
                            <p>
                                The website is provided on an "as-is" and "as-available" basis. We are not liable for:
                            </p>
                            <ul style={listStyle}>
                                <li style={listItemStyle}>Occasional technical errors, server downtime, or display glitches.</li>
                                <li style={listItemStyle}>Slightly outdated pricing or product descriptions that haven't been synchronized yet.</li>
                                <li style={listItemStyle}>Maximum liability for any dispute arising from website use is strictly limited to direct damages proved.</li>
                            </ul>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>8. Governing Law</h2>
                            <p>
                                These terms shall be governed by and construed in accordance with the laws of <strong>India</strong>. 
                                Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction 
                                of the courts in <strong>Mehsana, Gujarat, India</strong>.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>9. Changes to Terms</h2>
                            <p>
                                We may update these Terms and Conditions periodically to reflect changes in our business practices 
                                or legal requirements. Your continued use of the platform after such updates constitutes your 
                                acceptance of the revised terms.
                            </p>
                        </section>

                        <section style={sectionStyle}>
                            <h2 style={h2Style}>10. Contact Us</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {(settings.branches && settings.branches.length > 0 ? settings.branches : []).map((branch, idx) => (
                                    <div key={idx} style={contactBoxStyle}>
                                        <p><strong style={{ color: '#1A237E', textTransform: 'uppercase' }}>{branch.name}</strong> {branch.isMain && <span style={{ fontSize: '8px', background: '#1A237E', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>MAIN</span>}</p>
                                        <p style={{ fontSize: '13px', margin: '10px 0' }}>{branch.address}</p>
                                        <div style={{ marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
                                            <p style={{ fontSize: '12px' }}><strong>Phone:</strong> <a href={`tel:${branch.phone}`} style={linkStyle || { color: '#0096D6', fontWeight: '700' }}>+91 {String(branch.phone).replace(/\D/g, '').slice(-10)}</a></p>
                                            <p style={{ fontSize: '12px' }}><strong>Email:</strong> <a href={`mailto:${branch.email}`} style={linkStyle || { color: '#0096D6', fontWeight: '700' }}>{branch.email}</a></p>
                                        </div>
                                    </div>
                                ))}
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

export default TermsAndConditions;
