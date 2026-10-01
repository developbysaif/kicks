import axios from 'axios';

export const FALLBACK_CATEGORIES = [
  { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care', description: 'White sneaker cleaners, shoe polishes, shiner sponges, deodorizers, and brushes.', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', productCount: 7 },
  { _id: 'cat2', name: 'Laundry Care', slug: 'laundry-care', description: 'High performance bleach liquid, blue whitening agents, and fabric conditioners.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80', productCount: 3 },
  { _id: 'cat3', name: 'Home Cleaning', slug: 'home-cleaning', description: 'All-purpose surface cleaners, descaling bathroom sprays, and toilet cleaner power gels.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', productCount: 3 },
  { _id: 'cat4', name: 'Dish Care', slug: 'dish-care', description: 'Tough grease-cutting dishwashing liquids infused with lemon oil.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80', productCount: 2 },
  { _id: 'cat5', name: 'Drain Care', slug: 'drain-care', description: 'Fast acting liquid drain openers and pipe clog unblocker powders.', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', productCount: 2 },
  { _id: 'cat6', name: 'Mosquito Protection', slug: 'mosquito-protection', description: 'Electric liquid mosquito repellents, skin-safe lotions, and insect sprays.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', productCount: 2 }
];

export const FALLBACK_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Kick Whito - White Sneaker & Joggers Cleaner',
    slug: 'kick-whito-white-sneaker-cleaner',
    description: 'Kick Whito is specially formulated for restoring brilliant white shine to leather, canvas, and rubber soles of sneakers and sports shoes. Removes tough scuffs and yellowing instantly.',
    shortDescription: 'Instant white sneaker restorer and stain remover sponge applicator.',
    category: { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care' },
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    price: 250, salePrice: 220, stock: 150, sku: 'KICK-WHITO-100',
    hasVariations: false, isFeatured: true, isBestSeller: true, isNewArrival: true, rating: 5.0, numReviews: 68
  },
  {
    _id: 'p2',
    name: 'Kick Joggers & Canvas Cleaner Solution',
    slug: 'kick-joggers-canvas-cleaner',
    description: 'Deep foam action cleaner specifically engineered for sports joggers, mesh sneakers, and canvas footwear.',
    shortDescription: 'Active foam cleanser for sports joggers & canvas shoes.',
    category: { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care' },
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    price: 260, salePrice: 240, stock: 100, sku: 'KICK-JOG-150',
    hasVariations: false, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.8, numReviews: 38
  },
  {
    _id: 'p3',
    name: 'Kick Super Liquid Shoe Polish',
    slug: 'kick-super-liquid-shoe-polish',
    description: 'Premium quick-drying liquid shoe polish enriched with natural carnauba wax.',
    shortDescription: 'Instant high-shine wax liquid polish for leather shoes.',
    category: { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care' },
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    price: 250, salePrice: 220, stock: 120, sku: 'KICK-SP-BLACK',
    variations: [{ title: 'Shade', options: [{ name: 'Black', price: 250, salePrice: 220, sku: 'KICK-SP-BLK' }, { name: 'Brown', price: 250, salePrice: 220, sku: 'KICK-SP-BRN' }, { name: 'Neutral', price: 250, salePrice: 220, sku: 'KICK-SP-NEU' }] }],
    hasVariations: true, isFeatured: false, isBestSeller: true, isNewArrival: false, rating: 4.7, numReviews: 45
  },
  {
    _id: 'p4',
    name: 'Kick Super Shoe Polish Wax Tin 50g',
    slug: 'kick-super-shoe-polish-wax-tin-50g',
    description: 'Traditional solid wax shoe polish tin for military-grade spit shine.',
    shortDescription: 'Classic 50g solid wax shoe polish tin for formal shoes.',
    category: { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care' },
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    price: 240, salePrice: 220, stock: 180, sku: 'KICK-WAX-50G',
    hasVariations: false, isFeatured: false, isBestSeller: true, isNewArrival: false, rating: 4.9, numReviews: 52
  },
  {
    _id: 'p5',
    name: 'Kick Instant Shoe Shiner Sponge',
    slug: 'kick-instant-shoe-shiner-sponge',
    description: 'Compact travel sponge pre-impregnated with silicone oils.',
    shortDescription: 'Mess-free travel silicone shiner sponge.',
    category: { _id: 'cat1', name: 'Shoe Care', slug: 'shoe-care' },
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    price: 220, salePrice: 190, stock: 200, sku: 'KICK-SPONGE-INST',
    hasVariations: false, isFeatured: false, isBestSeller: true, isNewArrival: false, rating: 4.9, numReviews: 60
  },
  {
    _id: 'p6',
    name: 'Kick Bleach Liquid Ultra Clean',
    slug: 'kick-bleach-liquid-ultra-clean',
    description: 'Kick Bleach Liquid delivers powerful stain removal, whitening, and sanitization for fabrics.',
    shortDescription: 'Multi-purpose whitening and disinfectant liquid bleach.',
    category: { _id: 'cat2', name: 'Laundry Care', slug: 'laundry-care' },
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    price: 250, salePrice: 220, stock: 150, sku: 'KICK-BLC-500',
    variations: [{ title: 'Volume', options: [{ name: '300ml', price: 140, salePrice: 125, sku: 'KICK-BLC-300' }, { name: '500ml', price: 250, salePrice: 220, sku: 'KICK-BLC-500' }, { name: '1 Litre', price: 390, salePrice: 350, sku: 'KICK-BLC-1000' }] }],
    hasVariations: true, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.9, numReviews: 74
  },
  {
    _id: 'p7',
    name: 'Kick All Purpose Surface Cleaner Spray',
    slug: 'kick-all-purpose-surface-cleaner-spray',
    description: 'Multi-surface disinfectant spray for countertops, glass, wood, and appliances.',
    shortDescription: 'Multi-surface spray cleaner with fresh pine scent.',
    category: { _id: 'cat3', name: 'Home Cleaning', slug: 'home-cleaning' },
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    price: 280, salePrice: 240, stock: 90, sku: 'KICK-SURF-500',
    hasVariations: false, isFeatured: true, isBestSeller: false, isNewArrival: true, rating: 4.8, numReviews: 29
  },
  {
    _id: 'p8',
    name: 'Kick Toilet Cleaner Power Gel',
    slug: 'kick-toilet-cleaner-power-gel',
    description: 'Thick disinfectant gel formula that coats toilet bowls to eliminate yellow stains.',
    shortDescription: 'Thick disinfectant power gel for sparkling toilet bowls.',
    category: { _id: 'cat3', name: 'Home Cleaning', slug: 'home-cleaning' },
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
    price: 270, salePrice: 230, stock: 130, sku: 'KICK-TOILET-750',
    hasVariations: false, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.9, numReviews: 56
  },
  {
    _id: 'p9',
    name: 'Kick Dish Wash Liquid Lemon Fresh',
    slug: 'kick-dish-wash-liquid-lemon-fresh',
    description: 'Kick Dish Wash Liquid effectively cuts through tough grease, oil, and food residue.',
    shortDescription: 'Tough grease cutting dishwashing liquid with fresh lemon oil.',
    category: { _id: 'cat4', name: 'Dish Care', slug: 'dish-care' },
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
    price: 320, salePrice: 280, stock: 140, sku: 'KICK-DISH-500',
    variations: [{ title: 'Size', options: [{ name: '250ml', price: 180, salePrice: 160, sku: 'KICK-DISH-250' }, { name: '500ml', price: 320, salePrice: 280, sku: 'KICK-DISH-500' }, { name: '1 Litre', price: 540, salePrice: 480, sku: 'KICK-DISH-1000' }] }],
    hasVariations: true, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.9, numReviews: 82
  },
  {
    _id: 'p10',
    name: 'Kick Heavy Duty Drain Opener Liquid',
    slug: 'kick-heavy-duty-drain-opener-liquid',
    description: 'Dissolves hair, grease, soap scum, and organic matter blocking kitchen sinks in 15 minutes.',
    shortDescription: 'Fast acting clog remover and drain pipe unblocker.',
    category: { _id: 'cat5', name: 'Drain Care', slug: 'drain-care' },
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
    price: 350, salePrice: 290, stock: 110, sku: 'KICK-DRAIN-500',
    variations: [{ title: 'Volume', options: [{ name: '300ml', price: 190, salePrice: 170, sku: 'KICK-DRAIN-300' }, { name: '500ml', price: 350, salePrice: 290, sku: 'KICK-DRAIN-500' }, { name: '1 Litre', price: 560, salePrice: 490, sku: 'KICK-DRAIN-1000' }] }],
    hasVariations: true, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.8, numReviews: 44
  },
  {
    _id: 'p11',
    name: 'Kick Mosquito Repellent Electric Liquid Refill (45 Nights)',
    slug: 'kick-mosquito-repellent-electric-liquid',
    description: 'Advanced 45-night continuous protection against dengue mosquitoes. Odorless and smokeless.',
    shortDescription: 'Long-lasting 45-night electric mosquito repellent refill.',
    category: { _id: 'cat6', name: 'Mosquito Protection', slug: 'mosquito-protection' },
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
    price: 280, salePrice: 240, stock: 130, sku: 'KICK-MOSQ-45N',
    hasVariations: false, isFeatured: true, isBestSeller: true, isNewArrival: false, rating: 4.8, numReviews: 48
  },
  {
    _id: 'p12',
    name: 'Kick Anti-Mosquito Skin Protection Lotion',
    slug: 'kick-anti-mosquito-skin-protection-lotion',
    description: 'Dermatologically safe insect repellent lotion with soothing aloe vera. Protects for 8 hours.',
    shortDescription: '8-hour aloe vera mosquito repellent body lotion.',
    category: { _id: 'cat6', name: 'Mosquito Protection', slug: 'mosquito-protection' },
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
    price: 230, salePrice: 195, stock: 90, sku: 'KICK-LOTION-100',
    hasVariations: false, isFeatured: false, isBestSeller: true, isNewArrival: true, rating: 4.7, numReviews: 27
  }
];

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
