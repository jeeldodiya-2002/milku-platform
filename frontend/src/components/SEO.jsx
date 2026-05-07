import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for Milku (Jay Gayatri Dairy Products)
 * Purpose: Centralized management of meta tags, OG tags, and Twitter cards.
 */
const SEO = ({
    title,
    description,
    keywords,
    robots = "index, follow",
    canonical,
    ogImage = "https://milkudairy.com/logo.jpeg",
    ogType = "website"
}) => {
    const siteName = "Milku® — Jay Gayatri Dairy";
    const author = "Jay Gayatri Dairy Products";
    const defaultTitle = "Milku | Jay Gayatri Dairy";

    // Fallback logic for various props
    const fullTitle = title || defaultTitle;
    const finalCanonical = canonical || "https://milkudairy.com";

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={finalCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={finalCanonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SEO;
