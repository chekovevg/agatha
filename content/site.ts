import type {SiteContent} from "@/content/types";

const nav = [
  {label: "About me", href: "/about"},
  {label: "Classes", href: "/classes"},
  {label: "Media", href: "/media"},
];

const baseContent: SiteContent = {
  brand: "Agatha Music",
  nav,
  cta: {
    primary: "Book a Call",
    header: "Book a Call",
    secondary: "Explore Classes",
    contact: "Book a Call",
  },
  social: {
    email: "agathagurko@gmail.com",
    telegram: "https://t.me/youngbabypeach",
    whatsapp: "https://wa.me/491636276938",
  },
  seo: {
    title: "Agatha Music - Flute & Music Theory Lessons",
    description:
      "Online flute, recorder and music theory lessons for children, adults and aspiring musicians. Lessons in Russian, English and German.",
    ogTitle: "Agatha Music - Germany-based, Moscow-trained flutist",
    ogDescription:
      "Clear, thoughtful flute, recorder and music theory lessons with Agatha Gurko.",
  },
  pages: {
    classes: {
      heading: "Discover and choose what you want to learn",
    },
    about: {
      trustHeading: "What students can count on",
      faqHeading: "Questions before the first lesson",
    },
    media: {
      eyebrow: "Media",
      heading: "How I teach",
      galleryHeading: "Music in progress",
    },
  },
  home: {
    heroTitle: "Flute & Music Teacher",
    heroSubtitle: "For Adults and Children",
    audienceTabs: {
      adults: {
        label: "For Adults",
        description:
          "Start from your first note, return after a break, or strengthen the playing you already have.",
      },
      children: {
        label: "For Children",
        description:
          "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
      },
    },
    location: {
      heading: "From the Rhine, online",
      body:
        "Agatha is based in the Cologne–Düsseldorf area and teaches students online in English, Russian and German.",
      cta: "Get in Touch",
    },
    footerNote: "Flute, recorder and music theory lessons online.",
  },
  trust: [
    {
      title: "Moscow-trained flutist",
      text: "Academic musical education with a focus on flute performance.",
    },
    {
      title: "Teaching since 2014",
      text: "Music schools, private lessons and online teaching experience.",
    },
    {
      title: "Lessons in 3 languages",
      text: "Russian, English and German.",
    },
    {
      title: "For different levels",
      text: "Children, adult beginners and aspiring musicians.",
    },
  ],
  lessons: [
    {
      slug: "flute",
      title: "Flute",
      image: "/images/classes/flute.webp",
      description:
        "Build a clear tone, healthy breathing and relaxed posture from the very beginning. We work with sound, technique, hands, embouchure and musical expression step by step.",
    },
    {
      slug: "recorder",
      title: "Recorder",
      image: "/images/classes/recorder.webp",
      description:
        "Recorder lessons for beginners and continuing students, with attention to beautiful sound, confident playing and the joy of making music.",
    },
    {
      slug: "piccolo",
      title: "Piccolo",
      image: "/images/classes/piccolo.webp",
      description:
        "Support for flutists moving to piccolo: specific technique, repertoire, sound control and a smoother transition from flute.",
    },
    {
      slug: "music-theory",
      title: "Music Theory",
      image: "/images/classes/music-theory.webp",
      description:
        "Understand intervals, keys, harmony, form and musical structure through clear explanations and practical examples.",
    },
    {
      slug: "solfege",
      title: "Solfege",
      image: "/images/classes/solfege.webp",
      description:
        "Train your ear, recognise intervals and chords, sing and write melodic lines, and connect theory with real musical listening.",
    },
  ],
  about: {
    heading: "Agatha Gurko",
    paragraphs: [
      "Moscow-trained flutist and music teacher, currently continuing pedagogical studies at Hochschule für Musik und Tanz Köln.",
      "She has been teaching since 2014 - in music schools, private lessons and online classes - working with children, adult beginners and students who want to understand music more deeply.",
      "Her lessons combine a strong musical foundation with a calm, attentive teaching style: clear technique, healthy breathing, ear training, theory and music that feels meaningful to the student.",
    ],
    facts: [
      {
        label: "Education",
        values: [
          "Academic College of the Moscow Tchaikovsky Conservatory - Flute",
          "Hochschule für Musik und Tanz Köln - Instrumental-/Gesangspädagogik",
        ],
      },
      {
        label: "Experience",
        values: [
          "Teaching since 2014",
          "Music schools and private online lessons",
          "Students aged 6-60",
        ],
      },
      {label: "Languages", values: ["Russian · English · German"]},
    ],
  },
  method: {
    heading: "High standards, human pace",
    intro:
      "Learning music can be serious without feeling stressful. Agatha's lessons are structured, attentive and practical - with clear goals, healthy technique and enough space for the student's own musical taste.",
    principles: [
      {
        title: "Breathing comes first",
        text: "We build sound from breathing: calm, supported and connected to the body.",
      },
      {
        title: "A relaxed playing posture",
        text: "Healthy posture helps students play with freedom, confidence and less tension.",
      },
      {
        title: "Clear technique",
        text: "Every technical detail has a purpose: better sound, easier playing and more musical control.",
      },
      {
        title: "Ear before theory",
        text: "Theory becomes easier when students can hear what they are learning.",
      },
      {
        title: "Small, realistic goals",
        text: "Each lesson has a clear focus, so progress feels visible and manageable.",
      },
      {
        title: "Music you actually enjoy",
        text: "Technique and theory are learned through music that feels motivating to play.",
      },
      {
        title: "Practice notes after class",
        text: "After each lesson, students receive brief notes and materials they can use right away.",
      },
    ],
  },
  openLesson: {
    heading: "How I teach",
    copy: "See how a lesson feels before you book.",
    caption: "Lesson preview with Agatha",
    videoUrl: "https://www.youtube-nocookie.com/embed/9_d_45Zp7gs",
  },
  media: [
    {
      title: "Open lesson",
      type: "video",
      thumbnail: "/images/open-lesson.svg",
      caption: "A short look at Agatha's teaching style.",
    },
    {
      title: "Flute practice",
      type: "photo",
      thumbnail: "/images/flute-practice.svg",
      caption: "Sound, breathing and technique in progress.",
    },
    {
      title: "Student materials",
      type: "photo",
      thumbnail: "/images/student-materials.svg",
      caption: "Notes, exercises and practice plans after lessons.",
    },
    {
      title: "Theory made clear",
      type: "photo",
      thumbnail: "/images/theory-clear.svg",
      caption: "Harmony, intervals and musical structure explained visually.",
    },
  ],
  reviews: {
    heading: "Students notice the clarity",
    intro:
      "Students often highlight Agatha's patience, clear explanations, flexible approach and practical examples. Lessons are adapted to the student's level and supported step by step.",
    items: [
      {
        title: "Clear explanations",
        text: "Complex theory becomes easier through practical examples from classical music, pop music and the pieces students already know.",
        sourceLabel: "Student summary",
      },
      {
        title: "Patient support",
        text: "Students feel supported at their own level, without pressure or confusion.",
        sourceLabel: "Student summary",
      },
      {
        title: "Flexible lessons",
        text: "Lessons adapt to the student's needs, goals and learning style.",
        sourceLabel: "Student summary",
      },
      {
        title: "Step-by-step progress",
        text: "Every class gives students a clear next step and materials for practice.",
        sourceLabel: "Student summary",
      },
    ],
  },
  booking: {
    heading: "Book an intro call",
    copy:
      "A 15-minute intro call is the easiest way to discuss your level, goals and the kind of music you want to play before scheduling a full lesson.",
    steps: [
      {title: "Choose a time", text: "Pick a slot that works for you."},
      {
        title: "Share your goal",
        text: "Tell Agatha your level, instrument and what you want to learn.",
      },
      {
        title: "Meet online",
        text: "Join the call in Russian, English or German.",
      },
      {
        title: "Choose the next step",
        text: "Decide whether a 50-minute music lesson is right for you.",
      },
    ],
    lesson: {
      heading: "Book a music lesson",
      copy:
        "Choose a 50-minute online lesson tailored to your level, goals and the music you want to learn.",
      steps: [
        {title: "Choose a time", text: "Pick a slot that works for you."},
        {
          title: "Share your focus",
          text: "Tell Agatha about your level and what you want to work on.",
        },
        {
          title: "Meet online",
          text: "Join the lesson in Russian, English or German.",
        },
        {
          title: "Keep progressing",
          text: "Leave with clear notes and a practical next step.",
        },
      ],
    },
    eventTypes: [
      {
        mode: "intro",
        title: "Intro Call",
        duration: "15 min",
        description: "A short first conversation about goals and lesson format.",
      },
      {
        mode: "lesson",
        title: "Music Lesson",
        duration: "50 min",
        description:
          "Online lessons in flute, recorder, piccolo, music theory or solfege.",
      },
    ],
    fallbackContactCta: "Ask a Question Before Booking",
  },
  faq: [
    {
      question: "Do you teach complete beginners?",
      answer:
        "Yes. Lessons can start from the very first notes, basic rhythm, reading music and healthy playing habits.",
      category: "lessons",
      order: 1,
    },
    {
      question: "Can you help with music theory exams?",
      answer:
        "Yes. Lessons can focus on harmony, intervals, keys, form, ear training, solfege and exam preparation.",
      category: "theory",
      order: 2,
    },
    {
      question: "What happens after a lesson?",
      answer:
        "Students receive brief notes and practice materials to continue working independently.",
      category: "format",
      order: 3,
    },
  ],
  contact: {
    heading: "Have a question",
  },
  legal: {
    impressumTitle: "Impressum",
    privacyTitle: "Datenschutzerklaerung",
  },
};

export const siteContent: SiteContent = baseContent;
