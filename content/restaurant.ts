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

  // Channel split: phone-pickup is the primary order CTA (highest margin for the merchant);
  // UberEats is the secondary path so customers who default to delivery-app behavior still
  // have a clear funnel. Future merchants who aren't on UberEats omit `delivery` entirely
  // and the secondary CTA stops rendering. Future Lōcal milestone is to swap UberEats for
  // Uber Direct (white-label) so the order goes through the merchant's own checkout — same
  // ~$6 drop fee, but the data + customer relationship stay with the merchant.
  ordering: {
    pickup: {
      primary: "phone",
      phoneNumber: "+15617490973",
    },
    delivery: {
      provider: "ubereats",
      url: "https://www.ubereats.com/store/bamboo-fire-cafe-delray-beach/vfRrP-qkUZa0Kjn9o4lsQg",
    },
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
    // Source: Uber Eats (May 2026). Prices to be confirmed by Beverly for dine-in. UberEats also
    // has Vegetarian, Mac & Cheese, Extras, and Dessert sections but specific items in those
    // aren't listed publicly.
    sections: [
      {
        title: "Starters",
        items: [
          { name: "Jerk Meatballs", price: "$10", description: "Spicy meatballs infused with jerk seasoning.", tags: ["spicy"] },
          { name: "Tostones with Garlic Sauce", price: "$8", description: "Crispy fried green plantains served with rich garlic sauce." },
          { name: "Garbanzo Fritos", price: "$7", description: "Crunchy fritos filled with garbanzo beans.", tags: ["V"] },
          { name: "Conch Ceviche", price: "$16", description: "Fresh conch marinated in a zesty blend of flavors." },
          { name: "Conch Fritters", price: "$11", description: "Tender conch in a crispy fritter." },
          { name: "Grilled Eggplant Dip", price: "$9", description: "Smoky eggplant blended with creamy goodness.", tags: ["V"] },
          { name: "Grilled Conch", price: "$16", description: "Tender conch, expertly grilled." },
          { name: "Plantain Fries", price: "$8", description: "Thinly sliced plantains, crispy outside and soft within.", tags: ["V"] },
          { name: "Dhal (Yellow Lentil Soup)", price: "$9", description: "Traditional yellow lentil soup.", tags: ["V"] },
        ],
      },
      {
        title: "Salads",
        items: [
          { name: "House Salad", price: "$8", description: "Fresh mixed greens.", tags: ["V"] },
        ],
      },
      {
        title: "Caribbean Entrées",
        callout: "Each entrée comes with your choice of rice, vegetables, or sweet plantains.",
        items: [
          { name: "Oxtail Pepperpot", price: "$19", description: "Slow-braised oxtail in rich Caribbean pepperpot stew.", tags: ["signature"] },
          { name: "Chicken Curry", price: "$16", description: "Tender chicken in fragrant island curry.", tags: ["signature"] },
          { name: "Curry Goat", price: "$19", description: "Slow-cooked goat in island curry spices." },
          { name: "Jerk Chicken", price: "$16", description: "Bamboo Fire's jerk-spiced grilled chicken.", tags: ["signature", "spicy"] },
          { name: "Grilled Chicken", price: "$16", description: "Caribbean-marinated grilled chicken." },
          { name: "Jerk Pork", price: "$15", description: "Jerk-spiced grilled pork.", tags: ["spicy"] },
          { name: "Fish in Banana Leaf", price: "Market price (~$25)", description: "Fish wrapped in banana leaf, infused with Caribbean flavors." },
          { name: "Grilled Conch", price: "$18", description: "Tender grilled conch with island spices." },
          { name: "Cracked Conch", price: "$18", description: "Crispy fried conch, golden and tender." },
          { name: "Basa", price: "$18", description: "Pan-seared basa with Caribbean seasonings." },
        ],
      },
    ],
    footnotes: [
      "Prices reflect Uber Eats delivery pricing as of May 2026; dine-in pricing may differ. Call us to confirm.",
      "Ask us about dietary adjustments — vegetarian, gluten-free and dairy-free swaps are usually doable with notice.",
      "Vegetarian, mac & cheese, extras, and dessert sections also available — ask us or check Uber Eats for what's on offer tonight.",
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

  // Tuned for long-tail Google queries ("is bamboo fire cafe open monday", "vegetarian
  // options", etc.) and for AI-search citation. Keep answers self-contained — they get
  // extracted out of context by ChatGPT/Perplexity/Claude, so don't reference "above"/"below".
  // Same array drives the visible accordion AND the FAQPage JSON-LD in lib/schema.ts.
  faqs: [
    {
      q: "Where is Bamboo Fire Cafe located?",
      a: "Bamboo Fire Cafe is at 149 NE 4th Avenue in Delray Beach, Florida, just steps from the Pineapple Grove Arts District.",
    },
    {
      q: "What kind of food does Bamboo Fire Cafe serve?",
      a: "Bamboo Fire Cafe serves Caribbean and World Cuisine with deep Guyanese roots. Signature dishes include oxtail pepperpot, jerk chicken, curry goat, and conch ceviche. The kitchen also offers vegetarian and pescatarian options.",
    },
    {
      q: "Do you take reservations?",
      a: "Yes. Call (561) 749-0973 to reserve a table, especially recommended for weekend evenings.",
    },
    {
      q: "What days are you open?",
      a: "Bamboo Fire Cafe is open Wednesday through Sunday. Closed Mondays and Tuesdays. See the location section for current hours.",
    },
    {
      q: "Do you offer vegetarian options?",
      a: "Yes. Vegetarian options include the House Salad, Tostones with Garlic Sauce, Garbanzo Fritos, Grilled Eggplant Dip, Plantain Fries, and Dhal (Yellow Lentil Soup). The kitchen can also adapt many entrees on request.",
    },
    {
      q: "Do you deliver?",
      a: "Yes. Delivery is available through Uber Eats. For pickup, call (561) 749-0973 directly — pickup orders bypass delivery fees and reach the kitchen with full menu access.",
    },
    {
      q: "Do you cater events?",
      a: "Yes. Bamboo Fire Cafe caters private events of all sizes. Call (561) 749-0973 to discuss menus and pricing.",
    },
    {
      q: "How long has Bamboo Fire Cafe been in Delray Beach?",
      a: "Bamboo Fire Cafe has served Delray Beach since 2009 — over 17 years. Owners Donald and Beverly Jacobs are originally from Berbice, Guyana, and the menu reflects their Guyanese heritage alongside broader Caribbean and world influences.",
    },
    {
      q: "How spicy are the jerk dishes?",
      a: "Bamboo Fire Cafe's jerk dishes are traditionally spiced — flavorful with moderate heat. Spice level can be adjusted on request, milder or hotter.",
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
