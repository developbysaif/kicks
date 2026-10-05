import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

export const categoriesSeed = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    description: 'Premium shoe shiners, white sneaker cleaners, polish sponges, shoe wax, deodorizers, and brushes.',
    imageUrl: '/Shoe Care.png',
    bannerUrl: '/Shoe Care.png',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    description: 'High performance bleach liquid, blue whitening agents, and fabric conditioners for brilliant clothes.',
    imageUrl: '/laundry Care.png',
    bannerUrl: '/laundry Care.png',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'All-purpose surface cleaners, descaling bathroom sprays, and heavy duty toilet cleaner power gels.',
    imageUrl: '/Home Cleaning.png',
    bannerUrl: '/Home Cleaning.png',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    description: 'Tough grease-cutting dishwashing liquids infused with lemon oil and heavy duty dish sponges.',
    imageUrl: '/dish care.png',
    bannerUrl: '/dish care.png',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Washroom Cleaning',
    slug: 'washroom-cleaning',
    description: 'Fast acting liquid drain openers, bathroom cleaners, and toilet gels for sparkling clean washrooms.',
    imageUrl: '/washroom cleaning.png',
    bannerUrl: '/washroom cleaning.png',
    sortOrder: 5,
    isActive: true
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    description: 'Electric liquid mosquito repellents, anti-mosquito skin lotions, coils, and multi-insect sprays.',
    imageUrl: '/mosquito protection.png',
    bannerUrl: '/mosquito protection.png',
    sortOrder: 6,
    isActive: true
  }
];

export async function seedDatabase() {
  const db = await connectDB();
  if (!db) {
    console.warn('Skipping MongoDB seed: No database connection established.');
    return;
  }

  console.log('Seeding categories...');
  const catMap = {};
  for (const catData of categoriesSeed) {
    const cat = await Category.findOneAndUpdate(
      { slug: catData.slug },
      { $set: catData },
      { upsert: true, new: true }
    );
    catMap[cat.slug] = cat._id;
  }

  console.log('Seeding products...');
  const products = [
    {
      name: 'Kick Bleach Liquid',
      slug: 'kick-bleach-liquid',
      categoryId: catMap['laundry-care'],
      sizeLabel: '1 Litre',
      price: 425,
      compareAtPrice: 500,
      stock: 150,
      sku: 'KICK-BLC-1000',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 499,
      images: ['/whitner bleach.png', '/laundry Care.png'],
      shortDescription: 'Heavy-duty stain removal & germ protection for brilliant white fabrics.',
      description: 'Kick Bleach Liquid Ultra Clean keeps your fabrics brilliantly bright, fresh, and hygienic wash after wash. Specially formulated for Pakistani cottons and white fabrics to remove yellowing and stubborn tea/curry stains.',
      seoTitle: 'Kick Bleach Liquid 1 Litre | KICK Home Care',
      seoDescription: 'Buy Kick Bleach Liquid 1 Litre in Pakistan for brilliant white clothes and hospital-grade sanitization.'
    },
    {
      name: 'Kick Whitner Bleach Liquid 500ml',
      slug: 'kick-whitner-bleach-500ml',
      categoryId: catMap['laundry-care'],
      sizeLabel: '500ml',
      price: 220,
      compareAtPrice: 250,
      stock: 120,
      sku: 'KICK-WBL-500',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 140,
      images: ['/laundry Care.png', '/whitner bleach.png'],
      shortDescription: 'Optic whitener and gentle bleach liquid for fine apparel.',
      description: 'Gentle yet powerful bleaching liquid designed for everyday laundry cycles. Safe on cotton blends and linens.',
      seoTitle: 'Kick Whitner Bleach Liquid 500ml | KICK Home Care',
      seoDescription: 'Kick Whitner Bleach Liquid 500ml restores dazzling whites safely and economically.'
    },
    {
      name: 'Kick Dishwash Liquid',
      slug: 'kick-dishwash-liquid',
      categoryId: catMap['dish-care'],
      sizeLabel: '500ml',
      price: 315,
      compareAtPrice: 350,
      stock: 200,
      sku: 'KICK-DW-500',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 156,
      images: ['/dish wash liquid.png', '/dish care.png'],
      shortDescription: 'Lemon fresh high-active grease cutting dish liquid.',
      description: 'Infused with natural lemon extract to lift tough grease and dry food residues with a single drop. Gentle on hands while leaving utensils squeaky clean.',
      seoTitle: 'Kick Dishwash Liquid 500ml | KICK Home Care',
      seoDescription: 'High grease-cutting lemon dishwashing liquid for sparkling kitchen utensils.'
    },
    {
      name: 'Kick Dishwash Liquid One-Kick Drop 1 Litre',
      slug: 'kick-dishwash-liquid-1l',
      categoryId: catMap['dish-care'],
      sizeLabel: '1 Litre',
      price: 430,
      compareAtPrice: 490,
      stock: 150,
      sku: 'KICK-DW-1000',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 320,
      images: ['/dish care.png', '/dish wash liquid.png'],
      shortDescription: 'Economy 1 Litre pump dispenser for heavy duty family dish care.',
      description: 'High concentrated formula cutting through heavy oil, burnt pans, and curry oils effortlessly.',
      seoTitle: 'Kick Dishwash Liquid 1 Litre | KICK Home Care',
      seoDescription: 'Economy 1 Litre dispenser dishwashing liquid for high-volume Pakistani kitchens.'
    },
    {
      name: 'Kick White Sneaker Cleaner',
      slug: 'kick-white-sneaker-cleaner',
      categoryId: catMap['shoe-care'],
      sizeLabel: '500ml',
      price: 380,
      compareAtPrice: 420,
      stock: 160,
      sku: 'KICK-WHITO-500',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 82,
      images: ['/Shoe Care.png', '/promo-shoe.jpg'],
      shortDescription: 'Optic white sneaker restorer and midsole stain eraser sponge.',
      description: 'Kick Whito Sneaker Cleaner restores optic white brightness to sneakers, midsoles, rubber caps, and sports canvas footwear without harming material.',
      seoTitle: 'Kick White Sneaker Cleaner 500ml | KICK Home Care',
      seoDescription: 'Best white shoe cleaner and sneaker restorer in Pakistan with built-in applicator.'
    },
    {
      name: 'Liquid Shoe Polish',
      slug: 'liquid-shoe-polish',
      categoryId: catMap['shoe-care'],
      sizeLabel: '75ml',
      price: 520,
      compareAtPrice: null,
      stock: 250,
      sku: 'KICK-LSP-GRP',
      variants: [
        {
          title: 'Shade',
          options: [
            { name: 'Black', price: 520, compareAtPrice: null, sku: 'KICK-LSP-BLK', stock: 120, image: '/liquid shoe polish.png' },
            { name: 'Brown', price: 520, compareAtPrice: null, sku: 'KICK-LSP-BRN', stock: 80, image: '/liquid shoe polish.png' },
            { name: 'Neutral', price: 520, compareAtPrice: null, sku: 'KICK-LSP-NEU', stock: 50, image: '/liquid shoe polish.png' }
          ]
        }
      ],
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 72,
      images: ['/liquid shoe polish.png', '/Shoe Care.png'],
      shortDescription: 'Natural carnauba wax liquid polish in Black, Brown, and Neutral.',
      description: 'Enriched with genuine Brazilian carnauba wax for deep leather nourishing, waterproof seal, and instant mirror shine.',
      seoTitle: 'Liquid Shoe Polish (Black, Brown, Neutral) | KICK Home Care',
      seoDescription: 'Premium liquid shoe polish enriched with carnauba wax for formal leather footwear.'
    },
    {
      name: 'Kick Active Foam Sneaker Cleanser',
      slug: 'kick-active-foam-sneaker-cleanser',
      categoryId: catMap['shoe-care'],
      sizeLabel: '200ml Active Pump',
      price: 440,
      compareAtPrice: 490,
      stock: 90,
      sku: 'KICK-AF-200',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 114,
      images: ['/shoe-care-hero.jpg', '/Shoe Care.png'],
      shortDescription: 'Self-foaming sneaker cleanser for mesh, canvas, and knit footwear.',
      description: 'Ready-to-use self-foaming solution that breaks down stubborn street grime, dirt, and coffee stains effortlessly.',
      seoTitle: 'Kick Active Foam Sneaker Cleanser | KICK Home Care',
      seoDescription: 'Instant foaming cleaner for athletic shoes and lifestyle sneakers.'
    },
    {
      name: 'Kick Hydrophobic Shield Rain & Stain Protector',
      slug: 'kick-hydrophobic-shield-protector',
      categoryId: catMap['shoe-care'],
      sizeLabel: '250ml Aerosol',
      price: 590,
      compareAtPrice: 650,
      stock: 110,
      sku: 'KICK-HSHIELD-250',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 93,
      images: ['/shoe-care-hero.jpg', '/Shoe Care.png'],
      shortDescription: 'Breathable nano-coating barrier repelling water, rainwater, and stains.',
      description: 'Breathable nano-coating barrier repelling liquids, rainwater, road slush, and dust for up to 4 weeks.',
      seoTitle: 'Kick Hydrophobic Shield Protector | KICK Home Care',
      seoDescription: 'Nano-waterproof spray barrier for leather, nubuck, and canvas shoes.'
    },
    {
      name: 'Kick Ergonomic 100% Horsehair Shoe Brush',
      slug: 'kick-ergonomic-horsehair-shoe-brush',
      categoryId: catMap['shoe-care'],
      sizeLabel: 'Solid Hardwood Handle',
      price: 280,
      compareAtPrice: 320,
      stock: 85,
      sku: 'KICK-BRUSH-HH',
      isFeatured: false,
      isActive: true,
      ratingAvg: 4.8,
      ratingCount: 64,
      images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
      shortDescription: 'Ultra-soft dense natural horsehair bristles for buffing leather.',
      description: 'Ultra-soft dense natural horsehair bristles buff polish to mirror luster without scratching tender leather grains.',
      seoTitle: 'Horsehair Shoe Brush | KICK Home Care',
      seoDescription: '100% natural horsehair brush for high-gloss leather buffing.'
    },
    {
      name: 'Kick Fresh Shoe & Sneaker Deodorizer Spray',
      slug: 'kick-fresh-shoe-deodorizer-spray',
      categoryId: catMap['shoe-care'],
      sizeLabel: '150ml Mist Spray',
      price: 340,
      compareAtPrice: 380,
      stock: 140,
      sku: 'KICK-FRESH-150',
      isFeatured: false,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 78,
      images: ['/shoe-care-hero.jpg', '/Shoe Care.png'],
      shortDescription: 'Botanical tea tree & eucalyptus antimicrobial shoe deodorizer.',
      description: 'Botanical tea tree & eucalyptus formula neutralizes microbial odors at the source for round-the-clock fresh footwear.',
      seoTitle: 'Shoe Deodorizer Spray | KICK Home Care',
      seoDescription: 'Antibacterial shoe freshener spray eliminating sweat odors immediately.'
    },
    {
      name: 'Kick Super Wax Shoe Polish Tin 50g',
      slug: 'kick-super-wax-shoe-polish-tin',
      categoryId: catMap['shoe-care'],
      sizeLabel: '50g Classic Metal Tin',
      price: 220,
      compareAtPrice: 240,
      stock: 180,
      sku: 'KICK-WAX-TIN50',
      variants: [
        {
          title: 'Shade',
          options: [
            { name: 'Black', price: 220, compareAtPrice: 240, sku: 'KICK-WAX-TIN50-BLK', stock: 100, image: '/Shoe Care.png' },
            { name: 'Brown', price: 220, compareAtPrice: 240, sku: 'KICK-WAX-TIN50-BRN', stock: 80, image: '/Shoe Care.png' }
          ]
        }
      ],
      isFeatured: false,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 152,
      images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
      shortDescription: 'Heritage military-grade solid beeswax formula for formal footwear.',
      description: 'Heritage military-grade solid beeswax formula for deep recoloring, scuff concealing, and mirror spit shine.',
      seoTitle: 'Kick Shoe Polish Wax Tin 50g | KICK Home Care',
      seoDescription: 'Heritage solid shoe wax tin for mirror spit shine and water protection.'
    },
    {
      name: 'Kick Instant Shoe Shiner Sponge',
      slug: 'kick-instant-shoe-shiner-sponge',
      categoryId: catMap['shoe-care'],
      sizeLabel: 'Mess-free travel sponge',
      price: 200,
      compareAtPrice: 220,
      stock: 200,
      sku: 'KICK-SHINE-SPG',
      isFeatured: false,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 96,
      images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
      shortDescription: 'Mess-free pre-lubricated silicone buffer sponge.',
      description: 'Compact travel sponge pre-impregnated with silicone oils. Restores instant glossy finish without buffing.',
      seoTitle: 'Instant Shoe Shiner Sponge | KICK Home Care',
      seoDescription: 'Travel shoe shine sponge for instant glossy leather.'
    },
    {
      name: 'Kick Perfumed White Phenyle 2.75L',
      slug: 'kick-perfumed-white-phenyle',
      categoryId: catMap['home-cleaning'],
      sizeLabel: '2.75 Litre Bottle',
      price: 580,
      compareAtPrice: 650,
      stock: 130,
      sku: 'KICK-PHN-2750',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 210,
      images: ['/Home Cleaning.png', '/phenyle.png'],
      shortDescription: 'Disinfectant perfumed white floor phenyle eliminating 99.9% germs.',
      description: 'Formulated with high emulsifying pines to leave marble and tiled floors spotless, sparkling, and smelling of long-lasting lavender freshness.',
      seoTitle: 'Kick Perfumed White Phenyle 2.75L | KICK Home Care',
      seoDescription: 'Premium perfumed white phenyle for germ-free and fragrant home floors.'
    },
    {
      name: 'Kick Surface Cleaner Floor Mop Liquid',
      slug: 'kick-surface-cleaner-liquid',
      categoryId: catMap['home-cleaning'],
      sizeLabel: '1 Litre',
      price: 340,
      compareAtPrice: 380,
      stock: 140,
      sku: 'KICK-SURF-1000',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 95,
      images: ['/phenyle.png', '/Home Cleaning.png'],
      shortDescription: 'Multipurpose surface and countertop cleaner.',
      description: 'Streak-free antibacterial liquid for granite countertops, ceramic tiles, and glass surfaces.',
      seoTitle: 'Kick Surface Cleaner 1L | KICK Home Care',
      seoDescription: 'Antibacterial floor and surface cleaning liquid for modern homes.'
    },
    {
      name: 'Kick Drain Opener Fast Acting 1 Litre',
      slug: 'kick-drain-opener',
      categoryId: catMap['washroom-cleaning'],
      sizeLabel: '1 Litre Bottle',
      price: 520,
      compareAtPrice: null,
      stock: 175,
      sku: 'KICK-DRN-1000',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 170,
      images: ['/kick drain opener.png', '/washroom cleaning.png'],
      shortDescription: 'Heavy-duty liquid drain opener clearing pipes in 15 minutes.',
      description: 'Powerful chemical drain opener engineered to dissolve hair, soap buildup, grease, and slime clogging bathroom sinks and shower drains.',
      seoTitle: 'Kick Drain Opener 1 Litre | KICK Home Care',
      seoDescription: 'Fast-acting liquid drain opener clearing clogged sinks and pipes in minutes.'
    },
    {
      name: 'Kick 10X Bathroom & Toilet Power Cleaner',
      slug: 'kick-toilet-bathroom-cleaner',
      categoryId: catMap['washroom-cleaning'],
      sizeLabel: '500ml Angled Nozzle',
      price: 390,
      compareAtPrice: 450,
      stock: 160,
      sku: 'KICK-TC-500',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 112,
      images: ['/washroom cleaning.png', '/kick drain opener.png'],
      shortDescription: '10X limescale remover with angled rim nozzle.',
      description: 'Thick gel formula clings to toilet bowls and bathroom tile grout to dissolve limescale, rust, and water stains.',
      seoTitle: 'Kick 10X Toilet & Bathroom Cleaner | KICK Home Care',
      seoDescription: 'Thick active gel limescale and stain remover for washrooms.'
    },
    {
      name: 'Kick Mosquit Advance Liquid Machine + Refill',
      slug: 'kick-mosquito-advance-machine-refill',
      categoryId: catMap['mosquito-protection'],
      sizeLabel: '45ml (60 Nights)',
      price: 680,
      compareAtPrice: null,
      stock: 220,
      sku: 'KICK-MOSQ-SET',
      isFeatured: true,
      isActive: true,
      ratingAvg: 5.0,
      ratingCount: 203,
      images: ['/mosquito protection.png'],
      shortDescription: 'Dual-mode electric mosquito repellent vaporizer with 60-night refill.',
      description: 'Continuous protection against dengue and malaria mosquitoes. Features dual heater mode for high and normal room settings.',
      seoTitle: 'Kick Mosquito Machine + Refill (60 Nights) | KICK Home Care',
      seoDescription: 'Electric liquid mosquito killer machine with 60 nights refill bottle.'
    },
    {
      name: 'Kick Mosquit Repellent Aerosol Spray 300ml',
      slug: 'kick-mosquito-spray-300ml',
      categoryId: catMap['mosquito-protection'],
      sizeLabel: '300ml Can',
      price: 480,
      compareAtPrice: 550,
      stock: 180,
      sku: 'KICK-MOSQ-SP300',
      isFeatured: true,
      isActive: true,
      ratingAvg: 4.9,
      ratingCount: 88,
      images: ['/mosquito protection.png'],
      shortDescription: 'Fast knockout aerosol spray against mosquitoes and flying insects.',
      description: 'Instant knockdown formulation for immediate indoor flying insect protection with pleasant floral fragrance.',
      seoTitle: 'Kick Mosquito Aerosol Spray 300ml | KICK Home Care',
      seoDescription: 'Instant kill insect spray for mosquitoes, flies, and dengue vectors.'
    }
  ];

  for (const prodData of products) {
    await Product.findOneAndUpdate(
      { slug: prodData.slug },
      { $set: prodData },
      { upsert: true, new: true }
    );
  }

  console.log('Seeding promo coupons...');
  const coupons = [
    {
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      minOrder: 1000,
      maxUses: 500,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      code: 'KICK100',
      type: 'fixed',
      value: 100,
      minOrder: 1500,
      maxUses: 200,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  ];

  for (const c of coupons) {
    await Coupon.findOneAndUpdate(
      { code: c.code },
      { $set: c },
      { upsert: true, new: true }
    );
  }

  console.log(`Database seeded successfully! (${categoriesSeed.length} categories, ${products.length} products, ${coupons.length} coupons)`);
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('seed.mjs') || process.argv[1]?.includes('seed')) {
  seedDatabase()
    .then(() => {
      console.log('Seed command completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
