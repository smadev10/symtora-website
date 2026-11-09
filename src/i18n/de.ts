import type { Dict } from './en';

export const de: Dict = {
  meta: {
    title: 'Symtora — Beschwerden verstehen',
    description:
      'Beschreibe per Text oder Sprache, was dir fehlt. Symtora ordnet deine Angaben ein, schätzt die Dringlichkeit und zeigt mögliche Ursachen und nächste Schritte.',
  },
  nav: { features: 'Funktionen', emergency: 'Notfall', screens: 'Screens', github: 'GitHub' },
  a11y: {
    theme: 'Hell- und Dunkelmodus umschalten',
    lang: 'Sprache',
    skip: 'Zum Inhalt springen',
    video: 'Bildschirmaufnahme der Symtora-App',
  },
  hero: {
    kicker: 'Symptom-Check · Prototyp',
    title: 'Beschwerden verstehen.',
    lead: 'Tippe oder sprich, was dir fehlt. Du erhältst eine Dringlichkeit, mögliche Ursachen und konkrete nächste Schritte.',
    cta: 'In Aktion ansehen',
    secondary: 'Quellcode auf GitHub',
    badges: ['Deutsch · English · Français', 'Hell & dunkel', 'Selbst gehostete KI'],
  },
  promises: {
    kicker: 'Drei Versprechen',
    items: [
      { title: 'Datenschutz eingebaut', body: 'Analysiert auf unserem eigenen Server — keine fremde KI-Cloud.' },
      { title: 'Keine Diagnose', body: 'Orientierung und Dringlichkeit, nie Ersatz für eine ärztliche Untersuchung.' },
      { title: 'Jederzeit löschbar', body: 'Alles als JSON exportieren oder mit einem Tipp löschen.' },
    ],
  },
  features: [
    {
      id: 'describe',
      kicker: 'Beschreiben',
      title: 'In deinen eigenen Worten.',
      body: 'Freitext mit Schnellauswahl für häufige Beschwerden.',
      media: ['new'],
    },
    {
      id: 'speak',
      kicker: 'Sprechen',
      title: 'Oder einfach erzählen.',
      body: 'Diktiere deine Beschwerden. Die Sprache wird zu Text, die Aufnahme nie gespeichert.',
      video: 'voice',
    },
    {
      id: 'assess',
      kicker: 'Einschätzung',
      title: 'Dringlichkeit, Ursachen, nächste Schritte.',
      body: 'Mögliche Ursachen als wahrscheinlich, möglich oder unwahrscheinlich — jeweils mit kurzer Begründung.',
      media: ['assessment', 'assessment-causes'],
    },
    {
      id: 'overview',
      kicker: 'Übersicht',
      title: 'Muster über die Zeit erkennen.',
      body: '14-Tage-Verlauf, Kennzahlen und welche Körperregionen immer wieder betroffen sind.',
      media: ['home'],
    },
    {
      id: 'data',
      kicker: 'Deine Daten',
      title: 'Du behältst die Kontrolle.',
      body: 'Sprache, Erscheinungsbild, Export und Löschen — alles an einem Ort.',
      media: ['settings', 'profile'],
    },
  ],
  emergency: {
    kicker: 'Notfall',
    title: 'Wenn es ernst ist, nur ein Tipp entfernt.',
    body: 'Schweizer Notrufnummern und Warnzeichen sind immer nur einen Tab entfernt.',
    numbers: [
      { n: '144', label: 'Sanitätsnotruf' },
      { n: '112', label: 'Euronotruf' },
      { n: '145', label: 'Tox Info Suisse' },
      { n: '143', label: 'Die Dargebotene Hand' },
    ],
  },
  screens: {
    kicker: 'Alle Screens',
    title: 'Mach die Tour.',
    items: {
      login: 'Anmelden',
      onboarding: 'Onboarding',
      home: 'Start',
      new: 'Beschreiben',
      record: 'Sprechen',
      analysing: 'Analyse',
      assessment: 'Einschätzung',
      'assessment-causes': 'Ursachen & Schritte',
      emergency: 'Notfall',
      settings: 'Einstellungen',
      profile: 'Profil',
    },
  },
  how: {
    kicker: 'So funktioniert’s',
    steps: ['Beschreiben oder diktieren', 'Ein selbst gehostetes Modell analysiert', 'Dringlichkeit & nächste Schritte'],
    stack: 'Gebaut mit',
  },
  disclaimer:
    'Symtora ist ein studentischer Prototyp, kein Medizinprodukt und stellt keine Diagnose. Im Notfall 144 anrufen.',
  footer: {
    project: 'Ein Schweizer Vertiefungsarbeits-Projekt.',
    license: 'Open Source · MIT',
  },
};
