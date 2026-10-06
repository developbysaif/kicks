import mongoose from 'mongoose';
import Category from './models/Category.js';
import Subcategory from './models/Subcategory.js';
import Product from './models/Product.js';

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/kickhomecare');
  console.log('Connected to MongoDB');

  // Categories
  const categoriesData = [
    {
      name: 'Shoe Care',
      slug: 'shoe-care',
      description: 'Premium shoe shiners, white sneaker cleaners, polish sponges, shoe wax, deodorizers, and brushes.',
      imageUrl: '/Shoe Care.png',
      status: 'published',
      isActive: true
    },
    {
      name: 'Laundry Care',
      slug: 'laundry-care',
      description: 'High performance bleach liquid, blue whitening agents, and fabric conditioners for brilliant clothes.',
      imageUrl: '/laundry Care.png',
      status: 'published',
      isActive: true
    },
    {
      name: 'Home Cleaning',
      slug: 'home-cleaning',
      description: 'All-purpose surface cleaners, descaling bathroom sprays, and heavy duty toilet cleaner power gels.',
      imageUrl: '/Home Cleaning.png',
      status: 'published',
      isActive: true
    },
    {
      name: 'Dish Care',
      slug: 'dish-care',
      description: 'Tough grease-cutting dishwashing liquids infused with lemon oil and heavy duty dish sponges.',
      imageUrl: '/dish care.png',
      status: 'published',
      isActive: true
    },
    {
      name: 'Washroom Cleaning',
      slug: 'washroom-cleaning',
      description: 'Fast acting liquid drain openers, bathroom cleaners, and toilet gels for sparkling clean washrooms.',
      imageUrl: '/washroom cleaning.png',
      status: 'published',
      isActive: true
    },
    {
      name: 'Mosquito Protection',
      slug: 'mosquito-protection',
      description: 'Electric liquid mosquito repellents, anti-mosquito skin lotions, coils, and multi-insect sprays.',
      imageUrl: '/mosquito protection.png',
      status: 'published',
      isActive: true
    }
  ];

  await Category.deleteMany({});
  await Subcategory.deleteMany({});
  await Product.deleteMany({});

  const createdCategories = await Category.insertMany(categoriesData);
  const catMap = {};
  createdCategories.forEach(c => {
    catMap[c.slug] = c._id;
  });

  // Subcategories
  const subcategoriesData = [
    // Shoe Care
    { name: 'Sneaker Care', slug: 'sneaker-care', categoryId: catMap['shoe-care'], description: 'Specialized whiteners & sole scrub formulations', imageUrl: '/Shoe Care.png' },
    { name: 'Leather Care', slug: 'leather-care', categoryId: catMap['shoe-care'], description: 'Nourishing wax creams, tins, and high-gloss polish', imageUrl: '/liquid shoe polish.png' },
    { name: 'Cleaners & Brushes', slug: 'cleaners', categoryId: catMap['shoe-care'], description: 'Active foam cleansers and horsehair brushes', imageUrl: '/Shoe Care.png' },
    { name: 'Shoe Protectors', slug: 'protectors', categoryId: catMap['shoe-care'], description: 'Hydrophobic nano-coatings against rain and stains', imageUrl: '/Shoe Care.png' },

    // Laundry Care
    { name: 'Bleach Liquid', slug: 'bleach-liquid', categoryId: catMap['laundry-care'], description: 'High performance ultra clean bleach formulations', imageUrl: '/laundry Care.png' },
    { name: 'Fabric Whitener', slug: 'fabric-whitener', categoryId: catMap['laundry-care'], description: 'Optical fabric brightening and stain removal solutions', imageUrl: '/whitner bleach.png' },
    { name: 'Fabric Conditioner', slug: 'fabric-softener', categoryId: catMap['laundry-care'], description: 'Fabric softness & long-lasting perfume', imageUrl: '/laundry Care.png' },

    // Home Cleaning
    { name: 'Perfumed Phenyle', slug: 'phenyle', categoryId: catMap['home-cleaning'], description: 'Fragrant white phenyle for germ-free sparkling floors', imageUrl: '/Home Cleaning.png' },
    { name: 'Floor & Surface Cleaners', slug: 'surface-cleaner', categoryId: catMap['home-cleaning'], description: 'Multi-surface floor mop detergents and descalers', imageUrl: '/phenyle.png' },

    // Dish Care
    { name: 'Dishwash Liquid', slug: 'dishwash-liquid', categoryId: catMap['dish-care'], description: 'Concentrated grease-cutting dishwashing liquids with lemon oil', imageUrl: '/dish care.png' },
    { name: 'Dish Sponges', slug: 'dish-sponges', categoryId: catMap['dish-care'], description: 'Heavy duty kitchen scouring sponges', imageUrl: '/dish care.png' },

    // Washroom Cleaning
    { name: 'Drain Opener', slug: 'drain-opener', categoryId: catMap['washroom-cleaning'], description: 'Fast acting liquid drain openers for unclogging pipes', imageUrl: '/kick drain opener.png' },
    { name: 'Toilet & Bathroom Cleaner', slug: 'toilet-cleaner', categoryId: catMap['washroom-cleaning'], description: '10X power cleaners for tiles, toilets, and basins', imageUrl: '/washroom cleaning.png' },

    // Mosquito Protection
    { name: 'Machine & Refills', slug: 'machine-refills', categoryId: catMap['mosquito-protection'], description: 'Electric mosquito vaporizers and long lasting refills', imageUrl: '/mosquito protection.png' },
    { name: 'Repellent Sprays', slug: 'repellent-sprays', categoryId: catMap['mosquito-protection'], description: 'Instant knock-down mosquito and flying insect aerosols', imageUrl: '/mosquito protection.png' }
  ];

  const createdSubcategories = await Subcategory.insertMany(subcategoriesData);
  const subMap = {};
  createdSubcategories.forEach(s => {
    subMap[s.slug] = s._id;
  });

  // Authentic Products
  const products = [
    // 1. Shoe Care Products
    {
      name: 'Kick Whito - White Sneaker & Joggers Cleaner',
      slug: 'kick-whito-white-sneaker-cleaner',
      sku: 'KICK-WHITO-100',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['sneaker-care'],
      price: 250,
      salePrice: 220,
      compareAtPrice: 250,
      costPrice: 120,
      stock: 150,
      brand: 'Kick Home Care',
      shortDescription: 'Instant white sneaker restorer and stain remover sponge applicator.',
      description: 'Kick Whito is specially formulated for restoring brilliant white shine to leather, canvas, and rubber soles of sneakers and sports shoes. Removes tough scuffs and yellowing instantly without ruining material.',
      images: ['/Shoe Care.png', '/promo-shoe.jpg'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 82,
      tags: ['sneakers', 'whito', 'white shoes', 'cleaner']
    },
    {
      name: 'Kick Joggers & Canvas Cleaner Solution',
      slug: 'kick-joggers-canvas-cleaner',
      sku: 'KICK-JOG-150',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['sneaker-care'],
      price: 260,
      salePrice: 240,
      compareAtPrice: 260,
      costPrice: 130,
      stock: 100,
      brand: 'Kick Sport',
      shortDescription: 'Active foam cleanser for sports joggers & canvas shoes.',
      description: 'Deep foam action cleaner specifically engineered for sports joggers, mesh sneakers, and canvas footwear. Removes ingrained mud and dust while preserving colors.',
      images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.8,
      ratingCount: 38,
      tags: ['joggers', 'canvas', 'foam cleaner']
    },
    {
      name: 'Kick Super Liquid Shoe Polish',
      slug: 'kick-super-liquid-shoe-polish',
      sku: 'KICK-SP-BLACK',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['leather-care'],
      price: 250,
      salePrice: 220,
      compareAtPrice: 250,
      costPrice: 110,
      stock: 120,
      brand: 'Kick Professional',
      shortDescription: 'Instant high-shine wax liquid polish for leather shoes.',
      description: 'Premium quick-drying liquid shoe polish enriched with natural carnauba wax. Provides intense color depth and long-lasting gloss protection against water and soil.',
      images: ['/liquid shoe polish.png', '/Shoe Care.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 72,
      tags: ['shoe polish', 'leather', 'carnauba']
    },
    {
      name: 'Kick Super Shoe Polish Wax Tin 50g',
      slug: 'kick-super-shoe-polish-wax-tin-50g',
      sku: 'KICK-WAX-50G',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['leather-care'],
      price: 240,
      salePrice: 220,
      compareAtPrice: 240,
      costPrice: 100,
      stock: 180,
      brand: 'Kick Professional',
      shortDescription: 'Classic 50g solid wax shoe polish tin for formal shoes.',
      description: 'Traditional solid wax shoe polish tin for military-grade spit shine and deep leather nourishing. Protects boots and formal shoes from cracking.',
      images: ['/liquid shoe polish.png', '/Shoe Care.png'],
      status: 'published',
      isActive: true,
      isFeatured: false,
      ratingAvg: 4.9,
      ratingCount: 52,
      tags: ['wax tin', 'shoe polish', 'leather wax']
    },
    {
      name: 'Kick Instant Shoe Shiner Sponge',
      slug: 'kick-instant-shoe-shiner-sponge',
      sku: 'KICK-SPONGE-INST',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['leather-care'],
      price: 220,
      salePrice: 190,
      compareAtPrice: 220,
      costPrice: 90,
      stock: 200,
      brand: 'Kick Home Care',
      shortDescription: 'Mess-free travel silicone shiner sponge.',
      description: 'Compact travel sponge pre-impregnated with silicone oils. Restores instant glossy finish to leather shoes, boots, jackets, and handbags without buffing.',
      images: ['/Shoe Care.png'],
      status: 'published',
      isActive: true,
      isFeatured: false,
      ratingAvg: 4.9,
      ratingCount: 60,
      tags: ['shiner', 'sponge', 'travel']
    },
    {
      name: 'Kick Active Foam Sneaker Cleanser',
      slug: 'kick-active-foam-sneaker-cleanser',
      sku: 'KICK-FOAM-PUMP',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['cleaners'],
      price: 490,
      salePrice: 440,
      compareAtPrice: 490,
      costPrice: 220,
      stock: 95,
      brand: 'Kick Sport',
      shortDescription: 'Ready-to-use self-foaming solution for instant grime removal.',
      description: 'Ready-to-use self-foaming solution that breaks down stubborn street grime, dirt, and coffee stains effortlessly without soaking the shoe.',
      images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 114,
      tags: ['foam cleaner', 'sneaker care']
    },
    {
      name: 'Kick Hydrophobic Shield Rain & Stain Protector',
      slug: 'kick-hydrophobic-shield-protector',
      sku: 'KICK-SHIELD-250',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['protectors'],
      price: 650,
      salePrice: 590,
      compareAtPrice: 650,
      costPrice: 300,
      stock: 75,
      brand: 'Kick Professional',
      shortDescription: 'Breathable nano-coating barrier repelling water and stains.',
      description: 'Breathable nano-coating barrier repelling liquids, rainwater, road slush, and dust for up to 4 weeks across canvas, leather, and mesh.',
      images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 93,
      tags: ['protector', 'rain shield', 'nano coating']
    },
    {
      name: 'Kick Ergonomic 100% Horsehair Shoe Brush',
      slug: 'kick-ergonomic-horsehair-shoe-brush',
      sku: 'KICK-BRUSH-WOOD',
      categoryId: catMap['shoe-care'],
      subcategoryId: subMap['cleaners'],
      price: 320,
      salePrice: 280,
      compareAtPrice: 320,
      costPrice: 130,
      stock: 60,
      brand: 'Kick Professional',
      shortDescription: 'Natural horsehair bristles for buffing without scratching.',
      description: 'Ultra-soft dense natural horsehair bristles buff polish to mirror luster without scratching tender leather grains.',
      images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
      status: 'published',
      isActive: true,
      isFeatured: false,
      ratingAvg: 4.8,
      ratingCount: 64,
      tags: ['brush', 'horsehair', 'buffer']
    },

    // 2. Laundry Care Products
    {
      name: 'Kick Bleach Liquid Ultra Clean 1 Litre',
      slug: 'kick-bleach-liquid-ultra-clean',
      sku: 'KICK-BLC-1000',
      categoryId: catMap['laundry-care'],
      subcategoryId: subMap['bleach-liquid'],
      price: 500,
      salePrice: 425,
      compareAtPrice: 500,
      costPrice: 210,
      stock: 120,
      brand: 'Kick Home Care',
      shortDescription: 'Multi-purpose whitening and disinfectant liquid bleach.',
      description: 'Kick Bleach Liquid delivers powerful stain removal, whitening, and sanitization for white fabrics and household surfaces. Kills 99.9% of bacteria.',
      images: ['/whitner bleach.png', '/laundry Care.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 499,
      tags: ['bleach', 'laundry', 'whitener', 'disinfectant']
    },
    {
      name: 'Kick Whitner Bleach Liquid 500ml',
      slug: 'kick-whitner-bleach-500ml',
      sku: 'KICK-BLC-500',
      categoryId: catMap['laundry-care'],
      subcategoryId: subMap['fabric-whitener'],
      price: 250,
      salePrice: 220,
      compareAtPrice: 250,
      costPrice: 110,
      stock: 150,
      brand: 'Kick Home Care',
      shortDescription: 'Specialized fabric whitening liquid with optical blue radiance.',
      description: 'Kick Whitner Bleach Liquid enhances fabric brilliance and eliminates yellowish tints from cottons, school uniforms, and linens.',
      images: ['/laundry Care.png', '/whitner bleach.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 140,
      tags: ['whitner', 'bleach', 'fabric blue']
    },
    {
      name: 'Kick Fabric Conditioner Spring Fresh 1L',
      slug: 'kick-fabric-conditioner-softener',
      sku: 'KICK-FAB-1L',
      categoryId: catMap['laundry-care'],
      subcategoryId: subMap['fabric-softener'],
      price: 450,
      salePrice: 390,
      compareAtPrice: 450,
      costPrice: 190,
      stock: 90,
      brand: 'Kick Home Care',
      shortDescription: 'Silken softness and 14-day encapsulated floral aroma.',
      description: 'Softens fabric fibers, eases ironing, and protects garments against static cling and rough texture wash after wash.',
      images: ['/laundry Care.png', '/whitner bleach.png'],
      status: 'published',
      isActive: true,
      isFeatured: false,
      ratingAvg: 4.8,
      ratingCount: 65,
      tags: ['fabric softener', 'conditioner', 'floral']
    },

    // 3. Home Cleaning Products
    {
      name: 'Kick Perfumed White Phenyle 2.75L',
      slug: 'kick-perfumed-white-phenyle',
      sku: 'KICK-PHN-275',
      categoryId: catMap['home-cleaning'],
      subcategoryId: subMap['phenyle'],
      price: 650,
      salePrice: 580,
      compareAtPrice: 650,
      costPrice: 270,
      stock: 85,
      brand: 'Kick Home Care',
      shortDescription: 'Heavy-duty germicidal pine scented white phenyle.',
      description: 'Kick Perfumed White Phenyle destroys 99.9% of bacteria, repels flies and pests, and leaves a fresh pleasant pine fragrance across marble and tile floors.',
      images: ['/Home Cleaning.png', '/phenyle.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 210,
      tags: ['phenyle', 'floor cleaner', 'germ protection']
    },
    {
      name: 'Kick Surface Cleaner Floor Mop Liquid 1L',
      slug: 'kick-surface-cleaner-liquid',
      sku: 'KICK-SURF-1L',
      categoryId: catMap['home-cleaning'],
      subcategoryId: subMap['surface-cleaner'],
      price: 380,
      salePrice: 340,
      compareAtPrice: 380,
      costPrice: 160,
      stock: 110,
      brand: 'Kick Home Care',
      shortDescription: 'Streak-free multi-surface floor and tile cleaning formulation.',
      description: 'Quick-drying, low-foaming surface cleaner that lifts grime and stubborn grease footprints without leaving sticky residue.',
      images: ['/phenyle.png', '/Home Cleaning.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 95,
      tags: ['surface cleaner', 'floor mop', 'tile cleaner']
    },

    // 4. Dish Care Products
    {
      name: 'Kick Dishwash Liquid One-Kick Drop 1 Litre',
      slug: 'kick-dishwash-liquid-1l',
      sku: 'KICK-DISH-1000',
      categoryId: catMap['dish-care'],
      subcategoryId: subMap['dishwash-liquid'],
      price: 490,
      salePrice: 430,
      compareAtPrice: 490,
      costPrice: 200,
      stock: 130,
      brand: 'Kick Home Care',
      shortDescription: 'High concentrated lemon oil grease-cutting dishwashing formula.',
      description: 'Just one drop powers through baked-on curry oil and mutton fat. Gentle on hands and rinses away cleanly with zero chemical odor.',
      images: ['/dish care.png', '/dish wash liquid.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 320,
      tags: ['dishwash', 'lemon grease cutter', 'dish liquid']
    },
    {
      name: 'Kick Dish Wash Liquid Lemon Fresh 500ml',
      slug: 'kick-dishwash-liquid-lemon-500ml',
      sku: 'KICK-DISH-500',
      categoryId: catMap['dish-care'],
      subcategoryId: subMap['dishwash-liquid'],
      price: 350,
      salePrice: 315,
      compareAtPrice: 350,
      costPrice: 140,
      stock: 140,
      brand: 'Kick Home Care',
      shortDescription: 'Convenient pump applicator for everyday kitchen cookware.',
      description: 'Infused with natural lemon extract to deodorize stubborn fish and onion smells from cutlery and pots.',
      images: ['/dish wash liquid.png', '/dish care.png'],
      status: 'published',
      isActive: true,
      isFeatured: false,
      ratingAvg: 4.9,
      ratingCount: 156,
      tags: ['dishwash', 'lemon', 'kitchen']
    },

    // 5. Washroom Cleaning Products
    {
      name: 'Kick Liquid Drain Opener Heavy-Duty 1L',
      slug: 'kick-drain-opener-liquid-1l',
      sku: 'KICK-DRAIN-1000',
      categoryId: catMap['washroom-cleaning'],
      subcategoryId: subMap['drain-opener'],
      price: 590,
      salePrice: 520,
      compareAtPrice: 590,
      costPrice: 250,
      stock: 80,
      brand: 'Kick Professional',
      shortDescription: 'Dissolves hair, grease, and soap scum in clogged drains in 15 mins.',
      description: 'Fast-acting heavy-duty formula specifically engineered for blocked washroom and kitchen sinks. Safe on PVC and metal piping.',
      images: ['/kick drain opener.png', '/washroom cleaning.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 170,
      tags: ['drain opener', 'unclogger', 'washroom']
    },
    {
      name: 'Kick 10X Bathroom & Toilet Power Cleaner 500ml',
      slug: 'kick-toilet-bathroom-cleaner',
      sku: 'KICK-TOIL-500',
      categoryId: catMap['washroom-cleaning'],
      subcategoryId: subMap['toilet-cleaner'],
      price: 450,
      salePrice: 390,
      compareAtPrice: 450,
      costPrice: 180,
      stock: 115,
      brand: 'Kick Home Care',
      shortDescription: '10X limescale and yellow stain removing power gel with angled nozzle.',
      description: 'Clings to ceramic bowl surfaces to break down mineral hard water deposits and urine stains while killing 99.9% of bacteria.',
      images: ['/washroom cleaning.png', '/kick drain opener.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 112,
      tags: ['toilet cleaner', 'bathroom gel', 'limescale remover']
    },

    // 6. Mosquito Protection Products
    {
      name: 'Kick Mosquit Advance Liquid Machine + Refill',
      slug: 'kick-mosquito-advance-machine-refill',
      sku: 'KICK-MOSQ-KIT',
      categoryId: catMap['mosquito-protection'],
      subcategoryId: subMap['machine-refills'],
      price: 680,
      salePrice: 620,
      compareAtPrice: 680,
      costPrice: 310,
      stock: 90,
      brand: 'Kick Home Care',
      shortDescription: '60-night active anti-dengue vaporizer with dual heat heater.',
      description: 'Equipped with turbo mode to eradicate dengue and malaria mosquitoes in living rooms and bedrooms throughout the night.',
      images: ['/mosquito protection.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 5.0,
      ratingCount: 203,
      tags: ['mosquito', 'vaporizer', 'dengue protection', 'refill']
    },
    {
      name: 'Kick Mosquit Repellent Aerosol Spray 300ml',
      slug: 'kick-mosquito-spray-300ml',
      sku: 'KICK-MOSQ-SPRAY',
      categoryId: catMap['mosquito-protection'],
      subcategoryId: subMap['repellent-sprays'],
      price: 550,
      salePrice: 480,
      compareAtPrice: 550,
      costPrice: 230,
      stock: 105,
      brand: 'Kick Home Care',
      shortDescription: 'Instant knockdown aerosol spray for flying insects and mosquitoes.',
      description: 'Fast active formula kills mosquitoes on contact with pleasant floral odor instead of harsh chemical fumes.',
      images: ['/mosquito protection.png'],
      status: 'published',
      isActive: true,
      isFeatured: true,
      ratingAvg: 4.9,
      ratingCount: 88,
      tags: ['mosquito spray', 'knockdown aerosol', 'insect repellent']
    }
  ];

  const createdProducts = await Product.insertMany(products);

  console.log(`Successfully seeded:
  - ${createdCategories.length} Categories
  - ${createdSubcategories.length} Subcategories
  - ${createdProducts.length} Products`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
