import type { RestaurantContent } from "@/types/content";

/**
 * All Bamboo Fire-specific content lives here. Components MUST NOT hard-code merchant strings —
 * if you find yourself typing "Bamboo Fire" inside a component, stop and add a field to this file.
 *
 * Items marked with a // CONFIRM comment are pending verification with the owner (Beverly Jacobs)
 * and should be revisited before v1.1. See README.md "Open Questions" section.
 *
 * ─── Image filename convention ────────────────────────────────────────────────────────────────
 * Every asset under /public/gallery/ follows the pattern:
 *
 *     [brand]-[subject]-[location].jpg
 *
 * where:
 *   • [brand]    = merchant slug or natural name, lowercase, hyphenated
 *                  (e.g. `bamboo-fire-cafe`, or contracted to `bamboo-fire` when the dish name
 *                  already carries enough specificity)
 *   • [subject]  = what the photo actually shows — dish name, room, exterior, etc.
 *                  (e.g. `dining-room`, `jerk-chicken-rice-plantains`, `red-snapper-banana-leaf`)
 *   • [location] = city, neighborhood, or street, lowercase, hyphenated
 *                  (e.g. `delray-beach`, `delray`, `ne-4th-ave-delray`)
 *
 * This is the canonical SEO convention for every Lōcal merchant. Image filenames are weakly
 * indexed by Google (less than alt text, but they DO surface in image search), so the pattern
 * gets us a free signal without imposing on copywriters. Mirror the same descriptors into the
 * `alt` field on each gallery entry below — alt text is the primary signal, the filename is
 * the reinforcing one. When real photos replace these placeholders, keep the same filenames so
 * URLs and any external references don't break.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export const restaurant: RestaurantContent = {
  slug: "bamboo-fire-cafe",
  name: "Bamboo Fire Cafe",
  tagline: "Caribbean & World Cuisine",
  cuisine: "Caribbean & World Cuisine",
  foundedYear: 2009, // CONFIRM: Boca Magazine 2022 cited "13 years" → ~2009. Could be 2008–2010.
  domain: "bamboofiredelray.com",

  contact: {
    phone: "+15617490973",
    smsPhone: "+19549074174", // CONFIRM still active and whether to display
    email: "info@bamboofiredelray.com", // CONFIRM vs. legacy Bamboofiregrill@gmail.com
  },

  address: {
    street: "149 NE 4th Ave",
    city: "Delray Beach",
    state: "FL",
    postalCode: "33483",
    country: "US",
    // Coordinates approximated from address; refine if Maps API returns a different geocode.
    lat: 26.4634,
    lng: -80.0686,
    parkingNote: "Street parking on NE 4th Ave",
  },

  // CONFIRM with owner — current Yelp data, but old business card showed later closing times.
  hours: {
    sun: { open: "14:30", close: "20:00" },
    mon: { open: null, close: null },
    tue: { open: null, close: null },
    wed: { open: "17:00", close: "22:00" },
    thu: { open: "17:00", close: "22:00" },
    fri: { open: "17:00", close: "23:00" },
    sat: { open: "17:00", close: "23:00" },
  },
  timezone: "America/New_York",

  hero: {
    // `{years}` is substituted at render via lib/tenure.ts using foundedYear above. Keeps the
    // hero, info row, and Story prose all reading the same number — never let two of them drift.
    subhead:
      "Family-owned Caribbean and world cuisine, rooted in Guyana and at home in Delray Beach for {years} years.",
    backgroundImage: "/gallery/bamboo-fire-cafe-caribbean-restaurant-delray-beach.jpg", // PLACEHOLDER until Beverly supplies a hero shot — keep this filename when the real image replaces it
    backgroundAlt:
      "Plates of jerk chicken, oxtail and curry shrimp on a wooden table at Bamboo Fire Cafe",
  },

  story: {
    paragraphs: [
      "Bamboo Fire Cafe is a family kitchen first. Donald and Beverly Jacobs grew up in Berbice, Guyana — between Rosignol and New Amsterdam — where Caribbean and South Asian flavors live on the same plate. They opened Bamboo Fire in Delray Beach to cook the food they were raised on, the way they were raised cooking it.",
      // `{years}` is substituted at render — see lib/tenure.ts.
      "Most evenings, you'll find their daughter Lauren — everyone calls her Smiley — somewhere on the floor. The menu travels: jerk from Jamaica, curries from Guyana, snapper baked in banana leaf, oxtail simmered until it falls off the bone. It's pan-Caribbean by way of one family's life, and it has anchored a corner of Pineapple Grove for {years} years.",
      "We take reservations. We do takeout. Three sides come with every main — that part isn't negotiable.",
    ],
    pullQuote: {
      text: "A neighborhood institution where the curries taste like home cooking.",
      attribution: "paraphrased from Boca Magazine, 2022",
      sourceUrl:
        "https://bocamag.com/restaurant-review-bamboo-fire-cafe/",
    },
    // CONFIRM: replace placeholder when Beverly provides a family/interior photo.
  },

  menu: {
    sections: [
      {
        title: "Appetizers",
        priceRangeIndicator: "$",
        items: [
          { name: "Conch Salad", description: "Bright Bahamian-style ceviche with citrus and chiles." },
          { name: "Garbanzo Fritos", description: "Crisp chickpea fritters with house dipping sauce." },
          { name: "Dhal", description: "Slow-cooked Indo-Guyanese lentil soup.", tags: ["V"] },
          { name: "Tostones", description: "Twice-fried green plantains, salted hot.", tags: ["V"] },
          { name: "Plantain Fries", description: "Sweet plantains cut thin, fried golden.", tags: ["V"] },
          { name: "Jerk Meatballs", description: "House-ground beef in jerk-spiced gravy.", tags: ["spicy"] },
          { name: "Conch Fritters", description: "Florida conch in a crackly fried shell." },
        ],
      },
      {
        title: "Greatest Hits",
        blurb:
          "The dishes guests come back for. Each served with three sides — pick from the list below.",
        priceRangeIndicator: "$$",
        callout: "Three sides included with every main.",
        items: [
          { name: "Oxtail", description: "Braised low and slow until tender.", tags: ["signature"] },
          { name: "Curry Chicken", description: "Guyanese-style curry, deep and aromatic." },
          { name: "Curry Goat", description: "Bone-in goat in classic curry." },
          { name: "Jerk Chicken", description: "Marinated overnight, grilled hard.", tags: ["spicy", "signature"] },
          { name: "Jerk Pork", description: "Slow-jerked pork shoulder.", tags: ["spicy"] },
          { name: "Jerk Ribs", description: "Sticky, smoky, full rack.", tags: ["spicy"] },
          { name: "Jerk Platter Combo", description: "Jerk chicken, pork and ribs on one plate.", tags: ["spicy", "signature"] },
          { name: "Lamb Chops", description: "Grilled with Caribbean rub." },
        ],
      },
      {
        title: "Seafood",
        priceRangeIndicator: "$$",
        items: [
          { name: "Coconut Shrimp", description: "Crisp coconut crust, sweet chili dip." },
          { name: "Curried Shrimp", description: "Shrimp in Guyanese curry." },
          { name: "Seafood Creole", description: "Fish, shrimp and crabcake in creole sauce." },
          { name: "Red Snapper in Banana Leaf", description: "Whole snapper baked with herbs and lime.", tags: ["signature"] },
        ],
      },
      {
        title: "Vegetarian",
        priceRangeIndicator: "$",
        items: [
          { name: "Jerk or Curried Vegetables", description: "Cauliflower-forward vegetable plate, your spice.", tags: ["V"] },
          { name: "Coconut Tofu", description: "Coconut-crusted tofu, sweet chili.", tags: ["V"] },
        ],
      },
      {
        title: "Sides",
        blurb: "Pick three with any main, or order à la carte.",
        items: [
          { name: "Okra Fried Rice", tags: ["V"] },
          { name: "Peas & Rice", tags: ["V"] },
          { name: "Roti", tags: ["V"] },
          { name: "Sweet Plantains", tags: ["V"] },
          { name: "Cabbage", tags: ["V"] },
          { name: "Mac & Cheese", tags: ["V"] },
        ],
      },
      {
        title: "Dessert & Drinks",
        items: [
          { name: "Rum Cake", description: "House signature.", tags: ["signature"] },
          { name: "Calypso Lemonade", description: "Our house lemonade.", tags: ["signature"] },
          { name: "Banks Beer", description: "Guyanese lager." },
          { name: "Caribbean Sodas", description: "Ting and Ginger Beer when in stock." },
          { name: "Wine", description: "Short, considered list — ask your server." },
        ],
      },
    ],
    footnotes: [
      "Three sides come with every main. Sides can also be ordered à la carte.",
      "Ask us about dietary adjustments — vegetarian, gluten-free and dairy-free swaps are usually doable with notice.",
      "Prices subject to change. Call us for tonight's pricing while we finalize the menu online.",
    ],
    cateringTeaser:
      "Catering menu coming soon. For private events, family-style trays and large orders, email us and we'll quote you fast.",
  },

  // V1 placeholders — gradient blocks generated at build setup; replace with real photography in
  // v1.1. KEEP THE SAME FILENAMES when swapping in real images so external references and any
  // search-engine-cached URLs don't 404. Filename convention is documented at the top of this file.
  gallery: [
    {
      src: "/gallery/bamboo-fire-cafe-dining-room-delray-beach.jpg",
      alt: "Bamboo Fire Cafe dining room in Delray Beach",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/jerk-chicken-rice-plantains-bamboo-fire-delray.jpg",
      alt: "Jerk chicken plate with rice and plantains at Bamboo Fire Cafe in Delray Beach",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/curry-goat-roti-bamboo-fire-delray-beach.jpg",
      alt: "Curry goat and roti at Bamboo Fire Cafe in Delray Beach",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/oxtail-rice-and-peas-bamboo-fire-delray.jpg",
      alt: "Oxtail in gravy with rice and peas at Bamboo Fire Cafe in Delray Beach",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/red-snapper-banana-leaf-caribbean-delray.jpg",
      alt: "Red snapper baked in banana leaf at Bamboo Fire Cafe, Caribbean restaurant in Delray Beach",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/bamboo-fire-cafe-exterior-ne-4th-ave-delray.jpg",
      alt: "Bamboo Fire Cafe exterior on NE 4th Avenue in Delray Beach",
      width: 1200,
      height: 800,
    },
  ],

  press: [
    {
      publication: "The Infatuation",
      date: "February 2026",
      paraphrase:
        "Counts Bamboo Fire among the Delray spots worth a special trip — pan-Caribbean cooking that holds its own against the showier rooms downtown.",
      url: "https://www.theinfatuation.com/miami/reviews/bamboo-fire-cafe",
    },
    {
      publication: "Boca Magazine",
      date: "March 2022",
      paraphrase:
        "A warm full review of the Jacobs family's Caribbean kitchen, calling out the curries and the welcome you get walking in.",
      url: "https://bocamag.com/restaurant-review-bamboo-fire-cafe/",
    },
    {
      publication: "Stabroek News",
      date: "2014",
      paraphrase:
        "Heritage profile of the Berbice-born owners and how a Guyanese kitchen ended up rooted in South Florida.",
      // Stabroek News URL TBD; using site root until Beverly supplies the article link.
      url: "https://www.stabroeknews.com/",
    },
  ],

  reviews: [
    {
      name: "Daniel",
      stars: 5,
      paraphrase:
        "Family runs the place and you feel it — the oxtail is the move, and the lemonade is dangerous.",
      source: "Google Reviews",
    },
    {
      name: "Marisol",
      stars: 5,
      paraphrase:
        "Came for the curry goat and stayed for the rum cake. Three sides with every plate is no joke.",
      source: "Google Reviews",
    },
    {
      name: "Theo",
      stars: 5,
      paraphrase:
        "The jerk ribs are sticky-smoky perfect. We've been four times and Smiley remembers our names.",
      source: "Google Reviews",
    },
  ],

  social: {
    facebook: "https://www.facebook.com/BambooFireDelray",
    // CONFIRM: instagram handle if one exists. Currently only Facebook found.
  },

  paymentMethods: ["Credit cards", "Cash", "CashApp", "PayPal"],
  acceptsReservations: true,
  servesCuisine: ["Caribbean", "Guyanese", "Jamaican", "Indo-Caribbean"],
  priceRange: "$$",
};
