import ShoeCareClient from './ShoeCareClient';

export const metadata = {
  title: 'Shoe Care Products | Cleaners, Protectors & Accessories | Kick Home Care',
  description:
    'Explore shoe care products for cleaning, protecting and maintaining sneakers, leather shoes and everyday footwear. Safe formulas for leather, canvas, mesh, and suede.',
  alternates: {
    canonical: 'https://kickhomecare.com/shop/shoe-care'
  },
  openGraph: {
    title: 'Shoe Care Products | Cleaners, Protectors & Accessories | Kick Home Care',
    description:
      'Explore shoe care products for cleaning, protecting and maintaining sneakers, leather shoes and everyday footwear.',
    url: 'https://kickhomecare.com/shop/shoe-care',
    siteName: 'Kick Home Care',
    images: [
      {
        url: '/shoe-care-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'Kick Premium Shoe Care Products'
      }
    ],
    locale: 'en_PK',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Care Products | Cleaners, Protectors & Accessories',
    description:
      'Explore shoe care products for cleaning, protecting and maintaining sneakers, leather shoes and everyday footwear.',
    images: ['/shoe-care-hero.jpg']
  }
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
          item: 'https://kickhomecare.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://kickhomecare.com/shop'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Shoe Care',
          item: 'https://kickhomecare.com/shop/shoe-care'
        }
      ]
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://kickhomecare.com/shop/shoe-care',
      url: 'https://kickhomecare.com/shop/shoe-care',
      name: 'Shoe Care Products | Cleaners, Protectors & Accessories',
      description:
        'Explore shoe care products for cleaning, protecting and maintaining sneakers, leather shoes and everyday footwear.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Kick Home Care',
        url: 'https://kickhomecare.com/'
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What shoe materials can these products be used on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our shoe care range includes targeted formulations safe for smooth leather, sports mesh, durable canvas, synthetic fabrics, knit uppers, and delicate suede or nubuck when applied as directed.'
          }
        },
        {
          '@type': 'Question',
          name: 'How often should I clean my shoes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For everyday footwear and sneakers, a quick wipe and light dry-brushing after 2 to 3 wears is recommended. Deep foam washing should be done every 2 to 4 weeks depending on exposure to dust and outdoor conditions.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can shoe cleaner be used on sneakers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our Kick Whito and active foam sneaker cleaners are specially formulated for white rubber soles, boost midsoles, fabric mesh, and athletic sneaker materials without yellowing or fiber degradation.'
          }
        },
        {
          '@type': 'Question',
          name: 'How should leather shoes be maintained?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'First remove surface dust with a horsehair brush. Apply a small amount of Kick Super Liquid Polish or Wax Tin evenly using a sponge or soft cloth. Allow to dry for 5 minutes, then buff lightly with a clean horsehair brush for a natural, nourished shine.'
          }
        }
      ]
    }
  ]
};

export default function ShoeCarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShoeCareClient />
    </>
  );
}
