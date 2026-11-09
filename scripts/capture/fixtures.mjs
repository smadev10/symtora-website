// Demo data served in place of the Symtora API while capturing screens.
// Content mirrors the app's own demo cases (src/frontend/src/data/cases.ts).

const day = 86_400_000;
const iso = (daysAgo, hour = 10) => {
  const d = new Date(Date.now() - daysAgo * day);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

const CASES = {
  en: {
    headache: {
      text: 'Since noon I have a strong headache, mostly behind my forehead. The light in the classroom hurts and my neck is stiff. No fever.',
      urgency: 'low',
      causes: [
        ['Tension headache', 'high', 'Matches neck stiffness and long screen time.'],
        ['Migraine', 'mid', 'Light sensitivity supports this, but no nausea.'],
        ['Dehydration', 'mid', 'Common with afternoon headaches.'],
      ],
      steps: ['Drink water, rest for 30 minutes.', 'Reduce screen time today.', 'Seek medical help if fever, vision changes, or vomiting occur.'],
    },
    knee: {
      text: 'After football training my right knee hurts when I climb stairs. It is slightly swollen on the outside.',
      urgency: 'mid',
      causes: [
        ['Overuse', 'high', 'Matches intense training and pain under load.'],
        ['Ligament strain', 'mid', 'Outer swelling may indicate strain.'],
        ['Bruise', 'low', 'No fall or impact reported.'],
      ],
      steps: ['Cool and elevate the knee.', 'Reduce load for 2–3 days.', 'Seek medical help if swelling persists.'],
    },
    stomach: {
      text: 'Cramping stomach ache since this morning, a bit nauseous. I have an exam tomorrow.',
      urgency: 'mid',
      causes: [
        ['Stress-related', 'high', 'Timing with the exam supports this.'],
        ['Indigestion', 'mid', 'Cramp-like pain without fever.'],
        ['Stomach bug', 'low', 'No fever or diarrhea reported.'],
      ],
      steps: ['Breathe calmly, light meal.', 'Stay well hydrated.', 'Seek medical help if fever or severe pain.'],
    },
    throat: {
      text: 'Sore throat and a cough for two days, my voice is hoarse. Swallowing hurts a bit.',
      urgency: 'low',
      causes: [
        ['Viral cold', 'high', 'Matches cough and hoarse voice without fever.'],
        ['Dry air irritation', 'mid', 'Can explain swallowing difficulty without infection.'],
        ['Bacterial strep', 'low', 'Less likely without fever.'],
      ],
      steps: ['Drink plenty, rest your voice.', 'Warm drinks or lozenges.', 'Seek medical help if fever or breathing trouble.'],
    },
  },
  de: {
    headache: {
      text: 'Seit heute Mittag habe ich starke Kopfschmerzen, vor allem hinter der Stirn. Das Licht im Klassenzimmer tut weh und mein Nacken ist steif. Fieber habe ich keines.',
      urgency: 'low',
      causes: [
        ['Spannungskopfschmerz', 'high', 'Passt zu Nackensteifigkeit und langer Bildschirmzeit.'],
        ['Migräne', 'mid', 'Lichtempfindlichkeit spricht dafür, Übelkeit fehlt.'],
        ['Flüssigkeitsmangel', 'mid', 'Häufig bei Kopfschmerz am Nachmittag.'],
      ],
      steps: ['Wasser trinken, 30 Minuten ruhen.', 'Bildschirmzeit heute reduzieren.', 'Bei Fieber, Sehstörung oder Erbrechen ärztliche Hilfe suchen.'],
    },
    knee: {
      text: 'Nach dem Fussballtraining schmerzt mein rechtes Knie beim Treppensteigen. Aussen ist es leicht geschwollen.',
      urgency: 'mid',
      causes: [
        ['Überlastung', 'high', 'Passt zu intensivem Training und Schmerz bei Belastung.'],
        ['Bänderreizung', 'mid', 'Schwellung aussen kann auf Reizung hindeuten.'],
        ['Prellung', 'low', 'Kein Sturz oder Schlag berichtet.'],
      ],
      steps: ['Knie kühlen und hochlagern.', 'Belastung für 2–3 Tage reduzieren.', 'Bei anhaltender Schwellung ärztliche Hilfe suchen.'],
    },
    stomach: {
      text: 'Krampfartige Bauchschmerzen seit heute Morgen, mir ist etwas übel. Morgen habe ich eine Prüfung.',
      urgency: 'mid',
      causes: [
        ['Stressbedingt', 'high', 'Zeitlicher Zusammenhang mit der Prüfung spricht dafür.'],
        ['Verdauungsstörung', 'mid', 'Krampfartiger Schmerz ohne Fieber.'],
        ['Magen-Darm-Infekt', 'low', 'Kein Fieber oder Durchfall berichtet.'],
      ],
      steps: ['Ruhig atmen, leichte Mahlzeit.', 'Auf ausreichend Flüssigkeit achten.', 'Bei Fieber oder starken Schmerzen ärztliche Hilfe suchen.'],
    },
    throat: {
      text: 'Seit zwei Tagen Halsschmerzen und Husten, meine Stimme ist heiser. Schlucken tut etwas weh.',
      urgency: 'low',
      causes: [
        ['Virale Erkältung', 'high', 'Passt zu Husten und belegter Stimme ohne Fieber.'],
        ['Reizung/trockene Luft', 'mid', 'Kann Schluckbeschwerden ohne Infekt erklären.'],
        ['Bakterielle Angina', 'low', 'Ohne Fieber weniger wahrscheinlich.'],
      ],
      steps: ['Viel trinken, Stimme schonen.', 'Warme Getränke oder Lutschtabletten.', 'Bei Fieber oder Atemnot ärztliche Hilfe suchen.'],
    },
  },
};

const assessment = (c, daysAgo) => ({
  urgency: c.urgency,
  causes: c.causes.map(([label, tier, reason]) => ({ label, tier, reason })),
  nextSteps: c.steps,
  generatedAt: iso(daysAgo),
});

// [case, region, daysAgo, hour] — spread over the last 30 days for the home charts.
const HISTORY = [
  ['headache', 'head', 0, 13],
  ['knee', 'knee', 1, 18],
  ['stomach', 'stomach', 2, 8],
  ['throat', 'throat', 4, 9],
  ['headache', 'head', 5, 15],
  ['headache', 'head', 7, 16],
  ['knee', 'knee', 9, 19],
  ['stomach', 'stomach', 11, 7],
  ['headache', 'head', 13, 14],
  ['throat', 'throat', 18, 10],
  ['headache', 'head', 22, 12],
];

export function entriesFor(lang) {
  return HISTORY.map(([key, region, daysAgo, hour], i) => {
    const c = CASES[lang][key];
    return {
      id: `demo-${i + 1}`,
      rawText: c.text,
      bodyRegion: region,
      status: 'Done',
      createdAt: iso(daysAgo, hour),
      assessment: assessment(c, daysAgo),
    };
  });
}

export const caseText = (lang, key) => CASES[lang][key].text;
