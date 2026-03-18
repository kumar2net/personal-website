const createMapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const compiledOn = "2026-03-18";
const verifiedBy = "Kumar (web research)";
const publicDirectoryVerification = {
  verifiedAt: compiledOn,
  verifiedBy,
  verificationMethod: "directory-only",
};
const officialSiteVerification = {
  verifiedAt: compiledOn,
  verifiedBy,
  verificationMethod: "official-site",
};
const shortlistVerification = {
  verifiedAt: compiledOn,
  verifiedBy,
  verificationMethod: "shortlist-only",
};

export const ananyasLocalGuide = {
  slug: "ananyas-nearby",
  title: "Nearby essentials for Ananyas Nana Nani Homes",
  compiledOn,
  communityName: "Ananyas Nana Nani Homes, Phase 7",
  communityAddress:
    "Thondamuthur, Dhaliyur Road, Dhaliyur Post, Coimbatore, Tamil Nadu 641109",
  campusMapUrl: createMapsSearchUrl(
    "Ananyas Nana Nani Homes Phase 7, Thondamuthur, Dhaliyur Road, Coimbatore 641109",
  ),
  notes: [
    "This is a starter list compiled from public web sources on March 18, 2026.",
    "Hours, delivery coverage, and phone numbers can change; call before depending on any listing.",
    "The page intentionally anchors to the Phase 7 campus and area, not to any specific flat number.",
  ],
  nextUsefulAdditions: [
    {
      id: "milk",
      ...shortlistVerification,
      staleAfterDays: 21,
      title: "Milk and dairy top-up",
      description:
        "For daily milk, curd, and paneer, a dedicated dairy or a general store that already stocks milk is more practical than a supermarket trip.",
      shortlistLabel: "Open dairy options",
      shortlistUrl:
        "https://www.justdial.com/Coimbatore/Milk-Dairy-in-Thondamuthur/nct-10322884",
      examples: [
        "DEEPS A2 DAIRY in Thondamuthur is a current public listing with 5:00 am to 6:00 pm timings.",
        "Muthukumar Store's public listing explicitly says general stores in Thondamuthur commonly stock milk.",
      ],
      sourceLabel: "Justdial shortlist",
    },
    {
      id: "tiffin",
      ...shortlistVerification,
      staleAfterDays: 14,
      title: "Tiffin and home-meal backup",
      description:
        "This matters the moment a resident is unwell, a family member is away, or the community kitchen menu is not suitable that day.",
      shortlistLabel: "Open tiffin shortlist",
      shortlistUrl:
        "https://www.justdial.com/Coimbatore/Home-Delivery-Caterers-in-Thondamuthur/nct-11664766",
      examples: [
        "The current Thondamuthur home-delivery shortlist includes Vasantham Catering, Salem Ravichandran Tiffin House, A1 Briyani, and Saravana Family Restaurant.",
        "Use this as a backup-food directory first, then narrow it to senior-friendly, low-spice, reliable options after field testing.",
      ],
      sourceLabel: "Justdial shortlist",
    },
    {
      id: "diagnostics",
      ...shortlistVerification,
      staleAfterDays: 30,
      title: "Diagnostics and home sample collection",
      description:
        "For senior residents, blood tests and routine panels are much easier when the service can come to campus instead of requiring a car trip.",
      shortlistLabel: "Open diagnostics shortlist",
      shortlistUrl:
        "https://www.justdial.com/Coimbatore/Diagnostic-Centres-in-Thondamuthur/nct-10159446",
      examples: [
        "The public shortlist includes Aadhirama Micro Lab And Sri Ramachandra Diagnostics, Nandhu Medical Centre, and several lab chains.",
        "This should eventually become a smaller verified list of services that actually do home collection at Ananyas.",
      ],
      sourceLabel: "Justdial shortlist",
    },
    {
      id: "physio",
      ...shortlistVerification,
      staleAfterDays: 30,
      title: "Physio and rehab support",
      description:
        "Physiotherapy is a high-frequency senior-living need, especially after knee, back, balance, or mobility setbacks.",
      shortlistLabel: "Open physio shortlist",
      shortlistUrl:
        "https://www.justdial.com/Coimbatore/Physiotherapy-Centres-in-Thondamuthur/nct-10365751",
      examples: [
        "The current Thondamuthur shortlist includes BK Physiotherapy And Fitness Centre, RESILIO - The Pain Clinic, and Impulse Physiotherapy Clinic.",
        "The related category on the same page also links to home-visit physiotherapists, which is the more useful filter for Phase 7 residents.",
      ],
      sourceLabel: "Justdial shortlist",
    },
    {
      id: "drivers",
      ...shortlistVerification,
      staleAfterDays: 14,
      title: "Driver and cab support",
      description:
        "Residents often need two different transport modes: quick taxi booking and a dependable acting-driver option for family cars.",
      shortlistLabel: "Open driver shortlist",
      shortlistUrl:
        "https://www.justdial.com/ta/Coimbatore/Driver-Service-Agents-in-Thondamuthur/nct-10173205",
      examples: [
        "The current driver-agent shortlist names Track Riders, Prm Marketing Acting Drivers & Travels, Antony Acting Drivers, King Acting Driver, and Vmb Cabs and Travels.",
        "SS Call Taxi near Thondamuthur Bus Stand remains a practical direct cab fallback for airport, station, and hospital runs.",
      ],
      sourceLabel: "Justdial shortlist",
    },
    {
      id: "repeat-medicines",
      ...officialSiteVerification,
      staleAfterDays: 30,
      title: "Repeat medicine reorder flow",
      description:
        "This is less about discovering a new shop and more about making monthly reorders effortless for chronic prescriptions.",
      shortlistLabel: "Open pharmacy options",
      shortlistUrl:
        "https://www.apollopharmacy.in/medical-stores/coimbatore/thondamuthur-18055",
      examples: [
        "Apollo's official store page is useful as a delivery-oriented backup when residents or families want a repeat-order path.",
        "Thulasi Pharmacy and Sri Murugan Medicals are better local walk-in anchors, but reorder convenience should be tested by phone before relying on it.",
      ],
      sourceLabel: "Official store page",
    },
  ],
  categories: [
    {
      id: "fruits",
      title: "Fruits and vegetables",
      description:
        "Fast produce runs look strongest along the Thondamuthur and Vadavalli corridor.",
      items: [
        {
          ...publicDirectoryVerification,
          staleAfterDays: 21,
          name: "S.R. Pazhamudhir Nilayam",
          area: "Thondamuthur",
          address:
            "5/108, Narasipuram Road, Thondamuthur, Coimbatore 641109",
          hours: "Public listing says open until 8:30 pm",
          note:
            "Fruit merchant / wholesaler close to the Thondamuthur side of the campus.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Sr-Pazhamudhir-Nilayam-Thondamuthur/0422PX422-X422-140211180030-I5Z2_BZDET",
          mapUrl: createMapsSearchUrl(
            "S.R. Pazhamudhir Nilayam, 5/108 Narasipuram Road, Thondamuthur, Coimbatore 641109",
          ),
        },
        {
          ...publicDirectoryVerification,
          staleAfterDays: 21,
          name: "Day to Day Supermarket",
          area: "Vadavalli",
          address:
            "No 9, ESR Arcade Building, Ground Floor, Near Chinmaya School, Thondamuthur Road, Vadavalli, Coimbatore 641041",
          hours: "Check current timings before going",
          note:
            "Useful backup for vegetables, milk, bread, and monthly staples if a family member is doing a larger run.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Day-to-Day-Supermarket-Near-Chinmaiya-School-Vadavalli/0422PX422-X422-130129095226-F1F9_BZDET",
          mapUrl: createMapsSearchUrl(
            "Day to Day Supermarket, ESR Arcade Building, Thondamuthur Road, Vadavalli, Coimbatore 641041",
          ),
        },
      ],
    },
    {
      id: "medicines",
      title: "Medicines and pharmacy",
      description:
        "The closest pharmacy options cluster around Thondamuthur and the Vadavalli approach road.",
      items: [
        {
          ...publicDirectoryVerification,
          staleAfterDays: 30,
          name: "Sri Murugan Medicals",
          area: "Thondamuthur",
          address:
            "112, Narasipuram Road, Thondamuthur, Coimbatore 641109",
          hours: "Public listing says not 24 hours",
          note:
            "Near District Cooperative Bank. Public listing shows 0422-2617375 and 98948 37631.",
          sourceLabel: "AskLaila",
          sourceUrl:
            "https://www.asklaila.com/listing/Coimbatore/thondamuthur/sri-murugan-medicals/0Tri0paP/",
          mapUrl: createMapsSearchUrl(
            "Sri Murugan Medicals, 112 Narasipuram Road, Thondamuthur, Coimbatore 641109",
          ),
        },
        {
          ...officialSiteVerification,
          staleAfterDays: 30,
          name: "Thulasi Pharmacy",
          area: "Thondamuthur",
          address: "Door No 6/8, Mathampatti Road, Thondamuthur, Coimbatore 641109",
          hours: "Check the branch directly for live timing",
          note:
            "Listed on the official Coimbatore branches page, useful as a second nearby medicine option.",
          sourceLabel: "Official branch page",
          sourceUrl: "https://thulasipharmacy.com/coimbatore-branches.php",
          mapUrl: createMapsSearchUrl(
            "Thulasi Pharmacy, 6/8 Mathampatti Road, Thondamuthur, Coimbatore 641109",
          ),
        },
        {
          ...officialSiteVerification,
          staleAfterDays: 30,
          name: "Apollo Pharmacy",
          area: "Vadavalli approach",
          address:
            "Vadavalli Thondamuthur Road, Lakshmi Nagar, Vadavalli, Coimbatore 641007",
          hours: "Check the live store page before ordering",
          note:
            "Not the closest walk-in option, but the official Apollo page makes it a good backup for online ordering and medicine delivery.",
          sourceLabel: "Official store page",
          sourceUrl:
            "https://www.apollopharmacy.in/medical-stores/coimbatore/thondamuthur-18055",
          mapUrl: createMapsSearchUrl(
            "Apollo Pharmacy, Vadavalli Thondamuthur Road, Lakshmi Nagar, Vadavalli, Coimbatore 641007",
          ),
        },
      ],
    },
    {
      id: "groceries",
      title: "Groceries and daily staples",
      description:
        "These are the most plausible public-web options for staples, dairy, packaged foods, and household basics.",
      items: [
        {
          ...publicDirectoryVerification,
          staleAfterDays: 30,
          name: "TP Store",
          area: "Thondamuthur",
          address:
            "Kalikkanayakkanpalayam, Thondamuthur Road, Thondamuthur 641109",
          hours: "Public listing says 5:00 am - 10:00 pm",
          note:
            "Public listing mentions same-day delivery, delivery available, and in-store shopping.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Tp-Store-Thondamuthur/0422PX422-X422-200701220959-P5N3_BZDET",
          mapUrl: createMapsSearchUrl(
            "TP Store, Kalikkanayakkanpalayam, Thondamuthur Road, Thondamuthur 641109",
          ),
        },
        {
          ...publicDirectoryVerification,
          staleAfterDays: 30,
          name: "Velan Super Market",
          area: "Thondamuthur",
          address:
            "12/61, Thiruvalluvar Street, Thondamuthur, Coimbatore 641109",
          hours: "Public listing says 7:00 am - 10:30 pm",
          note:
            "Useful for one-stop monthly shopping if you want a supermarket format instead of a small general store.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Velan-Super-Market-Thondamuthur/0422PX422-X422-220614014158-G7B2_BZDET",
          mapUrl: createMapsSearchUrl(
            "Velan Super Market, 12/61 Thiruvalluvar Street, Thondamuthur, Coimbatore 641109",
          ),
        },
        {
          ...publicDirectoryVerification,
          staleAfterDays: 30,
          name: "Lakshmi Store",
          area: "Vedapatti corridor",
          address:
            "Raj Avenue, 11, Kurumbapalayam, Thondamuthur Road, Vedapatti, Coimbatore 641007",
          hours: "Public listing says 8:00 am - 10:00 pm",
          note:
            "Public listing mentions same-day delivery. Good fallback if someone is already coming from the Vedapatti side.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Lakshmi-Store-Near-Karupparayan-Kovil-Vedapatti/0422PX422-X422-231212222500-D1P3_BZDET",
          mapUrl: createMapsSearchUrl(
            "Lakshmi Store, Raj Avenue 11, Kurumbapalayam, Thondamuthur Road, Vedapatti, Coimbatore 641007",
          ),
        },
      ],
    },
    {
      id: "services",
      title: "Other useful nearby services",
      description:
        "These are practical backups for transport, repairs, and medical support around the same corridor.",
      items: [
        {
          ...officialSiteVerification,
          staleAfterDays: 45,
          name: "ANP Nursing Home",
          area: "Jayanagar, Poochiyur",
          address:
            "8/1, Jaya Nagar, Poochiyur, Thondamuthur Road, Dheenampalayam Post, Coimbatore 641109",
          hours: "Check the hospital directly for current availability",
          note:
            "Official site describes it as a 30-bed multispeciality hospital in the Thondamuthur belt.",
          sourceLabel: "Official site",
          sourceUrl: "https://anp.hms-society.com/",
          mapUrl: createMapsSearchUrl(
            "ANP Nursing Home, 8/1 Jaya Nagar, Poochiyur, Thondamuthur Road, Coimbatore 641109",
          ),
        },
        {
          ...publicDirectoryVerification,
          staleAfterDays: 14,
          name: "SS Call Taxi",
          area: "Thondamuthur Bus Stand",
          address: "Near Thondamuthur Bus Stand, Coimbatore",
          hours: "Public listing says open 24 hours",
          note:
            "Useful for station, airport, hospital, or city runs when app-based cab availability is patchy.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Ss-Call-Taxi-NEAR-THONDAMUTHUR-BUS-STAND-Thondamuthur/0422PX422-X422-160506113111-S3S7_BZDET",
          mapUrl: createMapsSearchUrl(
            "SS Call Taxi, Near Thondamuthur Bus Stand, Coimbatore",
          ),
        },
        {
          ...publicDirectoryVerification,
          staleAfterDays: 14,
          name: "Micheal Electrical & Plumbing",
          area: "Veenapalayam Post",
          address:
            "Near Rajalakshmi Madapam, Puthupalayam, Veenapalayam Post, Thondamuthur, Coimbatore",
          hours: "Public listing says open 24 hours",
          note:
            "Good to keep as a repair backup for electrical or plumbing issues instead of discovering a vendor during an outage.",
          sourceLabel: "Justdial",
          sourceUrl:
            "https://www.justdial.com/Coimbatore/Micheal-Electrical-Plumbing-Near-Rajalakshmi-Madapam-Puthupalayam-Veenapalayam-Post-Thondamuthur/0422PX422-X422-181126143008-C5S4_BZDET",
          mapUrl: createMapsSearchUrl(
            "Micheal Electrical & Plumbing, Rajalakshmi Madapam, Puthupalayam, Veenapalayam Post, Thondamuthur, Coimbatore",
          ),
        },
      ],
    },
  ],
};

export { createMapsSearchUrl };
