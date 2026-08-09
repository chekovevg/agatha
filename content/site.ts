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
  audienceLessons: {
    adults: {
      path: "/online-flute-lessons-for-adults",
      navLabel: "For adults",
      eyebrow: "Private online flute lessons",
      title: "Private Online Flute Lessons for Adults",
      intro:
        "One-to-one online flute lessons for complete beginners, returning players and continuing adult musicians. Build reliable technique and musical confidence through clear, realistic steps.",
      trustLine:
        "Moscow-trained flutist and music teacher · Teaching since 2014",
      cardCopy:
        "Start from your first note, return after a break, or strengthen the playing you already have.",
      audienceHeading: "A lesson built around your life and level",
      audienceCopy:
        "You do not need to fit a conservatory timetable or arrive with perfect technique. Lessons begin with what you can already do, the music you want to play and the time you can realistically give to practice.",
      audiencePoints: [
        "Complete beginners who want a healthy, clear start",
        "Returning players rebuilding confidence after a break",
        "Continuing flutists refining sound, technique and expression",
      ],
      lessonsHeading: "What happens in lessons",
      lessonsCopy:
        "Each lesson has a practical focus and a next step you can use immediately.",
      lessonFocus: [
        {
          title: "Sound and breathing",
          text: "Develop a supported, flexible tone without unnecessary tension.",
        },
        {
          title: "Relaxed technique",
          text: "Work on posture, embouchure, articulation and finger coordination step by step.",
        },
        {
          title: "Reading and rhythm",
          text: "Make notation, pulse and musical structure easier to understand and use.",
        },
        {
          title: "Repertoire and expression",
          text: "Connect technical work with pieces that are meaningful and motivating to play.",
        },
      ],
      whyHeading: "Why learn with Agatha",
      whyParagraphs: [
        "Agatha Gurko is a Moscow-trained flutist and music teacher who has taught since 2014 in music schools, private lessons and online classes.",
        "Her teaching combines a strong musical foundation with patient explanation, healthy technique and goals shaped around the individual student.",
      ],
      faq: [
        {
          question: "Do I need previous experience?",
          answer:
            "No. Lessons can begin with choosing a comfortable setup, producing the first sound, basic rhythm and reading music.",
        },
        {
          question: "Can I return after a long break?",
          answer:
            "Yes. We review the foundations without assuming that everything should already feel familiar.",
        },
        {
          question: "How much should I practise?",
          answer:
            "The practice plan is adapted to your schedule. Consistent short sessions are often more useful than an unrealistic target.",
        },
        {
          question: "What do I need for an online lesson?",
          answer:
            "A flute, a stable internet connection, a device with a camera and enough space to sit or stand comfortably.",
        },
      ],
      ctaHeading: "Start with an intro call",
      ctaCopy:
        "Use the 15-minute call to discuss your level, goals, repertoire and a realistic way forward.",
      seo: {
        title: "Online Flute Lessons for Adults",
        description:
          "Private online flute lessons for adult beginners, returning players and continuing flutists with Agatha Gurko.",
      },
    },
    children: {
      path: "/online-flute-lessons-for-children",
      navLabel: "For children",
      eyebrow: "Private online flute lessons",
      title: "Private Online Flute Lessons for Children",
      intro:
        "Patient, structured one-to-one flute lessons for children from age six, from first musical steps to more confident playing.",
      trustLine:
        "Experienced with young beginners and continuing students · Teaching since 2014",
      cardCopy:
        "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
      audienceHeading: "Support that fits the child",
      audienceCopy:
        "Lessons adapt to the child's age, experience, attention and musical interests while keeping a clear direction for progress.",
      audiencePoints: [
        "Young beginners learning their first sounds and rhythms",
        "Children developing technique, reading and musical confidence",
        "Students who need patient support alongside their current music studies",
      ],
      lessonsHeading: "What happens in lessons",
      lessonsCopy:
        "Technique, listening and music-making are introduced in manageable steps, with brief notes for practice afterwards.",
      lessonFocus: [
        {
          title: "Healthy foundations",
          text: "Build breathing, posture, hand position and sound without forcing the body.",
        },
        {
          title: "Rhythm and reading",
          text: "Learn notation through playing, listening, singing and simple musical patterns.",
        },
        {
          title: "Age-appropriate repertoire",
          text: "Use pieces and exercises that match the child's level and keep the work meaningful.",
        },
        {
          title: "Practice guidance",
          text: "Leave each lesson with a small, clear focus that can be continued at home.",
        },
      ],
      whyHeading: "Why learn with Agatha",
      whyParagraphs: [
        "Agatha has taught children in music schools, private lessons and online classes as part of her teaching work since 2014.",
        "She combines clear musical standards with patience, adaptability and respect for each child's pace of learning.",
      ],
      faq: [
        {
          question: "What age can a child begin?",
          answer:
            "Lessons are available from age six. The intro call helps determine a comfortable instrument setup and starting point.",
        },
        {
          question: "Does a parent need to stay during the lesson?",
          answer:
            "A parent may help a younger beginner with the camera, music stand and first practice routine. The right level of involvement depends on the child.",
        },
        {
          question: "Can online lessons work for a beginner?",
          answer:
            "Yes, when the camera shows the child's posture and hands clearly and the instrument, music stand and device are prepared before the lesson.",
        },
        {
          question: "What happens between lessons?",
          answer:
            "The student receives brief notes and materials with a manageable focus for practice.",
        },
      ],
      ctaHeading: "Book an intro call for your child",
      ctaCopy:
        "Use the 15-minute call to discuss age, experience, goals, instrument setup and the parent's practical questions.",
      seo: {
        title: "Online Flute Lessons for Children",
        description:
          "Private online flute lessons for children from age six with patient, structured teaching by Agatha Gurko.",
      },
    },
  },
  home: {
    heroTitle: "Flute & Music Teacher",
    heroSubtitle: "For Adults and Children",
    manifesto: {
      heading: "Music becomes possible when it is explained with care.",
      body:
        "Agatha teaches through small steps — helping students build confidence, sound and understanding.",
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
      image: "/images/classes/flute.png",
      description:
        "Build a clear tone, healthy breathing and relaxed posture from the very beginning. We work with sound, technique, hands, embouchure and musical expression step by step.",
    },
    {
      slug: "recorder",
      title: "Recorder",
      image: "/images/classes/recorder.png",
      description:
        "Recorder lessons for beginners and continuing students, with attention to beautiful sound, confident playing and the joy of making music.",
    },
    {
      slug: "piccolo",
      title: "Piccolo",
      image: "/images/classes/piccolo.png",
      description:
        "Support for flutists moving to piccolo: specific technique, repertoire, sound control and a smoother transition from flute.",
    },
    {
      slug: "music-theory",
      title: "Music Theory",
      image: "/images/classes/music-theory.png",
      description:
        "Understand intervals, keys, harmony, form and musical structure through clear explanations and practical examples.",
    },
    {
      slug: "solfege",
      title: "Solfege",
      image: "/images/classes/ear-training.png",
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
        "Agatha teaches flute, recorder and piccolo. She also teaches music theory and solfege.",
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

export const siteContent: SiteContent = baseContent;
