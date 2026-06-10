export type SiteContent = {
  brand: string;
  nav: {label: string; href: string}[];
  cta: {
    primary: string;
    secondary: string;
    contact: string;
  };
  social: {
    preply?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    support: string;
    trust: string;
  };
  trust: {title: string; text: string}[];
  lessons: Lesson[];
  about: {
    heading: string;
    paragraphs: string[];
    facts: {label: string; values: string[]}[];
  };
  method: {
    heading: string;
    intro: string;
    principles: {title: string; text: string}[];
  };
  openLesson: {
    heading: string;
    copy: string;
    caption: string;
    videoUrl?: string;
  };
  media: MediaItem[];
  reviews: {
    heading: string;
    intro: string;
    items: ReviewSummary[];
  };
  booking: BookingContent;
  faq: FAQItem[];
  contact: {
    heading: string;
    copy: string;
  };
  legal: {
    impressumTitle: string;
    privacyTitle: string;
  };
};

export type Lesson = {
  title: string;
  description: string;
  ctaLabel: string;
  slug: string;
};

export type ReviewSummary = {
  title: string;
  text: string;
  sourceLabel: string;
  url?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
  category: string;
  order: number;
};

export type MediaItem = {
  title: string;
  type: "photo" | "video" | "audio";
  thumbnail: string;
  videoUrl?: string;
  externalUrl?: string;
  caption: string;
};

export type BookingContent = {
  heading: string;
  copy: string;
  steps: {title: string; text: string}[];
  eventTypes: {title: string; duration: string; description: string}[];
  fallbackContactCta: string;
};
