export type Locale = "en" | "fr";
const en = {
  skip: "Skip to content",
  navigation: "Main navigation",
  work: "Work",
  about: "About",
  contact: "Contact",
  language: "Language",
  clean: "Clean view",
  interactive: "Interactive view",
  intro: "AN INDEPENDENT PORTFOLIO",
  explore: "Explore the portfolio",
  personal: "A PERSONAL SPACE.",
  making: "A SIGNAL IN THE MAKING.",
  selected: "SELECTED WORK",
  archive: "THE ARCHIVE",
  nextA: "A space for",
  nextB: "what comes next.",
  workPending: "Selected work, forthcoming.",
  workDescription: "Projects and their stories will appear here.",
  forthcoming: "CONTENT FORTHCOMING",
  behind: "THE PERSON BEHIND THE SIGNAL",
  bioPending: "A fuller introduction is on its way.",
  bioStatus: "BIOGRAPHY / CONTENT FORTHCOMING",
  conversation: "OPEN A CONVERSATION",
  connectA: "Every connection",
  connectB: "starts with a signal",
  contactPending: "Contact details forthcoming.",
  footer: "A space taking shape.",
  top: "Back to top",
  study: "FIG. 01 — SIGNAL STUDY",
  staticStudy: "STATIC STUDY",
  move: "MOVE POINTER TO EXPLORE",
  pause: "Pause sculpture animation",
  resume: "Resume sculpture animation",
  pauseShort: "PAUSE",
  resumeShort: "RESUME",
  artwork: "Abstract copper signal sculpture",
  cv: "Curriculum vitae",
  profile: "Profile",
  cvPending: "CV content forthcoming. Only the supplied identity is shown.",
  title: "SIGNAL / OUAGA — Yannick Ulrich Levi OUEDRAOGO",
  description:
    "SIGNAL / OUAGA — the portfolio of Yannick Ulrich Levi OUEDRAOGO. Portfolio content forthcoming.",
};
export const messages = {
  en,
  fr: {
    skip: "Aller au contenu",
    navigation: "Navigation principale",
    work: "Projets",
    about: "À propos",
    contact: "Contact",
    language: "Langue",
    clean: "Vue épurée",
    interactive: "Vue interactive",
    intro: "UN PORTFOLIO INDÉPENDANT",
    explore: "Explorer le portfolio",
    personal: "UN ESPACE PERSONNEL.",
    making: "UN SIGNAL EN DEVENIR.",
    selected: "PROJETS SÉLECTIONNÉS",
    archive: "LES ARCHIVES",
    nextA: "Un espace pour",
    nextB: "la suite.",
    workPending: "Les projets arrivent bientôt.",
    workDescription: "Les projets et leurs histoires seront présentés ici.",
    forthcoming: "CONTENU À VENIR",
    behind: "LA PERSONNE DERRIÈRE LE SIGNAL",
    bioPending: "Une présentation plus complète arrive bientôt.",
    bioStatus: "BIOGRAPHIE / CONTENU À VENIR",
    conversation: "ENGAGER LA CONVERSATION",
    connectA: "Chaque rencontre",
    connectB: "commence par un signal",
    contactPending: "Coordonnées à venir.",
    footer: "Un espace qui prend forme.",
    top: "Retour en haut",
    study: "FIG. 01 — ÉTUDE DU SIGNAL",
    staticStudy: "ÉTUDE STATIQUE",
    move: "DÉPLACEZ LE POINTEUR POUR EXPLORER",
    pause: "Mettre en pause l’animation de la sculpture",
    resume: "Reprendre l’animation de la sculpture",
    pauseShort: "PAUSE",
    resumeShort: "REPRENDRE",
    artwork: "Sculpture abstraite cuivrée évoquant un signal",
    cv: "Curriculum vitæ",
    profile: "Profil",
    cvPending: "Contenu du CV à venir. Seule l’identité fournie est présentée.",
    title: "SIGNAL / OUAGA — Yannick Ulrich Levi OUEDRAOGO",
    description:
      "SIGNAL / OUAGA — le portfolio de Yannick Ulrich Levi OUEDRAOGO. Contenu du portfolio à venir.",
  } satisfies Record<keyof typeof en, string>,
};
export type Copy = typeof en;
export function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences remain usable in memory when storage is disabled. */
  }
}
