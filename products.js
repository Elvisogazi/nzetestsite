/* ==========================================================================
   PRODUCT DATABASE
   --------------------------------------------------------------------------
   To add or edit a product, change this array only.

   Each product has its OWN affiliateLink. Replace every placeholder URL
   below with your real affiliate URL from the seller / affiliate network.
   Set featured: true to show a product in the "Featured Products" section.
   ========================================================================== */

const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    image: "images/headphones.svg",
    price: "$49.99",
    description: "Comfortable over-ear headphones with deep bass and all-day battery.",
    longDescription:
      "Enjoy immersive sound with these over-ear wireless headphones. Active noise cancellation blocks out distractions, while soft memory-foam ear cups keep you comfortable through long listening sessions. Perfect for work, travel and everyday music.",
    category: "Electronics",
    features: ["Bluetooth 5.3", "Active noise cancellation", "Up to 40 hours battery", "Built-in microphone", "Foldable design"],
    featured: true,
    affiliateLink: "https://example.com/wireless-headphones?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    image: "images/watch.svg",
    price: "$79.00",
    description: "Track steps, heart rate and sleep with a bright, water-resistant display.",
    longDescription:
      "A lightweight smartwatch that helps you stay on top of your health. Monitor your heart rate, count steps, track workouts and review your sleep patterns, all while receiving notifications from your phone.",
    category: "Electronics",
    features: ["Heart-rate monitor", "Sleep tracking", "Water resistant", "7-day battery life", "Phone notifications"],
    featured: true,
    affiliateLink: "https://example.com/smart-fitness-watch?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    image: "images/chair.svg",
    price: "$189.00",
    description: "Breathable mesh chair with adjustable lumbar support for long work days.",
    longDescription:
      "Designed to support healthy posture, this ergonomic chair features adjustable lumbar support, a breathable mesh back and a smooth-rolling base. Ideal for home offices and long hours at the desk.",
    category: "Home & Office",
    features: ["Adjustable lumbar support", "Breathable mesh back", "Height-adjustable armrests", "360° swivel", "Supports up to 120 kg"],
    featured: true,
    affiliateLink: "https://example.com/ergonomic-office-chair?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    image: "images/bottle.svg",
    price: "$24.50",
    description: "Insulated bottle that keeps drinks cold for 24 hours or hot for 12.",
    longDescription:
      "A durable, double-wall insulated bottle that fits in most cup holders. Leak-proof lid, BPA-free materials and a powder-coated finish make it a dependable companion for the gym, office or outdoors.",
    category: "Fitness",
    features: ["Cold 24h / hot 12h", "Leak-proof lid", "BPA-free", "750 ml capacity", "Dishwasher safe lid"],
    featured: false,
    affiliateLink: "https://example.com/steel-water-bottle?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    image: "images/speaker.svg",
    price: "$34.99",
    description: "Compact, waterproof speaker with rich 360° sound.",
    longDescription:
      "Take your music anywhere with this rugged portable speaker. It delivers clear, room-filling sound, survives splashes and dust, and pairs quickly with any Bluetooth device.",
    category: "Electronics",
    features: ["360° sound", "IPX7 waterproof", "12-hour playtime", "Built-in power bank", "Pairs two speakers"],
    featured: true,
    affiliateLink: "https://example.com/bluetooth-speaker?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 6,
    name: "Yoga Mat with Carrying Strap",
    image: "images/yoga-mat.svg",
    price: "$29.00",
    description: "Non-slip, extra-thick mat for yoga, pilates and stretching.",
    longDescription:
      "Cushioned and grippy, this 6mm yoga mat protects your joints and keeps you steady in every pose. It rolls up easily and includes a strap so it's simple to carry to class.",
    category: "Fitness",
    features: ["6mm thick cushioning", "Non-slip texture", "Eco-friendly material", "Easy to clean", "Includes carrying strap"],
    featured: false,
    affiliateLink: "https://example.com/yoga-mat?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 7,
    name: "LED Desk Lamp with Wireless Charger",
    image: "images/lamp.svg",
    price: "$39.99",
    description: "Dimmable desk lamp with a built-in wireless charging pad.",
    longDescription:
      "Light up your workspace and charge your phone at the same time. This slim lamp offers multiple brightness levels and colour temperatures, plus a wireless charging base that keeps your desk tidy.",
    category: "Home & Office",
    features: ["5 brightness levels", "3 colour modes", "10W wireless charging", "Eye-care lighting", "Touch controls"],
    featured: true,
    affiliateLink: "https://example.com/led-desk-lamp?ref=YOUR_AFFILIATE_ID"
  },
  {
    id: 8,
    name: "Productivity Planner Notebook",
    image: "images/notebook.svg",
    price: "$16.95",
    description: "Hardcover undated planner for goals, daily tasks and habits.",
    longDescription:
      "Stay organised with a planner built around goal setting, daily priorities and habit tracking. Thick, ink-friendly paper and a lay-flat binding make planning a pleasure.",
    category: "Books & Stationery",
    features: ["Undated – start any time", "Goal & habit trackers", "Lay-flat binding", "Thick 100gsm paper", "Ribbon bookmark"],
    featured: false,
    affiliateLink: "https://example.com/productivity-planner?ref=YOUR_AFFILIATE_ID"
  }
];
