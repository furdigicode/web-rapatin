
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  structuredData?: object;
  noindex?: boolean;
  locale?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png",
  imageAlt,
  url = "https://rapatin.id",
  type = "website",
  canonicalUrl,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags,
  structuredData,
  noindex = false,
  locale = "id_ID",
}) => {
  const robotsContent = noindex ? "noindex, follow" : "index, follow";
  const fullImageUrl = image.startsWith('http') ? image : `https://rapatin.id${image}`;
  const pageUrl = canonicalUrl || url;
  const finalImageAlt = imageAlt || title;
  
  // Default organization structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rapatin",
    "url": "https://rapatin.id",
    "logo": "https://rapatin.id/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png",
    "description": "Platform meeting online pay-as-you-go terpercaya di Indonesia",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-877-8898-0084",
      "contactType": "customer service",
      "email": "halo@rapatin.id"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Semarang",
      "addressCountry": "Indonesia"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:site_name" content="Rapatin" />
      <meta property="og:locale" content={locale} />
      {articleSection && <meta property="article:section" content={articleSection} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {articleTags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta name="twitter:site" content="@rapatin_id" />
      {author && <meta name="twitter:creator" content="@rapatin_id" />}
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
