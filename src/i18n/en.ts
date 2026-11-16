/**
 * English copy — the source of truth for the dictionary shape.
 *
 * Formatting conventions used across both languages:
 *   \n         → forced line break (each line animates on its own)
 *   *text*     → editorial emphasis, rendered in the italic serif
 *   {token}    → runtime value (name, count, year…)
 */
const en = {
  meta: {
    title: "ÉTER — Dental Atelier · Precise, personal dental care",
    description:
      "ÉTER is a dental atelier where contemporary dentistry, careful planning and unhurried, personal care meet. Request an evaluation.",
    ogTitle: "ÉTER — Dental Atelier",
    ogDescription: "Dentistry, drawn with precision. A dental atelier built around careful planning and personal care.",
  },

  a11y: {
    skipToContent: "Skip to content",
    homeLink: "ÉTER Dental Atelier — back to top",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    footerNav: "Footer navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitcher: "Choose language",
    switchTo: "Switch to {language}",
    currentLanguage: "Current language: {language}",
    scrollDown: "Scroll to the next section",
    backToTop: "Back to top",
    newTab: "(opens in a new tab)",
    loading: "Loading ÉTER Dental Atelier",
    imagePending: "Image placeholder: {file}",
    carousel: "Team carousel",
    slide: "dentist",
    slideStatus: "Showing {name}, {index} of {total}",
    previous: "Previous dentist",
    next: "Next dentist",
    showMember: "Show {name}",
    treatmentsList: "Treatments",
    techSteps: "Technology chapters",
  },

  nav: {
    items: {
      about: "About",
      treatments: "Treatments",
      technology: "Technology",
      team: "Our Team",
      faq: "FAQ",
      contact: "Contact",
    },
    cta: "Book an appointment",
    menu: "Menu",
    close: "Close",
    mobileFooter: "By appointment · Mon — Sat",
  },

  preloader: {
    status: "Calibrating",
    caption: "Dental Atelier",
    fig: "Fig. 00 — Construction",
  },

  hero: {
    index: "Dental Atelier",
    location: "São Paulo · Est. 2014",
    schedule: "By appointment\nMonday — Saturday",
    headline: "Dentistry,\ndrawn with *precision.*",
    subheadline:
      "A dental atelier where every treatment begins as a careful drawing — planned for one person, carried out with clinical rigour and an unhurried kind of care.",
    primaryCta: "Book an appointment",
    secondaryCta: "Explore treatments",
    scroll: "Scroll",
    figure: "Fig. 01 — The clinician's view",
    chipTitle: "Evaluation first",
    chipText: "Every plan starts with listening.",
    badge: "ÉTER · DENTAL ATELIER · PRECISION · CARE · ",
    dimension: "1 person · 1 plan",
  },

  about: {
    label: "About the clinic",
    statement:
      "ÉTER was born from a simple conviction: exceptional dentistry is a matter of precision — and precision only matters when it is placed in the service of a person.",
    support:
      "Here, every plan is drawn for one patient, at a pace that leaves room for questions. We combine contemporary clinical practice with the attention of a small, dedicated team.",
    principlesTitle: "What guides us",
    principles: [
      {
        title: "Precision",
        text: "Careful diagnosis, detailed planning and a measured hand at every stage of treatment.",
      },
      {
        title: "Comfort",
        text: "Calm rooms, clear explanations and appointments that are never rushed.",
      },
      {
        title: "Attention",
        text: "One patient at a time. Your history, priorities and questions shape the plan.",
      },
    ],
    quote: "An atelier, *not* an assembly line.",
    teamLink: "Meet the team",
    methodLink: "How we work",
    figureA: "Fig. 02 — Reception",
    figureB: "Fig. 03 — In detail",
  },

  treatments: {
    label: "Our treatments",
    title: "Six disciplines,\n*one* standard of care.",
    intro:
      "From routine visits to complete smile planning, every treatment follows the same method: listen, examine, plan — and only then, treat.",
    hintDesktop: "Hover or select a treatment",
    hintTouch: "Tap a treatment to expand",
    cta: "Request an evaluation",
    note: "Suitability for any treatment is always confirmed during a clinical evaluation.",
    items: {
      general: {
        title: "General Dentistry",
        short: "Check-ups, restorations & diagnosis",
        description:
          "The foundation of a healthy mouth: thorough check-ups, careful restorations and an honest conversation about what your teeth actually need.",
        tags: ["Check-ups", "Restorations", "Diagnosis"],
      },
      cosmetic: {
        title: "Cosmetic Dentistry",
        short: "Shape, colour & proportion",
        description:
          "Aesthetic work that respects your features — refining shape, colour and proportion with a light, natural touch and a conservative approach.",
        tags: ["Smile design", "Veneers", "Contouring"],
      },
      orthodontics: {
        title: "Orthodontics",
        short: "Alignment planned around your bite",
        description:
          "Alignment planned around your bite and your routine, with options that range from fixed appliances to clear aligners, discussed openly.",
        tags: ["Clear aligners", "Braces", "Bite"],
      },
      implants: {
        title: "Dental Implants",
        short: "Replacing teeth, step by step",
        description:
          "Replacing missing teeth through careful assessment and step-by-step planning — from the first examination to the final restoration.",
        tags: ["Assessment", "Planning", "Restoration"],
      },
      whitening: {
        title: "Teeth Whitening",
        short: "Professionally supervised",
        description:
          "Professionally supervised whitening, always preceded by an evaluation to confirm that it is the right choice for your teeth and gums.",
        tags: ["In-office", "At-home", "Supervised"],
      },
      preventive: {
        title: "Preventive Care",
        short: "Keeping small things small",
        description:
          "Regular care that keeps small issues small: professional hygiene, practical guidance and a follow-up rhythm designed around you.",
        tags: ["Hygiene", "Guidance", "Follow-up"],
      },
    },
  },

  technology: {
    label: "Technology & precision",
    title: "Precision you\nrarely see. *Care*\nyou always feel.",
    intro:
      "Technology at ÉTER is a means, never the message. Each tool is chosen to make diagnosis clearer, planning more accurate and treatment more comfortable.",
    note: "The specific resources used in each case are discussed during your evaluation.",
    scrollHint: "Scroll to explore",
    figure: "Fig. 04",
    items: [
      {
        key: "imaging",
        meta: "Diagnosis",
        title: "Imaging & radiography",
        text: "Radiographic and digital imaging, used when clinically indicated, reveal what the eye alone cannot — so every decision starts from evidence.",
      },
      {
        key: "planning",
        meta: "Method",
        title: "Treatment planning",
        text: "Findings are translated into a written, step-by-step plan that you can read, question and approve before anything begins.",
      },
      {
        key: "instruments",
        meta: "Detail",
        title: "Clinical instruments",
        text: "Fine instruments, handled under strict sterilisation routines, allow for delicate and conservative work.",
      },
      {
        key: "equipment",
        meta: "Environment",
        title: "Clinical equipment",
        text: "Contemporary chairs, lighting and magnification, chosen for comfort, visibility and accuracy.",
      },
      {
        key: "procedures",
        meta: "Practice",
        title: "Procedures",
        text: "Conservative whenever possible: we preserve healthy structure and explain each step as it happens.",
      },
    ],
  },

  experience: {
    label: "The patient experience",
    title: "A clear path,\nfrom first visit\nto *lasting care*.",
    intro:
      "Good dentistry should never feel like a mystery. Your journey with us follows four clear stages — each one explained before it begins.",
    stage: "Stage",
    expect: "What to expect",
    steps: [
      {
        title: "Consultation",
        text: "We begin by listening. Your history, concerns and expectations come first, followed by a careful and complete clinical examination.",
        points: ["An unhurried conversation", "Complete clinical examination", "Imaging when indicated"],
      },
      {
        title: "Personalized Planning",
        text: "Findings become a written plan — options, sequence and timing — presented in plain language so you can decide with confidence.",
        points: ["Options clearly explained", "A step-by-step sequence", "Time to ask questions"],
      },
      {
        title: "Treatment",
        text: "Treatment follows the plan we agreed on, in calm sessions where your comfort is monitored and every step is explained.",
        points: ["Comfort-focused sessions", "Progress shared openly", "Adjustments decided together"],
      },
      {
        title: "Ongoing Care",
        text: "Care continues after treatment. Follow-up visits and preventive routines help you look after your oral health over time.",
        points: ["Scheduled follow-ups", "Preventive guidance", "A team that knows your history"],
      },
    ],
  },

  team: {
    label: "Meet our dentists",
    title: "The hands\nbehind *the work*.",
    intro:
      "A small team of dentists with complementary areas of practice, working side by side on every plan.",
    focus: "Areas of focus",
    hint: "Drag, swipe or use the arrows",
    disclaimer:
      "Illustrative profiles for a fictional clinic. Names and details do not refer to real professionals.",
    members: {
      helena: {
        role: "Clinical Director · Restorative dentistry",
        focus: ["Implant planning", "Restorative dentistry"],
        bio: "Helena leads clinical planning at ÉTER, coordinating complex cases across the team with a quiet, methodical approach.",
      },
      rafael: {
        role: "Orthodontics",
        focus: ["Clear aligners", "Bite alignment"],
        bio: "Rafael plans orthodontic treatment around each patient's bite, daily routine and long-term stability.",
      },
      marina: {
        role: "Cosmetic dentistry",
        focus: ["Smile design", "Whitening"],
        bio: "Marina approaches aesthetics with restraint, favouring natural proportions and conservative techniques.",
      },
      thiago: {
        role: "General & preventive care",
        focus: ["Check-ups", "Preventive care"],
        bio: "Thiago looks after the foundations: prevention, diagnosis and a long-term relationship with each patient.",
      },
    },
  },

  philosophy: {
    label: "Our philosophy",
    statement: "More than dentistry.\nA different standard\nof *care.*",
    body: "We believe the best dental care is both exacting and humane — technically rigorous, and never in a hurry. That balance is the standard we hold ourselves to, in every appointment.",
    signature: "— The ÉTER team",
  },

  atelier: {
    label: "The atelier",
    title: "A space designed\nto *slow down*.",
    intro:
      "Natural materials, soft light and quiet rooms. The atelier was designed so that the experience of care begins long before you sit in the chair.",
    captions: {
      reception: "Reception",
      room: "Treatment room",
      equipment: "Equipment",
      architecture: "Architectural detail",
      ambience: "Atmosphere",
    },
    materials: ["Light", "Stone", "Oak", "Linen", "Steel", "Silence"],
  },

  faq: {
    label: "Frequently asked questions",
    title: "Questions,\n*answered*.",
    intro:
      "Everything you may want to know before your first visit. If something isn't here, we will gladly answer it personally.",
    contactTitle: "Still have a question?",
    contactText: "Write to us or leave a message through the form — our team will get back to you.",
    contactCta: "Send us a message",
    items: [
      {
        q: "How do I book an appointment?",
        a: "You can request an appointment through the form on this page, by phone or by email. Our team replies to confirm a date and time that suits you, and lets you know if anything should be brought to the first visit.",
      },
      {
        q: "What happens during the first visit?",
        a: "The first visit is an evaluation. We talk about your history and concerns, carry out a complete clinical examination and, when clinically indicated, request imaging. You leave with a clear picture of your oral health and the possible next steps.",
      },
      {
        q: "Which treatments are available?",
        a: "We offer general dentistry, cosmetic dentistry, orthodontics, dental implants, teeth whitening and preventive care. The most suitable approach for you is always defined after an evaluation — never before.",
      },
      {
        q: "How does the evaluation work?",
        a: "The evaluation combines conversation and examination. We look at your teeth, gums and bite, review any previous exams you bring, and explain what we observe in plain language before suggesting anything.",
      },
      {
        q: "How is my treatment plan created?",
        a: "After the evaluation, the team translates the findings into a written plan with options, sequence and estimated timing. We review it together, answer your questions and only begin once you are comfortable with every step.",
      },
      {
        q: "Can I bring previous exams or records?",
        a: "Yes, and we encourage it. Previous radiographs, reports and treatment records help us understand your history and can avoid unnecessary repetition of exams.",
      },
      {
        q: "How can I contact the clinic?",
        a: "You can reach us by phone or email during opening hours, or through the form on this page at any time. Messages received outside opening hours are answered on the next working day.",
      },
    ],
  },

  booking: {
    label: "Book an appointment",
    title: "Begin with\na *conversation*.",
    intro:
      "Tell us a little about yourself and what you are looking for. We will get back to you to arrange an evaluation at a convenient time.",
    phone: "Phone",
    email: "Email",
    hours: "Opening hours",
    hoursValue: "Mon — Fri · 8am – 7pm\nSaturday · 8am – 1pm",
    demoBadge: "Demonstration form",
    demoNote: "This is a portfolio demonstration: no data is sent, stored or shared.",
    formTitle: "Appointment request",
    fields: {
      name: { label: "Full name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@email.com" },
      phone: { label: "Phone", placeholder: "+55 11 90000-0000" },
      treatment: { label: "Treatment of interest", placeholder: "Select a treatment" },
      message: {
        label: "Message",
        placeholder: "Tell us what you are looking for, or any question you may have.",
      },
    },
    optional: "optional",
    notSure: "Not sure yet — I'd like an evaluation",
    consent: "I agree to be contacted about this request.",
    counter: "{count} / {max}",
    submit: "Request appointment",
    submitting: "Validating…",
    errors: {
      summary: "Please review the highlighted fields.",
      nameRequired: "Please enter your name.",
      nameShort: "Your name should have at least 2 characters.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      phoneRequired: "Please enter a phone number.",
      phoneInvalid: "Please enter a valid phone number (8 to 15 digits).",
      treatmentRequired: "Please choose a treatment, or select “not sure yet”.",
      messageTooLong: "Please keep your message under {max} characters.",
      consentRequired: "Please confirm that we may contact you.",
    },
    success: {
      title: "Request validated.",
      text: "Thank you, {name}. Because this is a portfolio demonstration, your details were not sent and no appointment has been booked. In a live version, the clinic would contact you to confirm a time.",
      reset: "Fill in again",
      sentTitle: "Request sent.",
      sentText: "Thank you, {name}. The clinic has received your request and will contact you to confirm a time.",
    },
    failure: {
      title: "Something went wrong.",
      text: "We couldn't process your request. Please try again, or contact the clinic by phone or email.",
      retry: "Try again",
    },
  },

  footer: {
    headline: "Care,\ndrawn with *precision.*",
    cta: "Book an appointment",
    navigate: "Navigate",
    visit: "Visit",
    contact: "Contact",
    follow: "Follow",
    language: "Language",
    address: "Rua Exemplo, 000 — Jardins\nSão Paulo — SP, Brazil",
    demoNotice:
      "ÉTER is a fictional clinic created as a portfolio concept. Address, phone and email are for demonstration only.",
    rights: "© {year} ÉTER Dental Atelier — Concept project.",
    credit: "Design & development",
    backToTop: "Back to top",
  },

  images: {
    hero: "Dentist wearing magnifying loupes, focused on a procedure under dramatic light",
    aboutReception: "The ÉTER reception, with natural materials and soft daylight",
    aboutDetail: "Close-up detail of the clinic's interior materials",
    treatmentGeneral: "Dentist performing a calm clinical examination",
    treatmentCosmetic: "Close-up of a natural, healthy smile",
    treatmentOrthodontics: "Clear aligner held between gloved fingers",
    treatmentImplants: "Detail of restorative dental work",
    treatmentWhitening: "Soft-lit portrait of a patient smiling",
    treatmentPreventive: "Dental hygiene instruments arranged on a tray",
    techImaging: "Dental radiograph on a backlit surface",
    techPlanning: "Clinician reviewing a treatment plan on screen",
    techInstruments: "Polished dental instruments against a dark background",
    techEquipment: "Dental chair and operating light in a dim room",
    techProcedures: "Gloved hands working with a dental handpiece",
    expConsultation: "Dentist in conversation with a patient",
    expPlanning: "Treatment plan being reviewed together",
    expTreatment: "Treatment session in a calm, softly lit room",
    expCare: "Patient leaving the clinic, relaxed",
    dentist01: "Portrait of Dr. Helena Vasconcelos",
    dentist02: "Portrait of Dr. Rafael Okamoto",
    dentist03: "Portrait of Dr. Marina Albuquerque",
    dentist04: "Portrait of Dr. Thiago Lemos",
    philosophy: "Dentist's hands in a beam of light",
    atelierReception: "Reception area of the atelier",
    atelierRoom: "Treatment room with a single dental chair",
    atelierEquipment: "Close-up of clinical equipment",
    atelierArchitecture: "Architectural detail with light and shadow",
    atelierAmbience: "Quiet waiting lounge with soft light",
    booking: "Dental instrument in a dark, cinematic composition",
  },

  notFound: {
    code: "404",
    title: "This page was not\n*drawn* yet.",
    text: "The address you followed doesn't exist. Let's take you back to the atelier.",
    cta: "Back to home",
  },
};

export default en;

export type Dictionary = typeof en;
