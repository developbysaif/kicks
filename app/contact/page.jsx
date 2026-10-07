import React from 'react';
import ContactClient from './ContactClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

export const metadata = {
  title: 'Contact Us | Customer Care & Support | Kick Home Care',
  description:
    'Get in touch with the Kick Home Care team in Lahore, Pakistan. Call +92-300-1234567 or message us for order inquiries, wholesale, or product assistance.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Us | Customer Care & Support | Kick Home Care',
    description:
      'Get in touch with the Kick Home Care team in Lahore, Pakistan. Call +92-300-1234567 or message us for order inquiries.',
    url: `${SITE_URL}/contact`,
    siteName: 'Kick Home Care',
    type: 'website',
    images: [
      {
        url: '/kick%20logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Kick Home Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Kick Home Care',
    description:
      'Get in touch with the Kick Home Care team in Lahore, Pakistan. Call +92-300-1234567 or message us for order inquiries.',
    images: ['/kick%20logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact`,
      url: `${SITE_URL}/contact`,
      name: 'Contact Kick Home Care',
      description:
        'Official contact and customer support portal for Kick Home Care, Pakistan.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Kick Home Care',
        url: SITE_URL,
      },
    },
    {
      '@type': 'LocalBusiness',
      name: 'Kick Home Care',
      image: `${SITE_URL}/kick%20logo.png`,
      telephone: '+92-300-1234567',
      email: 'info@kickhomecare.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'First Floor 1-F Block, Main Gulshan-e-Ravi',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        postalCode: '54000',
        addressCountry: 'PK',
      },
      url: SITE_URL,
    },
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
          name: 'Contact Us',
          item: `${SITE_URL}/contact`,
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
