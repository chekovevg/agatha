export type SiteContent = {
  brand: string;
  nav: {label: string; href: string}[];
  cta: {
    primary: string;
    header: string;
    secondary: string;
    contact: string;
  };
  social: {
    preply?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  pages: {
    classes: {
      heading: string;
    };
    about: {
      trustHeading: string;
      faqHeading: string;
    };
    media: {
      eyebrow: string;
      heading: string;
      galleryHeading: string;
    };
  };
  audienceLessons: {
    adults: AudienceLessonContent;
    children: AudienceLessonContent;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    manifesto: {
      heading: string;
      body: string;
    };
    location: {
      heading: string;
      body: string;
      cta: string;
    };
    footerNote: string;
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

export type AudienceLessonContent = {
  path:
    | "/online-flute-lessons-for-adults"
    | "/online-flute-lessons-for-children";
  navLabel: "For adults" | "For children";
  eyebrow: string;
  title: string;
  intro: string;
  trustLine: string;
  cardCopy: string;
  audienceHeading: string;
  audienceCopy: string;
  audiencePoints: string[];
  lessonsHeading: string;
  lessonsCopy: string;
  lessonFocus: {title: string; text: string}[];
  whyHeading: string;
  whyParagraphs: string[];
  faq: {question: string; answer: string}[];
  ctaHeading: string;
  ctaCopy: string;
  seo: {title: string; description: string};
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
