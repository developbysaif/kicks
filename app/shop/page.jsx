import React from 'react';
import ShopClient from './ShopClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

export const metadata = {
  title: 'Shop All Cleaning & Shoe Care Products | Kick Home Care',
  description:
    "Explore Pakistan's premier catalog of shoe cleaners, bleach liquid, drain openers, surface cleaners, and pest control essentials with nationwide delivery.",
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: 'Shop All Cleaning & Shoe Care Products | Kick Home Care',
    description:
      "Explore Pakistan's premier catalog of shoe cleaners, bleach liquid, drain openers, and surface cleaners.",
    url: `${SITE_URL}/shop`,
    siteName: 'Kick Home Care',
    type: 'website',
    images: [
      {
        url: '/kick%20logo.png',
        width: 1200,
        height: 630,
        alt: 'Kick Home Care Products Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Cleaning & Shoe Care Products | Kick Home Care',
    description:
      "Explore Pakistan's premier catalog of shoe cleaners, bleach liquid, drain openers, and surface cleaners.",
    images: ['/kick%20logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: `${SITE_URL}/shop`,
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/shop`,
      url: `${SITE_URL}/shop`,
      name: 'Kick Home Care Catalog',
      description:
        "Complete catalog of household cleaning, shoe care, washroom hygiene, and pest control products.",
      isPartOf: {
        '@type': 'WebSite',
        name: 'Kick Home Care',
        url: SITE_URL,
      },
    },
  ],
};

export default function ShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopClient />
    </>
  );
}
