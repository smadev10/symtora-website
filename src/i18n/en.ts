export const en = {
  meta: {
    title: 'Symtora — Understand your symptoms',
    description:
      'Describe what’s wrong by text or voice. Symtora sorts your input, rates the urgency and shows possible causes and next steps.',
  },
  nav: { features: 'Features', emergency: 'Emergency', screens: 'Screens', github: 'GitHub' },
  a11y: {
    theme: 'Toggle light and dark mode',
    lang: 'Language',
    skip: 'Skip to content',
    video: 'Screen recording of the Symtora app',
  },
  hero: {
    kicker: 'Symptom check · Prototype',
    title: 'Understand your symptoms.',
    lead: 'Type or speak what’s wrong. Get an urgency level, possible causes and concrete next steps.',
    cta: 'See it in action',
    secondary: 'Source on GitHub',
    badges: ['English · Deutsch · Français', 'Light & dark', 'Self-hosted AI'],
  },
  promises: {
    kicker: 'Three promises',
    items: [
      { title: 'Private by design', body: 'Analysed on our own self-hosted server — no third-party AI cloud.' },
      { title: 'No diagnosis', body: 'Guidance and urgency, never a replacement for a medical exam.' },
      { title: 'Deletable anytime', body: 'Export everything as JSON or wipe it with one tap.' },
    ],
  },
  features: [
    {
      id: 'describe',
      kicker: 'Describe',
      title: 'Say it in your own words.',
      body: 'Free text with quick chips for common complaints.',
      media: ['new'],
    },
    {
      id: 'speak',
      kicker: 'Speak',
      title: 'Or just talk.',
      body: 'Dictate your symptoms. Speech is turned into text, the audio is never stored.',
      video: 'voice',
    },
    {
      id: 'assess',
      kicker: 'Assessment',
      title: 'Urgency, causes, next steps.',
      body: 'Possible causes ranked as likely, possible or unlikely — each with a short reason.',
      media: ['assessment', 'assessment-causes'],
    },
    {
      id: 'overview',
      kicker: 'Overview',
      title: 'See patterns over time.',
      body: 'A 14-day trend, key numbers and which body regions keep coming back.',
      media: ['home'],
    },
    {
      id: 'data',
      kicker: 'Your data',
      title: 'You stay in control.',
      body: 'Language, appearance, export and deletion — all in one place.',
      media: ['settings', 'profile'],
    },
  ],
  emergency: {
    kicker: 'Emergency',
    title: 'When it’s serious, one tap away.',
    body: 'Swiss emergency numbers and warning signs are always one tab away.',
    numbers: [
      { n: '144', label: 'Ambulance' },
      { n: '112', label: 'European emergency' },
      { n: '145', label: 'Poison centre' },
      { n: '143', label: 'Helpline' },
    ],
  },
  screens: {
    kicker: 'Every screen',
    title: 'Take the tour.',
    items: {
      login: 'Sign in',
      onboarding: 'Onboarding',
      home: 'Home',
      new: 'Describe',
      record: 'Speak',
      analysing: 'Analysing',
      assessment: 'Assessment',
      'assessment-causes': 'Causes & steps',
      emergency: 'Emergency',
      settings: 'Settings',
      profile: 'Profile',
    },
  },
  how: {
    kicker: 'How it works',
    steps: ['Describe or dictate', 'A self-hosted model analyses', 'Get urgency & next steps'],
    stack: 'Built with',
  },
  disclaimer:
    'Symtora is a student prototype, not a medical device and does not provide a diagnosis. In an emergency call 144.',
  footer: {
    project: 'A Swiss capstone project (Vertiefungsarbeit).',
    license: 'Open source · MIT',
  },
};

export type Dict = typeof en;
