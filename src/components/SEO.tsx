
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png",
  url = "https://rapatin.id",
  type = "website",
  canonicalUrl,
  author,
  publishedTime,
  modifiedTime,
  articleSection
}) => {
  const fullImageUrl = image.startsWith('http') ? image : `https://rapatin.id${image}`;
  const pageUrl = canonicalUrl || url;
  
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
      {articleSection && <meta property="article:section" content={articleSection} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@rapatin_id" />
      {author && <meta name="twitter:creator" content={`@${author}`} />}
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
