import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    description: 'Premium shoe shiners, white sneaker cleaners, polish sponges, shoe wax, deodorizers, and brushes.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    description: 'High performance bleach liquid, blue whitening agents, and fabric conditioners for brilliant clothes.',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'All-purpose surface cleaners, descaling bathroom sprays, and heavy duty toilet cleaner power gels.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    description: 'Tough grease-cutting dishwashing liquids infused with lemon oil and heavy duty dish sponges.',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Drain Care',
    slug: 'drain-care',
    description: 'Fast acting liquid drain openers and pipe clog unblocker powders for sinks and bathroom drains.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    description: 'Electric liquid mosquito repellents, anti-mosquito skin lotions, coils, and multi-insect sprays.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    isActive: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kickhomecare');
    console.log('Database connected for expanded seeding...');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();

    // Create Admin and Customer Users
    const adminUser = await User.create({
      name: 'Kick Admin',
      email: 'admin@kickhomecare.com',
      password: 'admin123',
      role: 'admin',
      phone: '+923210009008',
      addresses: [
        {
          fullName: 'Kick Home Care Head Office',
          phone: '+923210009008',
          addressLine: 'First Floor 1-F Block, Main Gulshan-e-Ravi',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
          country: 'Pakistan',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'Rayyan Ansari',
      email: 'user@kickhomecare.com',
      password: 'user123',
      role: 'customer',
      phone: '+923001234567',
      addresses: [
        {
          fullName: 'Rayyan Ansari',
          phone: '+923001234567',
          addressLine: 'House 45, Street 12, DHA Phase 5',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
          country: 'Pakistan',
          isDefault: true
        }
      ]
    });

    console.log('Users created: Admin & Customer');

    // Create Categories
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    // Create 19 Authentic Kick Home Care Products
    const productsData = [
      // --- SHOE CARE ---
      {
        name: 'Kick Whito - White Sneaker & Joggers Cleaner',
        slug: 'kick-whito-white-sneaker-cleaner',
        description: 'Kick Whito is specially formulated for restoring brilliant white shine to leather, canvas, and rubber soles of sneakers and sports shoes. Removes tough scuffs and yellowing instantly without ruining material.',
        shortDescription: 'Instant white sneaker restorer and stain remover sponge applicator.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
        ],
        price: 250,
        salePrice: 220,
        stock: 150,
        sku: 'KICK-WHITO-100',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 68,
        tags: ['sneakers', 'shoe polish', 'whito', 'joggers', 'white shoes'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Application', value: 'White Shoes & Sneaker Soles' },
          { key: 'Volume', value: '100ml Applicator' }
        ]
      },
      {
        name: 'Kick Joggers & Canvas Cleaner Solution',
        slug: 'kick-joggers-canvas-cleaner',
        description: 'Deep foam action cleaner specifically engineered for sports joggers, mesh sneakers, and canvas footwear. Removes ingrained mud and dust while preserving colors.',
        shortDescription: 'Active foam cleanser for sports joggers & canvas shoes.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
        ],
        price: 260,
        salePrice: 240,
        stock: 100,
        sku: 'KICK-JOG-150',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 38,
        tags: ['joggers', 'canvas', 'foam cleaner'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Suitability', value: 'Mesh, Canvas & Sports Shoes' }
        ]
      },
      {
        name: 'Kick Super Liquid Shoe Polish',
        slug: 'kick-super-liquid-shoe-polish',
        description: 'Premium quick-drying liquid shoe polish enriched with natural carnauba wax. Provides intense color depth and long-lasting gloss protection against water and soil.',
        shortDescription: 'Instant high-shine wax liquid polish for leather shoes.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
        ],
        price: 250,
        salePrice: 220,
        stock: 120,
        sku: 'KICK-SP-BLACK',
        variations: [
          {
            title: 'Shade',
            options: [
              { name: 'Black', price: 250, salePrice: 220, sku: 'KICK-SP-BLACK', stock: 60 },
              { name: 'Brown', price: 250, salePrice: 220, sku: 'KICK-SP-BROWN', stock: 35 },
              { name: 'Neutral', price: 250, salePrice: 220, sku: 'KICK-SP-NEUTRAL', stock: 25 }
            ]
          }
        ],
        hasVariations: true,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 45,
        tags: ['shoe polish', 'leather', 'black polish', 'brown polish'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Wax Type', value: 'Natural Carnauba Wax' }
        ]
      },
      {
        name: 'Kick Super Shoe Polish Wax Tin 50g',
        slug: 'kick-super-shoe-polish-wax-tin-50g',
        description: 'Traditional solid wax shoe polish tin for military-grade spit shine and deep leather nourishing. Protects boots and formal shoes from cracking.',
        shortDescription: 'Classic 50g solid wax shoe polish tin for formal shoes.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
        ],
        price: 240,
        salePrice: 220,
        stock: 180,
        sku: 'KICK-WAX-50G',
        variations: [
          {
            title: 'Shade',
            options: [
              { name: 'Black', price: 240, salePrice: 220, sku: 'KICK-WAX-BLK', stock: 100 },
              { name: 'Brown', price: 240, salePrice: 220, sku: 'KICK-WAX-BRN', stock: 80 }
            ]
          }
        ],
        hasVariations: true,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 52,
        tags: ['wax tin', 'shoe polish', 'leather wax'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Weight', value: '50g' }
        ]
      },
      {
        name: 'Kick Instant Shoe Shiner Sponge',
        slug: 'kick-instant-shoe-shiner-sponge',
        description: 'Compact travel sponge pre-impregnated with silicone oils. Restores instant glossy finish to leather shoes, boots, jackets, and handbags without buffing.',
        shortDescription: 'Mess-free travel silicone shiner sponge.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 220,
        salePrice: 190,
        stock: 200,
        sku: 'KICK-SPONGE-INST',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 60,
        tags: ['shiner', 'sponge', 'shoe care', 'travel'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },
      {
        name: 'Kick Horsehair Shoe Polish Brush',
        slug: 'kick-horsehair-shoe-polish-brush',
        description: 'Ergonomic wooden shoe brush crafted with natural horsehair bristles for optimal wax distribution and high-shine buffing without scratching fine leather.',
        shortDescription: 'Natural horsehair wooden shoe buffing brush.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
        ],
        price: 350,
        salePrice: 290,
        stock: 60,
        sku: 'KICK-BRUSH-WOOD',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 19,
        tags: ['brush', 'horsehair', 'shoe buffer'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Material', value: 'Natural Horsehair & Hardwood' }
        ]
      },
      {
        name: 'Kick Foot & Shoe Deodorizer Spray',
        slug: 'kick-foot-shoe-deodorizer-spray',
        description: 'Antibacterial footwear spray that neutralizes odor-causing bacteria instantly, keeping shoes, boots, and feet fresh for 24 hours.',
        shortDescription: '24-hour odor defense spray for shoes and feet.',
        category: catMap['shoe-care'],
        images: [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 290,
        salePrice: 250,
        stock: 80,
        sku: 'KICK-DEO-150',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 14,
        tags: ['deodorizer', 'foot spray', 'freshness'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },

      // --- LAUNDRY CARE ---
      {
        name: 'Kick Bleach Liquid Ultra Clean',
        slug: 'kick-bleach-liquid-ultra-clean',
        description: 'Kick Bleach Liquid delivers powerful stain removal, whitening, and sanitization for white fabrics and household surfaces. Kills 99.9% of bacteria.',
        shortDescription: 'Multi-purpose whitening and disinfectant liquid bleach.',
        category: catMap['laundry-care'],
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        price: 250,
        salePrice: 220,
        stock: 150,
        sku: 'KICK-BLC-500',
        variations: [
          {
            title: 'Volume',
            options: [
              { name: '300ml', price: 140, salePrice: 125, sku: 'KICK-BLC-300', stock: 50 },
              { name: '500ml', price: 250, salePrice: 220, sku: 'KICK-BLC-500', stock: 150 },
              { name: '1 Litre', price: 390, salePrice: 350, sku: 'KICK-BLC-1000', stock: 90 }
            ]
          }
        ],
        hasVariations: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 74,
        tags: ['bleach', 'laundry', 'whitener', 'disinfectant'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Form', value: 'Liquid Concentrated Bleach' }
        ]
      },
      {
        name: 'Kick Fabric Blue Whitener Liquid',
        slug: 'kick-fabric-blue-whitener-liquid',
        description: 'Optical brightener for white clothes. Eliminates yellow tints from cotton and synthetic fabrics, leaving a crisp radiant blue tint shine.',
        shortDescription: 'Optical blue whitener for brilliant white clothes.',
        category: catMap['laundry-care'],
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        price: 180,
        salePrice: 160,
        stock: 110,
        sku: 'KICK-BLUE-250',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 22,
        tags: ['blue whitener', 'neel', 'laundry'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },
      {
        name: 'Kick Soft Touch Fabric Conditioner',
        slug: 'kick-soft-touch-fabric-conditioner',
        description: 'Infuses garments with long-lasting floral freshness while softening fabric fibers, reducing static cling, and simplifying ironing.',
        shortDescription: 'Floral scent fabric softening conditioner liquid.',
        category: catMap['laundry-care'],
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        price: 340,
        salePrice: 290,
        stock: 75,
        sku: 'KICK-SOFT-500',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 18,
        tags: ['fabric softener', 'conditioner', 'laundry'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },

      // --- HOME CLEANING ---
      {
        name: 'Kick All Purpose Surface Cleaner Spray',
        slug: 'kick-all-purpose-surface-cleaner-spray',
        description: 'Multi-surface disinfectant spray for countertops, glass, wood, and appliances. Cuts through grime and fingerprints effortlessly.',
        shortDescription: 'Multi-surface spray cleaner with fresh pine scent.',
        category: catMap['home-cleaning'],
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
        ],
        price: 280,
        salePrice: 240,
        stock: 90,
        sku: 'KICK-SURF-500',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 29,
        tags: ['surface cleaner', 'spray', 'home cleaning'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },
      {
        name: 'Kick Bathroom Cleaner & Scale Remover',
        slug: 'kick-bathroom-cleaner-scale-remover',
        description: 'Heavy duty descaling liquid that dissolves hard water stains, soap scum, and limescale on bathroom tiles, taps, and shower glass.',
        shortDescription: 'Limescale and hard water stain bathroom cleaner.',
        category: catMap['home-cleaning'],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 310,
        salePrice: 270,
        stock: 85,
        sku: 'KICK-BATH-500',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 34,
        tags: ['bathroom cleaner', 'descaler', 'tiles'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },
      {
        name: 'Kick Toilet Cleaner Power Gel',
        slug: 'kick-toilet-cleaner-power-gel',
        description: 'Thick disinfectant gel formula that coats toilet bowls to eliminate yellow stains, scale build-up, and germs below the waterline.',
        shortDescription: 'Thick disinfectant power gel for sparkling toilet bowls.',
        category: catMap['home-cleaning'],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 270,
        salePrice: 230,
        stock: 130,
        sku: 'KICK-TOILET-750',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 56,
        tags: ['toilet cleaner', 'power gel', 'disinfectant'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },

      // --- DISH CARE ---
      {
        name: 'Kick Dish Wash Liquid Lemon Fresh',
        slug: 'kick-dish-wash-liquid-lemon-fresh',
        description: 'Kick Dish Wash Liquid effectively cuts through tough grease, oil, and food residue on utensils leaving a refreshed citrus scent. Soft on hands and tough on stains.',
        shortDescription: 'Tough grease cutting dishwashing liquid with fresh lemon oil.',
        category: catMap['dish-care'],
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        price: 320,
        salePrice: 280,
        stock: 140,
        sku: 'KICK-DISH-500',
        variations: [
          {
            title: 'Size',
            options: [
              { name: '250ml', price: 180, salePrice: 160, sku: 'KICK-DISH-250', stock: 50 },
              { name: '500ml', price: 320, salePrice: 280, sku: 'KICK-DISH-500', stock: 140 },
              { name: '1 Litre', price: 540, salePrice: 480, sku: 'KICK-DISH-1000', stock: 80 }
            ]
          }
        ],
        hasVariations: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 82,
        tags: ['dishwash', 'lemon', 'kitchen', 'cleaner'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Fragrance', value: 'Lemon Fresh' }
        ]
      },
      {
        name: 'Kick Dishwashing Sponge & Scrub Paste Combo',
        slug: 'kick-dishwashing-paste-combo',
        description: 'Concentrated grease removal paste paired with a dual-sided anti-scratch scrub sponge for heavy burnt pots and pans.',
        shortDescription: 'Heavy duty dishwash paste & scrub sponge set.',
        category: catMap['dish-care'],
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        price: 190,
        salePrice: 165,
        stock: 95,
        sku: 'KICK-DISH-PASTE',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 21,
        tags: ['dishwash paste', 'scrubber', 'kitchen'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },

      // --- DRAIN CARE ---
      {
        name: 'Kick Heavy Duty Drain Opener Liquid',
        slug: 'kick-heavy-duty-drain-opener-liquid',
        description: 'Dissolves hair, grease, soap scum, and organic matter blocking kitchen sinks and bathroom drains in under 15 minutes. Safe for PVC and standard piping.',
        shortDescription: 'Fast acting clog remover and drain pipe unblocker.',
        category: catMap['drain-care'],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 350,
        salePrice: 290,
        stock: 110,
        sku: 'KICK-DRAIN-500',
        variations: [
          {
            title: 'Volume',
            options: [
              { name: '300ml', price: 190, salePrice: 170, sku: 'KICK-DRAIN-300', stock: 40 },
              { name: '500ml', price: 350, salePrice: 290, sku: 'KICK-DRAIN-500', stock: 110 },
              { name: '1 Litre', price: 560, salePrice: 490, sku: 'KICK-DRAIN-1000', stock: 60 }
            ]
          }
        ],
        hasVariations: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 44,
        tags: ['drain', 'clog remover', 'sink', 'plumbing'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Action Time', value: '15 Minutes' }
        ]
      },
      {
        name: 'Kick Pipe Unblocker Powder Granules',
        slug: 'kick-pipe-unblocker-powder-granules',
        description: 'Instant foaming granules that break down stubborn grease build-up in kitchen sink drain pipes and prevent foul odor.',
        shortDescription: 'Foaming drain pipe unblocker granules.',
        category: catMap['drain-care'],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        price: 240,
        salePrice: 210,
        stock: 70,
        sku: 'KICK-DRAIN-POWDER',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 16,
        tags: ['drain powder', 'granules', 'unblocker'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      },

      // --- MOSQUITO PROTECTION ---
      {
        name: 'Kick Mosquito Repellent Electric Liquid Refill (45 Nights)',
        slug: 'kick-mosquito-repellent-electric-liquid',
        description: 'Advanced 45-night continuous protection against dengue and malaria carrying mosquitoes. Odorless, smokeless, and safe for indoor bedrooms.',
        shortDescription: 'Long-lasting 45-night electric mosquito repellent refill.',
        category: catMap['mosquito-protection'],
        images: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        ],
        price: 280,
        salePrice: 240,
        stock: 130,
        sku: 'KICK-MOSQ-45N',
        variations: [],
        hasVariations: false,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 48,
        tags: ['mosquito', 'pest control', 'repellent', 'electric liquid'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' },
          { key: 'Coverage', value: '45 Nights' }
        ]
      },
      {
        name: 'Kick Anti-Mosquito Skin Protection Lotion',
        slug: 'kick-anti-mosquito-skin-protection-lotion',
        description: 'Dermatologically safe insect repellent lotion with soothing aloe vera. Protects outdoor enthusiasts and children from mosquito bites for 8 hours.',
        shortDescription: '8-hour aloe vera mosquito repellent body lotion.',
        category: catMap['mosquito-protection'],
        images: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        ],
        price: 230,
        salePrice: 195,
        stock: 90,
        sku: 'KICK-LOTION-100',
        variations: [],
        hasVariations: false,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 27,
        tags: ['mosquito lotion', 'skin safe', 'repellent'],
        specifications: [
          { key: 'Brand', value: 'Kick Home Care' }
        ]
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`${createdProducts.length} Authentic Products seeded across 6 Categories!`);

    // Create Initial Reviews
    await Review.create({
      product: createdProducts[0]._id, // Kick Whito
      user: customerUser._id,
      userName: 'Rayyan Ansari',
      rating: 5,
      comment: 'Kick Whito worked like magic on my white Adidas sneakers! Removed dirty scuffs in 2 minutes. Highly recommend!',
      isApproved: true
    });

    await Review.create({
      product: createdProducts[7]._id, // Kick Bleach
      user: customerUser._id,
      userName: 'Saman Malik',
      rating: 5,
      comment: 'Best liquid bleach in Pakistan. Bleached my white bedsheets without damaging fabric fibers.',
      isApproved: true
    });

    // Create Initial Coupons
    await Coupon.create({
      code: 'KICK10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 500,
      expiryDate: new Date('2027-12-31'),
      usageLimit: 500,
      isActive: true
    });

    await Coupon.create({
      code: 'WELCOME50',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 300,
      expiryDate: new Date('2027-12-31'),
      usageLimit: 200,
      isActive: true
    });

    console.log('Coupons and Reviews seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
