import type {Locale} from "@/lib/routing";
import type {SiteContent} from "@/content/types";

const nav = [
  {label: "Lessons", href: "#lessons"},
  {label: "Method", href: "#method"},
  {label: "About", href: "#about"},
  {label: "Reviews", href: "#reviews"},
  {label: "Media", href: "#media"},
  {label: "FAQ", href: "#faq"},
  {label: "Contact", href: "#contact"},
];

const baseContent: SiteContent = {
  brand: "Agathe G. Musik",
  nav,
  cta: {
    primary: "Book a trial lesson",
    secondary: "Watch an open lesson",
    contact: "Send a message",
  },
  social: {},
  seo: {
    title: "Agathe G. Musik - Flute & Music Theory Lessons",
    description:
      "Online flute, recorder and music theory lessons for children, adults and aspiring musicians. Lessons in Russian, English and German.",
    ogTitle: "Make music feel possible - Agathe G. Musik",
    ogDescription:
      "Clear, thoughtful flute, recorder and music theory lessons with Agathe Gurko.",
  },
  hero: {
    eyebrow: "Flute · Recorder · Music Theory",
    heading: "Make music feel possible.",
    subheading:
      "Flute, recorder and music theory lessons for children, adults and aspiring musicians - in Russian, English or German.",
    support:
      "Clear explanations, healthy technique and music you actually enjoy playing.",
    trust: "Teaching since 2014 · Students aged 6-60 · 400+ online lessons",
  },
  dashboard: {
    eyebrow: "Flute · Recorder · Music Theory",
    heading: "Music lessons with calm structure and clear next steps.",
    subheading:
      "For children, adult beginners and aspiring musicians who want attentive online lessons in Russian, English or German.",
    trustLine:
      "Teaching since 2014 · Students aged 6-60 · Music schools, private lessons and online classes.",
    fitHeading: "Suitable for",
    fitItems: [
      "Children and teenagers who need patient structure",
      "Adult beginners who want to start without shame or pressure",
      "Flute, recorder, piccolo and music theory students",
      "Students who want explanations in Russian, English or German",
    ],
    styleHeading: "Lesson style",
    styleIntro:
      "Calm, structured and practical lessons with healthy technique, clear explanations and notes after class.",
    styleTags: [
      "Calm",
      "Structured",
      "Attentive",
      "Practical",
      "Healthy technique",
      "Practice notes",
    ],
    trialHeading: "What happens in a trial lesson",
    trialSteps: [
      "Meet and clarify the goal.",
      "Check level, breathing, posture, sound, rhythm or theory needs.",
      "Try a short learning activity.",
      "Leave with notes and a realistic next-step recommendation.",
    ],
    proofHeading: "Why students trust Agathe",
    proofItems: [
      "Academic flute background",
      "Teaching experience since 2014",
      "Clear explanations and patient support",
      "Experience with children, adults and online lessons",
    ],
    practical: [
      {label: "Languages", value: "Russian · English · German"},
      {label: "Format", value: "Online lessons"},
      {label: "First step", value: "Trial lesson via Cal.com"},
      {label: "Focus", value: "Flute · Recorder · Theory"},
    ],
    fullProfileCta: "Read the full profile",
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
      description:
        "Build a clear tone, healthy breathing and relaxed posture from the very beginning. We work with sound, technique, hands, embouchure and musical expression step by step.",
      ctaLabel: "Learn flute with Agathe",
    },
    {
      slug: "recorder",
      title: "Recorder",
      description:
        "Recorder lessons for beginners and continuing students, with attention to beautiful sound, confident playing and the joy of making music.",
      ctaLabel: "Start recorder lessons",
    },
    {
      slug: "music-theory",
      title: "Music Theory",
      description:
        "Understand intervals, keys, harmony, form and musical structure through clear explanations and practical examples.",
      ctaLabel: "Learn music theory",
    },
    {
      slug: "ear-training",
      title: "Ear Training & Solfege",
      description:
        "Train your ear, recognise intervals and chords, sing and write melodic lines, and connect theory with real musical listening.",
      ctaLabel: "Train your ear",
    },
    {
      slug: "music-history",
      title: "Music History",
      description:
        "Explore composers, styles and musical eras in context - useful for exams, deeper listening and a richer understanding of music.",
      ctaLabel: "Study music history",
    },
    {
      slug: "piccolo",
      title: "Piccolo",
      description:
        "Support for flutists moving to piccolo: specific technique, repertoire, sound control and a smoother transition from flute.",
      ctaLabel: "Learn piccolo",
    },
  ],
  about: {
    heading: "Meet Agathe",
    paragraphs: [
      "Agathe Gurko is a Moscow-trained flutist and music teacher, currently continuing her pedagogical studies at Hochschule fuer Musik und Tanz Koeln.",
      "She has been teaching since 2014 - in music schools, private lessons and online classes - working with children, adult beginners and students who want to understand music more deeply.",
      "Her lessons combine a strong musical foundation with a calm, attentive teaching style: clear technique, healthy breathing, ear training, theory and music that feels meaningful to the student.",
    ],
    facts: [
      {
        label: "Education",
        values: [
          "Academic College of the Moscow Tchaikovsky Conservatory - Flute",
          "Hochschule fuer Musik und Tanz Koeln - Instrumental-/Gesangspaedagogik",
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
      "Learning music can be serious without feeling stressful. Agathe's lessons are structured, attentive and practical - with clear goals, healthy technique and enough space for the student's own musical taste.",
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
    heading: "Watch an open lesson",
    copy:
      "See how a lesson feels before you book. In this short video, Agathe explains musical ideas step by step - with clarity, patience and practical examples.",
    caption: "First steps in flute sound",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  },
  media: [
    {
      title: "Open lesson",
      type: "video",
      thumbnail: "/images/open-lesson.svg",
      caption: "A short look at Agathe's teaching style.",
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
      "Students often highlight Agathe's patience, clear explanations, flexible approach and practical examples. Lessons are adapted to the student's level and supported step by step.",
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
    heading: "Book a trial lesson",
    copy:
      "A trial lesson is the easiest way to understand your level, goals and the kind of music you want to play. After the lesson, you'll receive short notes and a clear suggestion for the next steps.",
    steps: [
      {title: "Choose a time", text: "Pick a slot that works for you."},
      {
        title: "Share your goal",
        text: "Tell Agathe your level, instrument and what you want to learn.",
      },
      {
        title: "Meet online",
        text: "Join the lesson in Russian, English or German.",
      },
      {
        title: "Get a practice plan",
        text: "Receive short notes and materials after the class.",
      },
    ],
    eventTypes: [
      {
        title: "Trial Lesson",
        duration: "30 min",
        description: "A first meeting to understand goals and fit.",
      },
      {
        title: "Regular Lesson",
        duration: "50 min",
        description: "Ongoing flute, recorder or theory lessons.",
      },
      {
        title: "Music Theory Consultation",
        duration: "30 min",
        description: "Focused support for theory, solfege or exams.",
      },
      {
        title: "Parent Intro Call",
        duration: "15 min",
        description: "A short conversation before booking a child lesson.",
      },
    ],
    fallbackContactCta: "Ask a question before booking",
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
      question: "Do you work with adults?",
      answer:
        "Yes. Adult beginners and returning musicians are welcome. Lessons move at a comfortable pace and focus on clear progress.",
      category: "lessons",
      order: 2,
    },
    {
      question: "What languages are available?",
      answer: "Lessons are available in Russian, English and German.",
      category: "format",
      order: 3,
    },
    {
      question: "What instruments do you teach?",
      answer:
        "Agathe teaches flute, recorder and piccolo. She also teaches music theory, solfege, ear training and music history.",
      category: "lessons",
      order: 4,
    },
    {
      question: "Can you help with music theory exams?",
      answer:
        "Yes. Lessons can focus on harmony, intervals, keys, form, ear training, solfege and exam preparation.",
      category: "theory",
      order: 5,
    },
    {
      question: "What happens after a lesson?",
      answer:
        "Students receive brief notes and practice materials to continue working independently.",
      category: "format",
      order: 6,
    },
  ],
  contact: {
    heading: "Get in touch",
    copy:
      "Have a question before booking? Send a message and Agathe will help you choose the right format.",
  },
  legal: {
    impressumTitle: "Impressum",
    privacyTitle: "Datenschutzerklaerung",
  },
};

// Draft localized content. English is the source of truth for v1; DE/RU can be
// replaced by final human-approved translations without changing components.
export const siteContent: Record<Locale, SiteContent> = {
  en: baseContent,
  de: {
    ...baseContent,
    nav: baseContent.nav.map((item) => ({
      ...item,
      label:
        {
          Lessons: "Unterricht",
          Method: "Methode",
          About: "Ueber Agathe",
          Reviews: "Stimmen",
          Media: "Medien",
          FAQ: "FAQ",
          Contact: "Kontakt",
        }[item.label] ?? item.label,
    })),
    cta: {
      primary: "Probestunde buchen",
      secondary: "Offene Stunde ansehen",
      contact: "Nachricht senden",
    },
    hero: {
      ...baseContent.hero,
      eyebrow: "Floete · Blockfloete · Musiktheorie",
      heading: "Musik soll moeglich fuehlen.",
      subheading:
        "Floeten-, Blockfloeten- und Musiktheorieunterricht fuer Kinder, Erwachsene und angehende Musiker - auf Russisch, Englisch oder Deutsch.",
      support:
        "Klare Erklaerungen, gesunde Technik und Musik, die du wirklich gern spielst.",
      trust: "Unterricht seit 2014 · Schueler von 6-60 · 400+ Online-Stunden",
    },
    dashboard: {
      ...baseContent.dashboard,
      eyebrow: "Floete · Blockfloete · Musiktheorie",
      heading:
        "Musikunterricht mit ruhiger Struktur und klaren naechsten Schritten.",
      subheading:
        "Fuer Kinder, erwachsene Anfaenger und angehende Musiker, die aufmerksamen Online-Unterricht auf Russisch, Englisch oder Deutsch suchen.",
      trustLine:
        "Unterricht seit 2014 · Schueler von 6-60 · Musikschulen, Privatunterricht und Online-Stunden.",
      fitHeading: "Geeignet fuer",
      fitItems: [
        "Kinder und Jugendliche, die geduldige Struktur brauchen",
        "Erwachsene Anfaenger, die ohne Druck anfangen moechten",
        "Floete, Blockfloete, Piccolo und Musiktheorie",
        "Schueler, die Erklaerungen auf Russisch, Englisch oder Deutsch moechten",
      ],
      styleHeading: "Unterrichtsstil",
      styleIntro:
        "Ruhig, strukturiert und praktisch mit gesunder Technik, klaren Erklaerungen und Notizen nach der Stunde.",
      styleTags: [
        "Ruhig",
        "Strukturiert",
        "Aufmerksam",
        "Praktisch",
        "Gesunde Technik",
        "Uebenotizen",
      ],
      trialHeading: "Was in der Probestunde passiert",
      trialSteps: [
        "Kennenlernen und Ziel klaeren.",
        "Niveau, Atmung, Haltung, Klang, Rhythmus oder Theoriebedarf pruefen.",
        "Eine kurze Lernaktivitaet ausprobieren.",
        "Mit Notizen und einer realistischen Empfehlung weitergehen.",
      ],
      proofHeading: "Warum Schueler Agathe vertrauen",
      proofItems: [
        "Akademischer Floetenhintergrund",
        "Unterrichtserfahrung seit 2014",
        "Klare Erklaerungen und geduldige Begleitung",
        "Erfahrung mit Kindern, Erwachsenen und Online-Unterricht",
      ],
      practical: [
        {label: "Sprachen", value: "Russisch · Englisch · Deutsch"},
        {label: "Format", value: "Online-Unterricht"},
        {label: "Erster Schritt", value: "Probestunde ueber Cal.com"},
        {label: "Fokus", value: "Floete · Blockfloete · Theorie"},
      ],
      fullProfileCta: "Vollstaendiges Profil lesen",
    },
    legal: {
      impressumTitle: "Impressum",
      privacyTitle: "Datenschutzerklaerung",
    },
  },
  ru: {
    ...baseContent,
    nav: baseContent.nav.map((item) => ({
      ...item,
      label:
        {
          Lessons: "Уроки",
          Method: "Метод",
          About: "Об Агате",
          Reviews: "Отзывы",
          Media: "Медиа",
          FAQ: "FAQ",
          Contact: "Контакты",
        }[item.label] ?? item.label,
    })),
    cta: {
      primary: "Записаться на пробный урок",
      secondary: "Посмотреть открытый урок",
      contact: "Написать сообщение",
    },
    hero: {
      ...baseContent.hero,
      eyebrow: "Флейта · Блокфлейта · Теория музыки",
      heading: "Музыка может стать понятной.",
      subheading:
        "Уроки флейты, блокфлейты и теории музыки для детей, взрослых и начинающих музыкантов - на русском, английском или немецком.",
      support:
        "Понятные объяснения, здоровая техника и музыка, которую действительно хочется играть.",
      trust: "Преподает с 2014 · Ученики 6-60 лет · 400+ онлайн-уроков",
    },
    dashboard: {
      ...baseContent.dashboard,
      eyebrow: "Флейта · Блокфлейта · Теория музыки",
      heading:
        "Уроки музыки со спокойной структурой и понятным следующим шагом.",
      subheading:
        "Для детей, взрослых новичков и начинающих музыкантов, которым нужен внимательный онлайн-урок на русском, английском или немецком.",
      trustLine:
        "Преподает с 2014 · ученики 6-60 лет · музыкальные школы, частные уроки и онлайн-занятия.",
      fitHeading: "Подходит для",
      fitItems: [
        "Детей и подростков, которым нужна терпеливая структура",
        "Взрослых новичков, которые хотят начать без стыда и давления",
        "Учеников по флейте, блокфлейте, пикколо и теории музыки",
        "Тех, кому нужны объяснения на русском, английском или немецком",
      ],
      styleHeading: "Стиль урока",
      styleIntro:
        "Спокойно, структурно и практично: здоровая техника, понятные объяснения и заметки после занятия.",
      styleTags: [
        "Спокойно",
        "Структурно",
        "Внимательно",
        "Практично",
        "Здоровая техника",
        "Заметки после урока",
      ],
      trialHeading: "Что будет на пробном уроке",
      trialSteps: [
        "Познакомимся и уточним цель.",
        "Проверим уровень, дыхание, посадку, звук, ритм или вопросы по теории.",
        "Попробуем короткое учебное задание.",
        "Сформулируем заметки и реалистичный следующий шаг.",
      ],
      proofHeading: "Почему ученики доверяют Агате",
      proofItems: [
        "Академическая флейтовая база",
        "Опыт преподавания с 2014 года",
        "Понятные объяснения и терпеливая поддержка",
        "Опыт с детьми, взрослыми и онлайн-уроками",
      ],
      practical: [
        {label: "Языки", value: "Русский · Английский · Немецкий"},
        {label: "Формат", value: "Онлайн-уроки"},
        {label: "Первый шаг", value: "Пробный урок через Cal.com"},
        {label: "Фокус", value: "Флейта · Блокфлейта · Теория"},
      ],
      fullProfileCta: "Открыть полный профиль",
    },
    legal: {
      impressumTitle: "Impressum",
      privacyTitle: "Политика конфиденциальности",
    },
  },
};
