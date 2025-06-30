import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://insightflow.ai'),
  title: {
    default: 'Insight Flow - AI-Powered Trading Intelligence Platform',
    template: '%s | Insight Flow',
  },
  description: 'The next-gen AI thinking system for traders. Listen when traders speak, reflect when they act, coach when they stumble.',
  keywords: ['trading', 'AI', 'strategy builder', 'backtesting', 'journal', 'market analysis', 'trading education'],
  authors: [{ name: 'Insight Flow Team' }],
  creator: 'Insight Flow',
  publisher: 'Insight Flow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Insight Flow - AI-Powered Trading Intelligence',
    description: 'The next-gen AI thinking system for traders',
    url: 'https://insightflow.ai',
    siteName: 'Insight Flow',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Insight Flow Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insight Flow - AI Trading Intelligence',
    description: 'The next-gen AI thinking system for traders',
    creator: '@insightflow',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn(
        inter.variable,
        'font-sans antialiased min-h-screen bg-background'
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
} 