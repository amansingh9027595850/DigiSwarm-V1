import {
  Globe,
  Share2,
  Search,
  MousePointerClick,
  MapPin,
  PenTool,
  UserCheck,
  MessageSquare,
  Palette,
} from 'lucide-react';

// Per-page imagery lives in /public/Images (numbered, ad-hoc content).
// Brand-presentation assets live in /public/brand-assets — these are the
// canonical poster / OG / favicon / blog-cover files we use everywhere.
export const HERO_IMAGE = '/Images/01-hero-digital-marketing-dashboard.png';
// Page-specific hero images (distinct visuals per page)
export const ABOUT_HERO_IMAGE = '/Images/About.png';
export const CAREER_HERO_IMAGE = '/Images/career.png';
// The team poster is still used inside the About "Our Company" deeper section
// and as a TeamSection fallback — keeps a consistent team narrative there.
export const ABOUT_TEAM_IMAGE = '/brand-assets/about-team-poster-1200x1500.png';
export const BLOG_COVER_IMAGE = '/brand-assets/blog-default-cover-1600x900.png';
export const OG_IMAGE = '/brand-assets/og-social-share-1200x630.png';
export const FAVICON_IMAGE = '/brand-assets/favicon-app-icon-512x512.png';

export const SERVICES = [
  {
    slug: 'website-design',
    title: 'Website Design',
    icon: Globe,
    tagline: 'Modern, fast, conversion-focused websites that turn visitors into customers.',
    tags: ['UI/UX', 'Responsive', 'Branding'],
    image: '/Images/03-web-development-mockup.png',
    accent: 'from-brand-500 to-indigo-500',
  },
  {
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    icon: Share2,
    tagline: 'Build a brand voice on Instagram, Facebook, and LinkedIn with content that performs.',
    tags: ['Instagram', 'Meta Ads', 'Strategy'],
    image: '/Images/04-social-media-marketing.png',
    accent: 'from-fuchsia-500 to-rose-500',
  },
  {
    slug: 'search-engine-optimisation',
    title: 'Search Engine Optimisation',
    icon: Search,
    tagline: 'Rank where your customers look — technical SEO, content, and authority, done right.',
    tags: ['SEO', 'On-page', 'Off-page'],
    image: '/Images/02-seo-ranking-growth.png',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'pay-per-click',
    title: 'Pay Per Click',
    icon: MousePointerClick,
    tagline: 'Targeted ad campaigns on Google and Meta that deliver measurable ROI.',
    tags: ['Google Ads', 'Meta Ads', 'Performance'],
    image: '/Images/05-ppc-online-advertising.png',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    slug: 'google-my-business-listing',
    title: 'Google My Business Listing',
    icon: MapPin,
    tagline: 'Show up in local searches with an optimised GMB profile and consistent citations.',
    tags: ['Local SEO', 'GMB', 'Reviews'],
    image: '/Images/06-google-my-business-local-seo.png',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    slug: 'content-writing',
    title: 'Content Writing',
    icon: PenTool,
    tagline: 'SEO-friendly blogs, landing pages, and product copy that read like a human.',
    tags: ['Blogs', 'Copywriting', 'SEO Content'],
    image: '/Images/07-content-writing.png',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    slug: 'influencer-marketing',
    title: 'Influencer Marketing',
    icon: UserCheck,
    tagline: 'Partner with creators your audience already trusts to drive authentic engagement.',
    tags: ['Creators', 'Campaigns', 'UGC'],
    image: '/Images/08-influencer-marketing.png',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    slug: 'whatsapp-marketing',
    title: 'WhatsApp Marketing',
    icon: MessageSquare,
    tagline: 'Direct, personal, high open-rate broadcasts and conversational campaigns.',
    tags: ['Broadcasts', 'Automation', 'CRM'],
    image: '/Images/09-whatsapp-marketing.png',
    accent: 'from-green-500 to-emerald-500',
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    icon: Palette,
    tagline: 'Logos, social creatives, banners, and packaging — visuals that punch above their weight.',
    tags: ['Logo', 'Creatives', 'Brand Kit'],
    image: '/Images/10-graphic-design.png',
    accent: 'from-orange-500 to-red-500',
  },
];

export const STATS = [
  { value: '200+', label: 'Projects delivered' },
  { value: '60+', label: 'Happy clients' },
  { value: '12', label: 'Specialists in-house' },
  { value: '5★', label: 'Average rating' },
];

export const PROCESS = [
  {
    step: '01',
    title: 'Discover',
    body: 'We listen to your brand, goals, and target audience — then dig into your competition.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Plan',
    body: 'A clear strategy across channels with measurable KPIs, budgets, and timelines.',
    icon: PenTool,
  },
  {
    step: '03',
    title: 'Execute',
    body: 'Our in-house team ships campaigns, content, and creatives in weekly sprints.',
    icon: Share2,
  },
  {
    step: '04',
    title: 'Optimise',
    body: 'Continuous A/B testing, reporting, and iteration — growth is a habit, not a project.',
    icon: MousePointerClick,
  },
];

export const PROJECTS = [
  {
    slug: 'local-bakery-rebrand',
    title: 'Local Bakery — Brand + Web',
    client: 'Sweet Crumb',
    category: 'Branding',
    tags: ['Logo', 'Website', 'Social'],
    summary: 'New identity and a single-page ordering site that lifted weekly footfall by 38%.',
    accent: 'from-brand-500 to-indigo-500',
  },
  {
    slug: 'real-estate-lead-gen',
    title: 'Real Estate Lead Engine',
    client: 'Doon Homes',
    category: 'Performance',
    tags: ['Google Ads', 'Landing Page', 'CRM'],
    summary: 'Google Ads + WhatsApp follow-up flow that cut their cost-per-lead by 46%.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'wellness-instagram-growth',
    title: 'Wellness Studio Instagram Growth',
    client: 'Vita Living',
    category: 'Social',
    tags: ['Reels', 'Influencers', 'Strategy'],
    summary: 'From 1.2k to 28k followers in 6 months with a creator-led content engine.',
    accent: 'from-orange-500 to-rose-500',
  },
  {
    slug: 'clothing-store-seo',
    title: 'Local Clothing Store SEO',
    client: 'Hill Threads',
    category: 'SEO',
    tags: ['Local SEO', 'GMB', 'Content'],
    summary: 'Page-one rankings on 14 high-intent keywords; organic visits up 3.2x year over year.',
    accent: 'from-amber-500 to-pink-500',
  },
];

export const TESTIMONIALS = [
  {
    name: 'City Heart Center',
    role: 'Client',
    content:
      "We've seen tremendous growth in our online presence since partnering with this agency. Their creative and data-driven strategies have exceeded our expectations. Their team is reliable, innovative, and consistently delivers great results. I highly recommend them!",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1735973225/City_heart_centre_logo_hxkzva.png',
    },
  },
  {
    name: 'Prayas Sewa Samiti (Rehab Centre)',
    role: 'Client',
    content:
      "This digital marketing agency in Dehradun has completely transformed our business's online presence. Their ad campaigns have delivered excellent ROI, far exceeding our expectations. Their strategic approach and continuous optimization make them the best in the industry. Trustworthy and results-oriented — highly recommend them!",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1741079312/prayas_sewa_new_size_by_parkhi_mjdjhq.png',
    },
  },
  {
    name: 'Ayurmax Hospital',
    role: 'Client',
    content:
      'Their expertise in SEO and ad campaigns is unmatched. This digital marketing agency in Dehradun has helped us reach new heights in online visibility and sales. Their hard work and dedication have been instrumental to our success. A fantastic agency to work with — I trust them completely.',
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606553/Dr._Arvind_Chaudhary_x2xgx7.png',
    },
  },
  {
    name: 'The Third Eye',
    role: 'Client',
    content:
      "The team at this digital marketing agency in Dehradun is incredibly dedicated and hard-working. They go above and beyond to ensure their clients' success. Their expertise in digital marketing has significantly boosted our brand's online visibility. I recommend them wholeheartedly to anyone looking for stellar results.",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606553/IMG-20231107-WA0009_zyexnd.jpg',
    },
  },
  {
    name: 'Skills Station Academy',
    role: 'Client',
    content:
      "It's rare to find a digital marketing agency in Dehradun that delivers exactly what they promise. Their professionalism and trustworthy nature have made our partnership stress-free. Their strategies for digital growth are spot-on, and the results speak for themselves. A team you can count on!",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1735973225/skill_station_by_parkhi_logo_no7uvg.png',
    },
  },
  {
    name: 'Avika Energy System Pvt. Ltd',
    role: 'Client',
    content:
      'This digital marketing agency in Dehradun has been an integral part of our success. Their customized strategies, coupled with a highly skilled and supportive team, make them a reliable partner. Their commitment to delivering results is commendable. Truly outstanding service and support!',
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1726492912/pvt._Ltd._3_wubi9k.png',
    },
  },
  {
    name: 'Smart Agri Incorporation',
    role: 'Client',
    content:
      'This digital marketing agency in Dehradun has been a game-changer for our business. Their outstanding performance in SEO, combined with their attention to detail, has brought us consistent traffic and conversions. Their work ethic and commitment are truly remarkable. Highly recommended!',
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606553/smart-agri-innovations-logo_2_jfau08.png',
    },
  },
  {
    name: 'KundanMala Jewels',
    role: 'Client',
    content:
      'We partnered with this digital marketing agency in Dehradun for our SEO needs, and the results have been exceptional. Their hard-working and dedicated team improved our website rankings significantly. The transparency and professionalism they bring to the table are truly commendable. Highly recommended for anyone seeking reliable SEO services!',
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606552/Kundan_Mala_9_sisiqm.png',
    },
  },
  {
    name: 'New Garhwal Jewellers',
    role: 'Client',
    content:
      "We approached this digital marketing agency in Dehradun for website development, and they delivered beyond our expectations. The team is highly skilled, responsive, and creative. They crafted a site that aligns perfectly with our vision. Truly an outstanding development team, and I'm thrilled with their work!",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606558/IMG_2041_mvxzg4.png',
    },
  },
  {
    name: 'Hotel Vasdaa Grand',
    role: 'Client',
    content:
      "I was skeptical about digital ads initially, but this digital marketing agency in Dehradun proved me wrong! Their ad campaigns have generated phenomenal ROI and significantly increased our customer base. The team's knowledge and dedication are truly impressive. They're the best in the business.",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1735973225/Vasdaa_Hotel_2_pwze6o.png',
    },
  },
  {
    name: 'Hotel Forest Avenue',
    role: 'Client',
    content:
      "We've seen tremendous growth in our online presence since partnering with this digital marketing agency in Dehradun. Their creative and data-driven strategies have exceeded our expectations. Their team is reliable, innovative, and consistently delivers great results. I highly recommend them!",
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dpzhezt6x/image/upload/v1735973225/hotel_forest_avenue_logo_mselus.png',
    },
  },
  {
    name: 'Hotel Pinnacle',
    role: 'Client',
    content:
      'Working with DigiSwarm has been a pleasure from start to finish. Their knowledgeable team has helped us navigate the complexities of digital marketing, resulting in a noticeable boost in traffic and engagement. Their commitment to our success is truly appreciated.',
    rating: 5,
    photo: {
      url: 'https://res.cloudinary.com/dgigqsaat/image/upload/v1718606553/Hotel_1_rd5saw.png',
    },
  },
];

export const BLOG_PREVIEW = [
  {
    slug: 'local-seo-2026',
    title: 'Local SEO in 2026 — what actually moves the needle',
    excerpt:
      'GMB optimisation, citations, reviews, and the on-page signals Google rewards in 2026.',
    cover: '/Images/02-seo-ranking-growth.png',
    date: 'May 02, 2026',
    readTime: '6 min',
    category: 'SEO',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'reels-that-convert',
    title: 'Reels that convert: the 7-second hook framework',
    excerpt: 'How we structure short-form video to drive comments, saves, and DMs.',
    cover: '/Images/04-social-media-marketing.png',
    date: 'Apr 18, 2026',
    readTime: '5 min',
    category: 'Social',
    accent: 'from-fuchsia-500 to-rose-500',
  },
  {
    slug: 'whatsapp-marketing-playbook',
    title: 'WhatsApp marketing playbook for small businesses',
    excerpt: 'Broadcasts, automated journeys, and the ROI math behind it.',
    cover: '/Images/09-whatsapp-marketing.png',
    date: 'Mar 27, 2026',
    readTime: '7 min',
    category: 'Marketing',
    accent: 'from-green-500 to-emerald-500',
  },
];

export const TRUSTED_BY = [
  'Sweet Crumb',
  'Doon Homes',
  'Vita Living',
  'Hill Threads',
  'Acuity Café',
  'Vantra Studio',
  'Brightline',
];

export const COMPANY_VALUES = [
  {
    title: 'Outcomes over output',
    body:
      'We measure success in metrics that matter to your business — bookings, leads, sales — not posts shipped.',
  },
  {
    title: 'In-house specialists',
    body:
      'Designers, developers, editors, and strategists — all under one roof, no freelance handoffs.',
  },
  {
    title: 'Transparent reporting',
    body:
      'Weekly dashboards with the numbers that matter. You always know what we are doing and why.',
  },
  {
    title: 'Partners, not vendors',
    body: 'We push back when it is the right call and own the result with you.',
  },
];

export const COMPANY_INFO = {
  name: 'DigiSwarm',
  tagline: 'Your Trusted Partner for Digital Marketing Excellence in Uttarakhand',
  about:
    'At DigiSwarm, we are more than just a digital marketing agency — we are your strategic ally in navigating the dynamic and ever-evolving digital landscape with a passion for innovation.',
  shortAbout:
    'With DigiSwarm, you can attract, impress, and convert more leads online and get results.',
  email: 'hr@digiswarm.in',
  phone: '+91 9548014460',
  whatsapp: '919548014460',
  address:
    '2nd floor, House No. 88, Govind Nagar, East Rest Camp, Guru Nanak Vihar, Race Course, Dehradun, Uttarakhand 248001',
};
