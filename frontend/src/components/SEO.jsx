import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Universal Core Keywords for Milku & Jay Gayatri Dairy
 * Covers brand queries, common misspellings (e.g. mil prpducts), categories, and location variants.
 */
const BASE_KEYWORDS = [
    "Milku",
    "Milku Dairy",
    "Milku Products",
    "mil prpducts",
    "milku prpducts",
    "milku milk products",
    "milkudairy",
    "milkudairy.com",
    "Jay Gayatri Dairy",
    "Jay Gayatri Dairy Products",
    "Jay Gayatri Milk",
    "Milku Jay Gayatri",
    "milk products",
    "dairy products",
    "pure milk products",
    "dairy farm",
    "dairy store",
    "dairy near me",
    "dairy shop near me",
    "Surat Dairy",
    "Gujarat Dairy",
    "Sunak Dairy",
    "Mehsana Dairy",
    "Pure Paneer",
    "Malai Paneer",
    "A2 Desi Cow Ghee",
    "Bilona Ghee",
    "Buffalo Ghee",
    "Fresh Curd",
    "Dahi",
    "Buttermilk",
    "Chaas",
    "Chass",
    "Shrikhand",
    "Lassi",
    "Basundi",
    "Penda",
    "Peda",
    "Barfi",
    "Mava",
    "Khoya",
    "Kaju Katri",
    "Mohanthal",
    "Milk Cake"
].join(', ');

/**
 * SEO Component for Milku (Jay Gayatri Dairy Products)
 * Purpose: Centralized management of meta tags, OG tags, Twitter cards, geo tags, and JSON-LD structured data.
 */
const SEO = ({
    title,
    description,
    keywords,
    robots = "index, follow",
    canonical,
    ogImage = "https://milkudairy.com/logo.jpeg",
    ogType = "website",
    schema
}) => {
    const siteName = "Milku® — Jay Gayatri Dairy";
    const author = "Jay Gayatri Dairy Products";
    const defaultTitle = "Milku — Jay Gayatri Dairy | Pure Milk & Dairy Products";
    const defaultDescription = "Milku by Jay Gayatri Dairy delivers 100% pure milk and dairy products in Surat and Gujarat. Fresh Malai Paneer, traditional Bilona A2 Desi Cow Ghee, Buffalo Ghee, thick Dahi (Curd), refreshing Chaas (Buttermilk), Shrikhand, Lassi, Basundi, Penda, Barfi, Mava & traditional Indian sweets.";

    // Fallback logic for various props
    const fullTitle = title || defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalCanonical = canonical || "https://milkudairy.com";
    
    // Combine page-specific keywords with universal base keywords
    const finalKeywords = keywords 
        ? `${keywords}, ${BASE_KEYWORDS}`
        : BASE_KEYWORDS;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <meta name="author" content={author} />
            <meta name="publisher" content="Milku — Jay Gayatri Dairy" />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={finalCanonical} />

            {/* Geo Location Tags for Local SEO (Surat & Gujarat) */}
            <meta name="geo.region" content="IN-GJ" />
            <meta name="geo.placename" content="Surat, Gujarat, India" />
            <meta name="geo.position" content="21.1702;72.8311" />
            <meta name="ICBM" content="21.1702, 72.8311" />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={finalCanonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
