import type {Locale} from "@/lib/routing";
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
    primary: "Book Trial Class",
    secondary: "Explore Classes",
    contact: "Text me",
  },
  social: {},
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
      heading: "Lessons, materials and moments of music in progress",
      galleryHeading: "Music in progress",
    },
  },
  home: {
    heroTitle: ["Your Musical", "Companion"],
    heroSubtitle: "Flute, recorder and music theory lessons",
    manifesto: {
      heading:
        "Music becomes possible when it is explained with care, practised with patience, and heard with attention.",
      body:
        "I teach flute, recorder and music theory through small realistic steps - helping students build confidence, sound and musical understanding.",
    },
    values: {
      heading: "My Values",
      items: ["Kindness", "Care", "Patience", "Adaptability", "Structure", "Joy"],
      activeItem: "Kindness",
      activeText:
        "Learning music can feel vulnerable, especially at the beginning. I want my lessons to be a kind space where students can ask questions, make mistakes and try again without fear of being judged.",
      itemTexts: [
        "Learning music can feel vulnerable, especially at the beginning. I want my lessons to be a kind space where students can ask questions, make mistakes and try again without fear of being judged.",
        "I pay attention not only to the notes, but to the person learning them. Every student has their own pace, confidence, sound and questions - and I shape the lesson around what they need to move forward.",
        "Music takes time, repetition and trust. I never want students to feel rushed through something difficult. We break things down into small steps until they begin to feel clear, natural and possible.",
        "Every student learns differently. Some lessons need to be playful, some technical, some structured, some more exploratory. I adapt my teaching to the student's age, level, goals and musical taste - while keeping a clear direction.",
        "I believe structure makes progress feel less overwhelming. In each lesson, I try to give students a clear focus, practical exercises and a next step they can continue with after class.",
        "Music should feel alive. I connect technique and theory with real pieces, sounds and ideas that the student actually wants to understand and play - because learning becomes deeper when it feels personal.",
      ],
    },
    location: {
      heading: "From the Rhine, online",
      body:
        "Agatha is based in the Cologne-Duesseldorf area and teaches students online in Russian, English and German. Wherever the lesson begins, the focus stays the same: clear guidance, healthy technique and music that feels personal.",
      cta: "Get in touch",
    },
    quote: {
      body:
        "I believe music becomes easier when you feel safe enough to try. In my lessons, I guide students with patience, clear structure and small, realistic steps - so sound, rhythm and theory start becoming part of your own musical voice.",
      signature: "Agatha Gurko",
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
      description:
        "Build a clear tone, healthy breathing and relaxed posture from the very beginning. We work with sound, technique, hands, embouchure and musical expression step by step.",
      ctaLabel: "Learn flute with Agatha",
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
    heading: "Agatha Gurko",
    paragraphs: [
      "Moscow-trained flutist and music teacher, currently continuing pedagogical studies at Hochschule fuer Musik und Tanz Koeln.",
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
    heading: "Watch an open lesson",
    copy:
      "See how a lesson feels before you book. In this short video, Agatha explains musical ideas step by step - with clarity, patience and practical examples.",
    caption: "First steps in flute sound",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
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
    heading: "Book a trial lesson",
    copy:
      "A trial lesson is the easiest way to understand your level, goals and the kind of music you want to play. After the lesson, you'll receive short notes and a clear suggestion for the next steps.",
    steps: [
      {title: "Choose a time", text: "Pick a slot that works for you."},
      {
        title: "Share your goal",
        text: "Tell Agatha your level, instrument and what you want to learn.",
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
        "Agatha teaches flute, recorder and piccolo. She also teaches music theory, solfege, ear training and music history.",
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
      "Have a question before booking? Send a message and Agatha will help you choose the right format.",
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
          "About me": "Ueber mich",
          Classes: "Unterricht",
          Media: "Medien",
        }[item.label] ?? item.label,
    })),
    cta: {
      primary: "Probestunde buchen",
      secondary: "Unterricht ansehen",
      contact: "Nachricht senden",
    },
    pages: {
      classes: {
        heading: "Entdecke und waehle, was du lernen moechtest",
      },
      about: {
        trustHeading: "Worauf sich Schueler verlassen koennen",
        faqHeading: "Fragen vor der ersten Stunde",
      },
      media: {
        eyebrow: "Medien",
        heading: "Unterricht, Materialien und musikalische Momente im Prozess",
        galleryHeading: "Musik im Werden",
      },
    },
    home: {
      ...baseContent.home,
      heroTitle: ["Dein musikalischer", "Begleiter"],
      heroSubtitle: "Floeten-, Blockfloeten- und Musiktheorieunterricht",
      manifesto: {
        heading:
          "Musik wird moeglich, wenn sie sorgfaeltig erklaert, geduldig geuebt und aufmerksam gehoert wird.",
        body:
          "Ich unterrichte Floete, Blockfloete und Musiktheorie in kleinen realistischen Schritten - damit Klang, Sicherheit und musikalisches Verstehen wachsen.",
      },
      values: {
        heading: "Meine Werte",
        items: [
          "Freundlichkeit",
          "Sorgfalt",
          "Geduld",
          "Anpassung",
          "Struktur",
          "Freude",
        ],
        activeItem: "Freundlichkeit",
        activeText:
          "Freundlichkeit schafft den Raum, in dem Lernen wirklich passieren kann. In meinen Stunden duerfen Schueler fragen, Fehler machen und es ohne Bewertung noch einmal versuchen.",
        itemTexts: [
          "Musiklernen kann sich verletzlich anfuehlen, besonders am Anfang. Ich moechte, dass mein Unterricht ein freundlicher Raum ist, in dem Schueler Fragen stellen, Fehler machen und es ohne Angst vor Bewertung noch einmal versuchen koennen.",
          "Ich achte nicht nur auf die Noten, sondern auf den Menschen, der sie lernt. Jeder Schueler hat sein eigenes Tempo, seine eigene Sicherheit, seinen Klang und seine Fragen - und ich gestalte die Stunde so, dass der naechste Schritt moeglich wird.",
          "Musik braucht Zeit, Wiederholung und Vertrauen. Ich moechte nie, dass Schueler durch etwas Schwieriges gehetzt werden. Wir teilen Dinge in kleine Schritte, bis sie klar, natuerlich und moeglich werden.",
          "Jeder Schueler lernt anders. Manche Stunden duerfen spielerisch sein, manche technisch, manche strukturiert, manche offener. Ich passe meinen Unterricht an Alter, Niveau, Ziele und Musikgeschmack an - mit einer klaren Richtung.",
          "Ich glaube, Struktur macht Fortschritt weniger ueberwaeltigend. In jeder Stunde versuche ich, einen klaren Fokus, praktische Uebungen und einen naechsten Schritt fuer die Zeit nach dem Unterricht mitzugeben.",
          "Musik soll lebendig sein. Ich verbinde Technik und Theorie mit echten Stuecken, Klaengen und Ideen, die der Schueler wirklich verstehen und spielen moechte - denn Lernen wird tiefer, wenn es persoenlich wird.",
        ],
      },
      location: {
        heading: "Vom Rhein, online",
        body:
          "Agatha lebt in der Region Koeln-Duesseldorf und unterrichtet online auf Russisch, Englisch und Deutsch. Wo auch immer die Stunde beginnt: Im Mittelpunkt stehen klare Begleitung, gesunde Technik und Musik, die persoenlich wird.",
        cta: "Kontakt aufnehmen",
      },
      quote: {
        body:
          "Ich glaube, Musik wird leichter, wenn man sich sicher genug fuehlt, etwas auszuprobieren. In meinen Stunden begleite ich mit Geduld, klarer Struktur und kleinen realistischen Schritten - damit Klang, Rhythmus und Theorie Teil der eigenen musikalischen Stimme werden.",
        signature: "Agatha Gurko",
      },
      footerNote: "Floeten-, Blockfloeten- und Musiktheorieunterricht online.",
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
          "About me": "Обо мне",
          Classes: "Уроки",
          Media: "Медиа",
        }[item.label] ?? item.label,
    })),
    cta: {
      primary: "Записаться на пробный урок",
      secondary: "Посмотреть уроки",
      contact: "Написать сообщение",
    },
    pages: {
      classes: {
        heading: "Выберите, чему хотите учиться",
      },
      about: {
        trustHeading: "На что могут рассчитывать ученики",
        faqHeading: "Вопросы перед первым уроком",
      },
      media: {
        eyebrow: "Медиа",
        heading: "Уроки, материалы и моменты музыкального процесса",
        galleryHeading: "Музыка в процессе",
      },
    },
    home: {
      ...baseContent.home,
      heroTitle: ["Музыкальный", "проводник"],
      heroSubtitle: "Уроки флейты, блокфлейты и теории музыки",
      manifesto: {
        heading:
          "Музыка становится возможной, когда ее объясняют бережно, разбирают терпеливо и слушают внимательно.",
        body:
          "Я преподаю флейту, блокфлейту и теорию музыки через маленькие реалистичные шаги - чтобы у ученика росли уверенность, звук и музыкальное понимание.",
      },
      values: {
        heading: "Мои ценности",
        items: ["Доброта", "Забота", "Терпение", "Гибкость", "Структура", "Радость"],
        activeItem: "Доброта",
        activeText:
          "Доброта создает пространство, в котором действительно можно учиться. На моих уроках можно задавать вопросы, ошибаться и пробовать снова без страха оценки.",
        itemTexts: [
          "Учиться музыке бывает уязвимо, особенно в начале. Я хочу, чтобы уроки были добрым пространством, где можно задавать вопросы, ошибаться и пробовать снова без страха осуждения.",
          "Я обращаю внимание не только на ноты, но и на человека, который их учит. У каждого ученика свой темп, уверенность, звук и вопросы - и я строю урок вокруг того, что помогает двигаться дальше.",
          "Музыка требует времени, повторения и доверия. Я не хочу, чтобы ученик чувствовал спешку в сложном месте. Мы делим материал на маленькие шаги, пока он не становится понятным, естественным и возможным.",
          "Каждый ученик учится по-своему. Одним урокам нужна игра, другим техника, структура или больше поиска. Я адаптирую преподавание под возраст, уровень, цели и музыкальный вкус ученика - сохраняя ясное направление.",
          "Я верю, что структура делает прогресс менее перегружающим. На каждом уроке я стараюсь дать ясный фокус, практические упражнения и следующий шаг, с которым можно продолжить после занятия.",
          "Музыка должна быть живой. Я связываю технику и теорию с настоящими пьесами, звуками и идеями, которые ученик действительно хочет понять и сыграть, потому что обучение становится глубже, когда оно личное.",
        ],
      },
      location: {
        heading: "С Рейна - онлайн",
        body:
          "Агата живет в районе Кельна и Дюссельдорфа и преподает онлайн на русском, английском и немецком. Где бы ни начинался урок, в центре остаются понятное сопровождение, здоровая техника и музыка, которая становится личной.",
        cta: "Связаться",
      },
      quote: {
        body:
          "Я верю, что музыка становится легче, когда достаточно спокойно пробовать. На уроках я веду учеников терпеливо, структурно и маленькими реалистичными шагами - чтобы звук, ритм и теория становились частью собственного музыкального голоса.",
        signature: "Агата Гурко",
      },
      footerNote: "Онлайн-уроки флейты, блокфлейты и теории музыки.",
    },
    legal: {
      impressumTitle: "Impressum",
      privacyTitle: "Политика конфиденциальности",
    },
  },
};
