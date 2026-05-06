/**
 * MILKU MASTER CONFIGURATION (THE BRAIN)
 * RULE: Nothing is hardcoded. Everything is derived from this object.
 */

export const MASTER_CONFIG = {
  WEATHER: {
    API_ENDPOINT: "https://api.openweathermap.org/data/2.5/weather",
    API_KEY: import.meta.env.VITE_WEATHER_API_KEY || "YOUR_KEY_HERE",
    CACHE_DURATION_MS: 1800000, 
    FALLBACK_COORDINATES: { lat: 23.5769, lon: 72.3997 }, 
    TIMEOUT_MS: 8000,
    DEFAULT_TEMP: 22,
  },

  ANIMATION: {
    ENTRANCE_DURATION: 1.5,
    SCROLL_SMOOTHNESS: 2,
    EASING_PREMIUM: "expo.out",
  },

  COLORS: {
    primary: "#0096D6",
    secondary: "#1A237E",
    accent: "#FFD600",
    text: "#0D1B4B",
    white: "#FFFFFF",
    bg: "#FAFAFA"
  },

  // ADAPTIVE THEMES
  THEMES: [
    {
      range: [-10, 15], // Cold
      styles: {
        primary: "#0096D6",
        secondary: "#1A237E",
        accent: "#FFD600",
        text: "#FFFFFF",
        background: "linear-gradient(135deg, #0D1B4B 0%, #1A237E 100%)",
        intensity: 0.8,
        particleColor: "#E0F2F1"
      }
    },
    {
      range: [15, 30], // Mild
      styles: {
        primary: "#0096D6",
        secondary: "#1A237E",
        accent: "#FFD600",
        text: "#0D1B4B",
        background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
        intensity: 1,
        particleColor: "#0096D6"
      }
    },
    {
      range: [30, 60], // Hot
      styles: {
        primary: "#C42127",
        secondary: "#1A237E",
        accent: "#FFD600",
        text: "#0D1B4B",
        background: "linear-gradient(135deg, #FFF9F9 0%, #FFF1F1 100%)",
        intensity: 1.2,
        particleColor: "#C42127"
      }
    }
  ],

  // SCENES FOR THE 3D ENGINE
  SCENES: [
    { id: 'hero', type: 'intro', image: '/media/a2_cow_ghee.png', scale: 0.9, rotation: [0, 0, 0] },
    { id: 'trust', type: 'ambient', image: null },
    { id: 'product_1', type: 'hidden', image: null }, // Hidden during signature grid
    { id: 'legacy', type: 'editorial', image: '/media/a2_cow_ghee.png', scale: 0.85, rotation: [-0.1, -0.3, 0] },
    { id: 'b2b', type: 'hidden', image: null }, // Hidden to prevent footer bleed
  ],

  HERO: {
    badge: "Sunak, Gujarat",
    headline: "Gujarat's Purest Heritage",
    subtitle: "Purity in Every Drop",
    desc: "From the traditional farms of Mehsana to your luxury table. Experience 30 years of uncompromised purity crafted via the ancient Bilona tradition. Jay Gayatri Dairy stands as a beacon of adulteration-free, farm-fresh goodness for families and businesses across Gujarat.",
    ctas: [
      { text: "View Collection", link: "/products", variant: "primary" },
      { text: "Bulk Orders", link: "/bulk-order", variant: "secondary" }
    ],
    features: ["FSSAI Grade A", "No Additives", "Bilona Method"]
  },

  METRICS: [
    { value: 30, suffix: "+", label: "Years of Legacy" },
    { value: 15, suffix: "K+", label: "Happy Families" },
    { value: 50, suffix: "+", label: "Dealer Network" },
    { value: 98, suffix: "%", label: "Purity Rating" }
  ],

  GRID_PRODUCTS: [
    {
      id: 1,
      title: "A2 Desi Cow Ghee",
      image: "/media/a2_cow_ghee.png",
      tag: "FLAGSHIP",
      meta: "Bilona Churned • 500ml, 1L, 5L, 15Kg"
    },
    {
      id: 2,
      title: "Buffalo Ghee",
      image: "/media/buffelo_ghee.png",
      tag: "PREMIUM",
      meta: "Rich & Aromatic • 500ml, 1L, 5L"
    },
    {
      id: 3,
      title: "Milku Fresh & Creamy Dahi",
      image: "/media/dahi.png",
      tag: "PROBIOTIC",
      meta: "Premium Culture • 5Kg, 15Kg"
    },
    {
      id: 4,
      title: "Chass Buttermilk",
      image: "/media/chass.png",
      tag: "REFRESHING",
      meta: "Spiced & Fresh • 200ml, 500ml, 1L"
    },
    {
      id: 5,
      title: "Malai Paneer",
      image: "/media/malai_paneer.png",
      tag: "FRESH DAILY",
      meta: "High Protein • 200g, 500g, 1Kg, 5Kg"
    },
    {
      id: 6,
      title: "Low Fat Soft Paneer",
      image: "/media/low fat soft paneer.png",
      tag: "LIGHT",
      meta: "Low Fat • 200g, 500g, 1Kg"
    },
    {
      id: 7,
      title: "Low Fat Hard Paneer",
      image: "/media/low fat hard paneer.png",
      tag: "FITNESS",
      meta: "High Protein • 200g, 500g, 1Kg"
    },
    {
      id: 8,
      title: "Medium Fat Paneer",
      image: "/media/medium fat paneer.png",
      tag: "CLASSIC",
      meta: "Balanced Fat • 200g, 500g, 1Kg"
    }
  ],

  LEGACY_CONTENT: {
      tagline: "THE ANCIENT TRADITION",
      title: "Hand-Churned. Heart-Cured.",
      body: "At Jay Gayatri Dairy, we don't just make dairy; we honor a legacy. Our Bilona method ensures that every drop of ghee retains its medicinal properties and golden aroma, just as nature intended.",
      image: "/media/a2_cow_ghee.png"
  },

  B2B_CTA: {
      title: "Scale Local Purity Worldwide",
      subtitle: "Exclusive partnership opportunities for distributors across India.",
      btnPrimary: "Partner with Us",
      btnSecondary: "Chat on WhatsApp"
  },

  FOOTER: {
      tagline: "Sweetness of Purity",
      address: "22-A, Parmanand Industrial Society, Near Kharvarnagar BRTS Junction, U-M Road, Khatodara, Surat-395002",
      email: "gdproduct3@gmail.com",
      phone: "+91 83477 11123",
      fssai: "10719014000677",
      links: ["Home", "Products", "About", "Partner", "Contact"]
  }
};
