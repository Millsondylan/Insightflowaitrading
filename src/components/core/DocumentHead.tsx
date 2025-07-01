
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DocumentHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * DocumentHead component for managing SEO metadata across the application
 */
export default function DocumentHead({
  title,
  description = "AI-powered trading insights, strategy building, and market analysis - InsightFlow AI Trading",
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image"
}: DocumentHeadProps) {
  
  // Ensure title has site name
  const fullTitle = title.includes('InsightFlow') 
    ? title 
    : `${title} | InsightFlow AI Trading`;
    
  // Get current URL if canonical not provided
  const url = canonicalUrl || typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={url} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional metadata */}
      <meta name="application-name" content="InsightFlow AI" />
      <meta name="theme-color" content="#1A1A2E" />
    </Helmet>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
