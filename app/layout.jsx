import './globals.css';
import Providers from '@/components/Providers';
import { Inter, Dancing_Script } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
  weight: ['600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kick Home Care | Kara Asani Zindagi Main',
    template: '%s | Kick Home Care'
  },
  description: "Pakistan's premier home care e-commerce platform for Shoe Care, Bleach, Liquid Cleaners, Drain Openers, and Pest Control Solutions.",
  applicationName: 'Kick Home Care',
  authors: [{ name: 'Kick Home Care', url: SITE_URL }],
  generator: 'Next.js',
  keywords: [
    'Kick Home Care',
    'Shoe Polish Pakistan',
    'Shoe Cleaner',
    'Bleach Liquid',
    'Drain Opener',
    'Home Cleaning',
    'Phenyl',
    'Mosquito Spray',
    'Ibn Khushi'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Kick Home Care',
  publisher: 'Kick Home Care',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: SITE_URL,
    siteName: 'Kick Home Care',
    title: 'Kick Home Care | Kara Asani Zindagi Main',
    description: "Pakistan's premier home care e-commerce platform for Shoe Care, Bleach, Liquid Cleaners, Drain Openers, and Pest Control Solutions.",
    images: [
      {
        url: '/kick%20logo.png',
        width: 1200,
        height: 630,
        alt: 'Kick Home Care Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kick Home Care | Kara Asani Zindagi Main',
    description: "Pakistan's premier home care e-commerce platform for Shoe Care, Bleach, Liquid Cleaners, and Drain Openers.",
    images: ['/kick%20logo.png']
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
    }
  },
  icons: {
    icon: '/fav-icon-kick.png',
    apple: '/fav-icon-kick.png',
  },
};

export const viewport = {
  themeColor: '#D0161D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Kick Home Care',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/kick%20logo.png`,
        caption: 'Kick Home Care'
      },
      image: `${SITE_URL}/kick%20logo.png`,
      sameAs: [
        'https://www.facebook.com/kickhomecare',
        'https://www.instagram.com/kickhomecare'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+92-300-1234567',
        contactType: 'customer support',
        areaServed: 'PK',
        availableLanguage: ['en', 'ur']
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Kick Home Care',
      description: "Kara Asani Zindagi Main - Premium household and shoe care solutions.",
      publisher: {
        '@id': `${SITE_URL}/#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/shop?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans bg-white text-slate-800 antialiased min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
