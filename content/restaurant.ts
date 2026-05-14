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
      "We take reservations. We do takeout. Cooked from scratch — that part isn't negotiable.",
    ],
    pullQuote: {
      text: "A neighborhood institution where the curries taste like home cooking.",
      attribution: "paraphrased from Boca Magazine, 2022",
      sourceUrl:
        "https://bocamag.com/restaurant-review-bamboo-fire-cafe/",
    },
    // SEO filename committed ahead of the actual file landing in /public/story/. Story.tsx
    // checks for the file at build time and falls back to "Family photo coming soon" when
    // it isn't present, so search engines get a stable URL the day Beverly drops the photo.
    storyImage: {
      src: "/story/jacobs-family-bamboo-fire-cafe-delray-beach.jpg",
      alt: "Donald, Beverly, and Lauren Jacobs at Bamboo Fire Cafe in Delray Beach",
    },
  },

  menu: {
    // Menu-engineered May 2026 across the full Bamboo Fire offering, with prices and item
    // structure confirmed by Beverly. Section order is intentional — Loaded Fries & Nachos
    // up high because the highest-margin starters drive bigger checks; high-end anchor items
    // (Lamb Chops, Snapper Filet) sit at the end of their sections; signature flags reserved
    // for the 5 entrées Beverly is most proud to put her name to. NEW flags reserved for
    // the 2 just-launched items (Jerk Fries, Guyanese Fried Chicken).
    //
    // Sections render in array order; empty sections (Today's Special, Seasonal) are
    // filtered out by Menu.tsx so they don't show hollow headings.
    sections: [
      {
        // Surfaces above all other sections when populated. Empty by default — Beverly adds
        // a special dish here when there's one to feature; otherwise the section is skipped.
        title: "Today's Special",
        items: [],
      },
      {
        title: "Starters",
        items: [
          { name: "Conch Fritters", price: "$11", description: "Tender conch in a crispy fritter." },
          { name: "Conch Ceviche", price: "$19", description: "Fresh conch marinated in a zesty blend of flavors." },
          { name: "Grilled Conch", price: "$19", description: "Tender conch, expertly grilled." },
          { name: "Tostones w/ Garlic Sauce", price: "$9", description: "Crispy fried green plantains with rich garlic sauce.", tags: ["V"] },
          { name: "Tostones w/ Eggplant Dip", price: "$11", description: "Tostones served with our smoky eggplant dip.", tags: ["V"] },
          { name: "Eggplant Dip w/ Bread", price: "$10", description: "Smoky eggplant blended with creamy goodness, served with warm bread.", tags: ["V"] },
          { name: "Eggplant w/ Roti", price: "$15", description: "Curried eggplant with warm roti — Indo-Caribbean comfort.", tags: ["V"] },
          { name: "Plantain Fries w/ Spicy Aioli", price: "$9", description: "Thinly sliced plantains, crispy outside and soft within, with a spicy aioli on the side.", tags: ["V"] },
          { name: "Jerk Meatballs", price: "$12", description: "Spicy meatballs infused with jerk seasoning.", tags: ["spicy"] },
          { name: "Garbanzo Fritos", price: "$9", description: "Cumin-seasoned, crunchy garbanzo fritos.", tags: ["V"] },
          { name: "Dhal (Yellow Lentil Soup)", price: "$9", description: "Traditional yellow lentil soup.", tags: ["V"] },
        ],
      },
      {
        title: "Loaded Fries & Nachos",
        blurb: "Bar food, Caribbean-style. You won't find these anywhere else in Delray.",
        items: [
          {
            name: "Jerk Fries",
            price: "$11",
            description: "Fries tossed in jerk sauce with green onions.",
            tags: ["spicy"],
            isNew: true,
            addOns: [
              { name: "Chicken", price: "+$4" },
              { name: "Pork", price: "+$5" },
              { name: "Shrimp", price: "+$6" },
            ],
          },
          {
            name: "Tostone Nachos",
            price: "$13",
            description: "Tostones, melted cheese, scallions.",
            addOns: [
              { name: "Chicken", price: "+$4" },
              { name: "Pork", price: "+$5" },
              { name: "Shrimp", price: "+$6" },
            ],
          },
        ],
      },
      {
        title: "Entrées",
        callout: "Each entrée comes with your choice of rice, vegetables, or sweet plantains.",
        items: [
          {
            name: "Oxtail Pepperpot",
            price: "$25",
            description: "Slow-braised oxtail in Beverly's brown sauce pepperpot — Berbice-style, simmered until it falls off the bone.",
            tags: ["signature"],
            image: "/gallery/oxtail-rice-and-peas-bamboo-fire-delray.jpg",
            imageAlt:
              "Bamboo Fire Cafe oxtail pepperpot served over rice and peas in Delray Beach",
          },
          {
            name: "Curry Goat",
            price: "$22",
            description: "Slow-cooked goat in island curry spices — Beverly's recipe from Berbice.",
            tags: ["signature"],
            image: "/gallery/curry-goat-roti-bamboo-fire-delray-beach.jpg",
            imageAlt: "Curry goat with roti at Bamboo Fire Cafe in Delray Beach",
          },
          {
            name: "Guyanese Fried Chicken (Chicken in the Rough)",
            price: "$18",
            description: "Crispy, golden Caribbean fried chicken — the way it's served back home in Berbice.",
            tags: ["signature"],
            isNew: true,
          },
          {
            name: "Chicken (jerk, curry or grilled)",
            price: "$18",
            description: "Tender Caribbean chicken — choose your style: sticky-smoky jerk, fragrant curry, or grilled with our house rub.",
            tags: ["signature"],
            image: "/gallery/jerk-chicken-rice-plantains-bamboo-fire-delray.jpg",
            imageAlt:
              "Jerk chicken plate with rice and plantains at Bamboo Fire Cafe Delray Beach",
          },
          {
            name: "Jerk Ribs",
            price: "$24",
            description: "Sticky-smoky jerk ribs, slow-cooked, charred over high heat.",
            tags: ["signature", "spicy"],
          },
          { name: "Jerk Platter (ribs, chicken or pork)", price: "$27", description: "A combination platter of jerk-spiced meats.", tags: ["spicy"] },
          { name: "Pork (jerk or curry)", price: "$20", description: "Caribbean pork — your choice of jerk or curry." },
          { name: "Basa (jerk, curry, grilled or escovitch)", price: "$20", description: "Pan-prepared basa with your choice of Caribbean preparation." },
          { name: "Conch (cracked or grilled)", price: "$22", description: "Tender conch, prepared cracked or grilled." },
          { name: "Shrimp (coconut, curry, creole, jerk or grilled)", price: "$22", description: "Caribbean shrimp — pick your preparation." },
          { name: "Grilled Lamb Chops", price: "$29", description: "Caribbean-rubbed lamb chops, charred to order — the high-end anchor of the menu." },
        ],
      },
      {
        title: "Seafood",
        items: [
          { name: "Corvina", price: "$25", description: "Fresh corvina, prepared Caribbean-style." },
          { name: "Grouper", price: "$27", description: "Whole or filet grouper with our house spice." },
          { name: "Snapper Filet", price: "$28", description: "Pan-prepared snapper filet, the high-end fish anchor." },
        ],
      },
      {
        title: "Mac & Cheese",
        blurb: "Build your own. Start with our creamy base, add what you want.",
        items: [
          {
            name: "Classic Mac",
            description: "Our creamy three-cheese base.",
            tags: ["V"],
            sizes: [
              { label: "Sm", price: "$12" },
              { label: "Lg", price: "$15" },
            ],
            addOns: [
              { name: "Chicken", price: "+$4" },
              { name: "Pork", price: "+$5" },
              { name: "Shrimp", price: "+$6" },
              { name: "Fish / Lobster / Seafood", price: "MKT" },
            ],
          },
        ],
      },
      {
        title: "Plant Based",
        items: [
          { name: "Tofu (jerk, curry, grilled or escovitch)", price: "$18", description: "Caribbean-prepared tofu — pick your style.", tags: ["V"] },
          { name: "Coconut Tofu", price: "$17", description: "Coconut-crusted tofu with sweet chili.", tags: ["V"] },
          { name: "Veggie Lo Mein", price: "$17", description: "Caribbean-style lo mein with vegetables.", tags: ["V"] },
          { name: "Veggie (curry or jerk)", price: "$17", description: "Cauliflower-forward vegetable plate, your spice.", tags: ["V"] },
        ],
      },
      {
        title: "Salads",
        items: [
          {
            name: "House Salad",
            price: "$9",
            description: "Fresh mixed greens.",
            tags: ["V"],
            addOns: [
              { name: "Chicken", price: "+$6" },
              { name: "Pork", price: "+$8" },
              { name: "Shrimp", price: "+$10" },
            ],
          },
        ],
      },
      {
        // Same skip-if-empty pattern as Today's Special. Used for limited-time market items.
        // When Beverly lists a seasonal catch, add it here and it'll appear; remove the entry
        // when it's no longer available and the section hides itself again.
        title: "Seasonal",
        items: [],
        // Reference for what tends to show up here: lobster, monkfish, yellowtail, grouper,
        // crab — typically priced "MKT" because the dock price moves.
      },
      {
        title: "Extras",
        items: [
          { name: "White Rice", price: "$6", tags: ["V"] },
          { name: "Rice & Peas", price: "$8", tags: ["V"] },
          { name: "Okra Fried Rice", price: "$8", tags: ["V"] },
          { name: "Potato Fries", price: "$8", tags: ["V"] },
          { name: "Sweet Potato Fries", price: "$10", tags: ["V"] },
          { name: "Sweet Plantains", price: "$8", tags: ["V"] },
          { name: "Veggie Side", price: "$8", tags: ["V"] },
          { name: "Garlic Toast", price: "$6", tags: ["V"] },
          { name: "Roti", price: "$4.50", tags: ["V"] },
        ],
      },
      {
        title: "Dessert",
        items: [
          {
            name: "Rumcake with Ice Cream",
            description: "House signature, rum-soaked and spiced, served with vanilla ice cream.",
            sizes: [
              { label: "Sm", price: "$8" },
              { label: "Lg", price: "$10" },
            ],
          },
          { name: "Guava Cheesecake", price: "$10", description: "Creamy cheesecake with a tropical guava swirl." },
        ],
      },
    ],
    footnotes: [
      "Ask us about dietary adjustments — vegetarian, gluten-free and dairy-free swaps are usually doable with notice.",
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
      caption: "Dining Room",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/jerk-chicken-rice-plantains-bamboo-fire-delray.jpg",
      alt: "Jerk chicken plate with rice and plantains at Bamboo Fire Cafe in Delray Beach",
      caption: "Jerk Chicken",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/curry-goat-roti-bamboo-fire-delray-beach.jpg",
      alt: "Curry goat and roti at Bamboo Fire Cafe in Delray Beach",
      caption: "Curry Goat",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/oxtail-rice-and-peas-bamboo-fire-delray.jpg",
      alt: "Oxtail in gravy with rice and peas at Bamboo Fire Cafe in Delray Beach",
      caption: "Oxtail",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/red-snapper-banana-leaf-caribbean-delray.jpg",
      alt: "Red snapper baked in banana leaf at Bamboo Fire Cafe, Caribbean restaurant in Delray Beach",
      caption: "Fish in Banana Leaf",
      width: 1200,
      height: 800,
    },
    {
      src: "/gallery/bamboo-fire-cafe-exterior-ne-4th-ave-delray.jpg",
      alt: "Bamboo Fire Cafe exterior on NE 4th Avenue in Delray Beach",
      caption: "Exterior",
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
    {
      publication: "Broward Palm Beach (New Times)",
      date: "2024", // CONFIRM exact publication date when located
      paraphrase:
        "Caribbean cooking with real depth and a family at the heart of it — worth the trip to Delray.",
      url: "https://www.browardpalmbeach.com/food-drink/bamboo-fire-caf-in-delray-beach-is-worth-the-wait-6335073",
    },
    {
      publication: "The Coastal Star",
      date: "2024", // CONFIRM
      paraphrase:
        "Beverly Jacobs' kitchen continues to define Caribbean dining in Delray Beach.",
      url: "https://thecoastalstar.com/profiles/blogs/the-plate-a-chicken-dish-that-hangs-fire",
    },
    {
      publication: "Foodie Fort Lauderdale (TikTok)",
      date: "2022",
      paraphrase:
        "Pan-Caribbean cooking that makes the trip from Fort Lauderdale worth it.",
      url: "https://www.tiktok.com/@foodiefortlauderdale/video/7099658461201403178",
      type: "video",
    },
    {
      publication: "YouTube — Caribbean Food Tour",
      date: "2023", // CONFIRM
      paraphrase:
        "Featured in a Delray Beach food walk highlighting independent Caribbean kitchens.",
      url: "https://youtu.be/NR-8_qq_pjI",
      type: "video",
    },
  ],

  // Aggregate stats per platform — drives the "stats band" above the prose review snippets.
  // Refresh quarterly. Featured platform (currently Google) gets enhanced visual treatment
  // and should be the platform that contributes most to local-search visibility.
  reviewStats: [
    {
      platform: "Google",
      rating: "4.8",
      label: "★",
      count: "307 reviews",
      url: "https://www.google.com/search?q=Bamboo+Fire+Cafe+Delray+Beach",
      featured: true,
    },
    {
      platform: "Yelp",
      rating: "4.5",
      label: "★",
      count: "370 reviews",
      url: "https://www.yelp.com/biz/bamboo-fire-cafe-delray-beach",
    },
    {
      platform: "Tripadvisor",
      rating: "4.5",
      label: "★",
      count: "114 reviews",
      url: "https://www.tripadvisor.com/Restaurant_Review-g34179-d1604319-Reviews-Bamboo_Fire_Cafe-Delray_Beach_Florida.html",
    },
    {
      platform: "Facebook",
      rating: "96",
      label: "% recommend",
      count: "287 reviews",
      url: "https://www.facebook.com/BambooFireDelray",
    },
    {
      platform: "Uber Eats",
      rating: "4.4",
      label: "★",
      count: "140+ ratings",
      url: "https://www.ubereats.com/store/bamboo-fire-cafe-delray-beach/vfRrP-qkUZa0Kjn9o4lsQg",
    },
  ],

  // Sum of Google (307) + Yelp (370) + Tripadvisor (114) + Facebook (287) + Uber Eats (140)
  // = 1,218. Weighted average across the 4 star-rated platforms (Facebook's 'recommend %'
  // excluded from rating calculation but included in reviewCount): 4.58, rounded to 4.6.
  aggregateRating: {
    ratingValue: "4.6",
    reviewCount: 1218,
    bestRating: "5",
    worstRating: "1",
  },

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
        "Came for the curry goat and stayed for the rum cake. The kind of place where the kitchen actually cares.",
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
