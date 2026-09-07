"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CategoryId, ServeType } from "./types";

export type Lang = "en" | "es";

const LANG_KEY = "mfrg-lang";

/**
 * Every piece of translatable UI chrome. Resource names, descriptions and
 * group labels are DATA (they come from the database) and are intentionally
 * not translated here — per spec, only the interface chrome switches language.
 */
export interface Strings {
  header: {
    subtitle: string;
    navBrowse: string;
    navFamily: string;
    navSuggest: string;
    navAdmin: string;
    signOut: string;
    admin: string;
    langToggleAria: string;
  };
  browse: {
    all: string;
    filterAria: string;
    dividerTitle: string;
    dividerBody: string;
    footerLine1: string;
    footerLine2: string;
    program: string;
    programs: string;
    howToAccess: string;
    registerLearnMore: string;
    nearMe: string;
    nearMeActive: string;
    nearMeDenied: string;
    nearMeUnavailable: string;
    miAway: string;
  };
  cat: Record<CategoryId, string>;
  serve: Record<ServeType, string>;
  family: {
    introMain: string;
    introNoEnroll: string;
    introNoEnrollRest: string;
    introNotSaved: string;
    parentLabel: string;
    parentPlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    zipLabel: string;
    zipPlaceholder: string;
    childrenTitle: string;
    childNameLabel: string;
    childNamePlaceholder: string;
    ageLabel: string;
    agePlaceholder: string;
    disabilityCheck: string;
    lgbtqCheck: string;
    removeChild: string;
    addChild: string;
    needsTitle: string;
    needFood: string;
    needImmigrant: string;
    consentTitle: string;
    consentLead: string;
    consentBody: string;
    consentBold: string;
    optIn: string;
    optInBold: string;
    buildPlan: string;
    checkConsent: string;
  };
  plan: {
    editAnswers: string;
    yourFamilyPlan: string;
    familyPlanOf: string; // `${name}'s Family Plan` / `Plan familiar de ${name}`
    subtitle: string;
    saved: string;
    saving: string;
    saveError: string;
    coworkReady: string;
    coworkBody: string;
    exportButton: string;
    setupSummary: string;
    child: string;
    age: string;
    seeFamilyWide: string;
    familyWideTitle: string;
    printButton: string;
    printedFrom: string;
    printedOn: string;
  };
  partner: {
    proposed: string;
    agreed: string;
    navAbout: string;
    calloutTitle: string;
    calloutBody: string;
    calloutCard: string;
    calloutPass: string;
    footerProposed: string;
    footerAgreed: string;
  };
  about: {
    title: string;
    dataGathered: string;
    lastReviewed: string;
    whatTitle: string;
    whatBody: string;
    whoTitle: string;
    whoBody: string;
    howTitle: string;
    howBody: string;
    suggestTitle: string;
    suggestBody: string;
    suggestLink: string;
    sourcesTitle: string;
    sourcesBody: string;
    libraryTitle: string;
    libraryProposed: string;
    libraryAgreed: string;
    privacyTitle: string;
    privacyBody: string;
    notTitle: string;
    notBody: string;
    contactTitle: string;
    contactBody: string;
  };
  suggest: {
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    descLabel: string;
    descPlaceholder: string;
    howLabel: string;
    howPlaceholder: string;
    urlLabel: string;
    catLabel: string;
    serveLabel: string;
    minAge: string;
    maxAge: string;
    submitterLabel: string;
    submitterPlaceholder: string;
    required: string;
    submit: string;
    submitting: string;
    thanksTitle: string;
    thanksBody: string;
    another: string;
    error: string;
  };
}

const en: Strings = {
  header: {
    subtitle: "Free programs for children & families · Ages 0–18",
    navBrowse: "Browse",
    navFamily: "Family Sign-Up",
    navSuggest: "Suggest a Resource",
    navAdmin: "Admin",
    signOut: "SIGN OUT",
    admin: "ADMIN",
    langToggleAria: "Cambiar a español",
  },
  browse: {
    all: "ALL",
    filterAria: "Filter by category",
    dividerTitle: "SPECIFIC COMMUNITIES & NEEDS",
    dividerBody:
      "Identity- and needs-specific supports. These work alongside everything above — a child can use both their age-group resources and these.",
    footerLine1:
      "v3 · Resources gathered June 2026 · Verify before relying on any single program",
    footerLine2: "Tap a card to expand · Tap a category chip to filter",
    program: "program",
    programs: "programs",
    howToAccess: "How to access: ",
    registerLearnMore: "Register / learn more",
    nearMe: "📍 Near me",
    nearMeActive: "📍 Sorted by distance",
    nearMeDenied:
      "Location was blocked. You can enable it in your browser settings — nothing is stored.",
    nearMeUnavailable: "Location isn't available on this device.",
    miAway: "mi",
  },
  cat: {
    education: "EDUCATION",
    health: "HEALTH",
    food: "FOOD",
    enrichment: "ENRICHMENT",
    technology: "TECHNOLOGY",
    identity: "IDENTITY & ADVOCACY",
  },
  serve: {
    online: "Self-serve online",
    inperson: "In person",
    navigator: "Navigator helps",
  },
  family: {
    introMain:
      "Enter your children's ages and a few needs, and this builds a personalized list of every free program each child qualifies for — with direct links and how to register.",
    introNoEnroll: "This does not auto-enroll anyone.",
    introNoEnrollRest:
      " Each program has its own sign-up; we point you straight to it. Your info is ",
    introNotSaved: "not saved",
    parentLabel: "PARENT / GUARDIAN NAME (optional)",
    parentPlaceholder: "e.g. Jordan Smith",
    contactLabel: "PHONE OR EMAIL (optional)",
    contactPlaceholder: "So a navigator can follow up, if you opt in below",
    zipLabel: "ZIP CODE (optional)",
    zipPlaceholder: "e.g. 38104",
    childrenTitle: "CHILDREN",
    childNameLabel: "NAME (optional)",
    childNamePlaceholder: "Child's name",
    ageLabel: "AGE",
    agePlaceholder: "0–18",
    disabilityCheck: "Has a disability / is neurodivergent / has an IEP",
    lgbtqCheck: "LGBTQ+ youth (12–17)",
    removeChild: "− remove this child",
    addChild: "+ Add another child",
    needsTitle: "FAMILY NEEDS (optional)",
    needFood: "We could use help with food / groceries",
    needImmigrant: "We're an immigrant / refugee / multilingual family",
    consentTitle: "CONSENT (REQUIRED)",
    consentLead: "I understand and agree:",
    consentBody:
      " This tool will match my children to free programs based on what I've entered. If I use the Cowork export, my family's name, contact info, and children's ages may be used to pre-fill registration forms — one at a time, with my review and approval before anything is submitted. ",
    consentBold:
      "No SSNs, income records, or medical information will be used or entered on my behalf.",
    optIn:
      "Also save my info so a community navigator can follow up and help me register. ",
    optInBold:
      "Leave unchecked to keep everything private — your plan still works either way.",
    buildPlan: "Build my family's plan →",
    checkConsent: "Check the consent box above to continue",
  },
  plan: {
    editAnswers: "← edit answers",
    yourFamilyPlan: "Your Family Plan",
    familyPlanOf: "{name}'s Family Plan",
    subtitle:
      "Every free program your family qualifies for. Start with ⚡ Cowork programs if you have Claude Desktop.",
    saved: "✓ Info saved — a navigator can follow up.",
    saving: "Saving your info…",
    saveError:
      "Couldn't save your info (connection issue). Your plan below still works — try again later or call 2-1-1.",
    coworkReady: "COWORK READY",
    coworkBody:
      "These only need name, contact info, and age — no SSNs or income docs. Claude Cowork + Chrome can pre-fill them. You review and approve each form before it submits. Nothing goes through without your OK.",
    exportButton: "⬇ Export plan for Cowork (.json)",
    setupSummary: "COWORK SETUP INSTRUCTIONS (tap to expand)",
    child: "CHILD",
    age: "AGE",
    seeFamilyWide: "See family-wide programs below.",
    familyWideTitle: "FOR THE WHOLE FAMILY",
    printButton: "⬇ Download as PDF / Print",
    printedFrom: "Memphis Family Resource Guide",
    printedOn: "Plan generated",
  },
  partner: {
    proposed: "DESIGNED FOR THE MEMPHIS PUBLIC LIBRARY",
    agreed: "A MEMPHIS PUBLIC LIBRARY RESOURCE",
    navAbout: "About",
    calloutTitle: "START HERE: A LIBRARY CARD",
    calloutBody:
      "A Memphis Public Library card is free for Shelby County residents. It opens the Library's own programs, its computers and internet, and the 901 Pass — which also works as a library card and gets a family into every city community center and pool, and the Memphis Zoo on Tuesdays.",
    calloutCard: "Get a library card",
    calloutPass: "Get a 901 Pass",
    footerProposed:
      "Designed for the Memphis Public Library · Not an official Library publication until the Library says so",
    footerAgreed: "A Memphis Public Library resource",
  },
  about: {
    title: "About this guide",
    dataGathered: "Programs gathered",
    lastReviewed: "Page reviewed",
    whatTitle: "WHAT IT IS",
    whatBody:
      "A list of free programs for children and families in Shelby County, Tennessee, ages 0 to 18, sorted by age group and need. A parent enters a child's age and a few facts; the guide shows the programs that child qualifies for, with how to sign up. Nothing is submitted for you.",
    whoTitle: "WHO MAKES IT",
    whoBody:
      "Zanden Kelly, a student at Rhodes College in Memphis, built it and keeps it. It is a one-person project. It is not funded by, run by, or affiliated with any of the organizations listed in it, unless a page here says otherwise.",
    howTitle: "HOW THE LIST IS CHECKED",
    howBody:
      "Every program was found on the provider's own website or a public listing, and its page is linked on the card. The list was gathered in June 2026 and is checked when someone reports a change, not on a fixed schedule. Programs change their hours, ages and rules without telling anyone. Before relying on a program, open its link or call.",
    suggestTitle: "HOW TO ADD OR CORRECT A PROGRAM",
    suggestBody:
      "Anyone can propose a program or a correction. It is read by a person before it appears here. Use the form at",
    suggestLink: "Suggest a Resource",
    sourcesTitle: "WHERE THE INFORMATION COMES FROM",
    sourcesBody:
      "Providers' own websites, the Memphis Public Library's public pages, 211 Tennessee, Shelby County and City of Memphis public pages, and school and non-profit listings. Nothing here is copied from a paid database.",
    libraryTitle: "THE MEMPHIS PUBLIC LIBRARY",
    libraryProposed:
      "This edition of the guide was designed for the Memphis Public Library, whose branches are where many families would first look for it. As of the date on this page, the Library has not reviewed or adopted it. The wording on this site will say so until it has. Library card and 901 Pass information comes from the Library's public pages.",
    libraryAgreed:
      "This guide is provided as a Memphis Public Library resource. Library card and 901 Pass information comes from the Library's public pages.",
    privacyTitle: "PRIVACY",
    privacyBody:
      "Browsing the guide stores nothing about you. The family plan runs in your browser and is not saved unless you tick the box asking a navigator to follow up. No Social Security numbers, income records or medical information are ever asked for. Location is used only if you turn on Near me, and only to sort by distance.",
    notTitle: "WHAT THIS GUIDE DOES NOT DO",
    notBody:
      "It does not enroll anyone, does not decide eligibility for any program, does not replace 2-1-1, and does not speak for any provider. A card in this guide means a program said it exists and is free; it does not mean there is space, or that your child will be accepted.",
    contactTitle: "CONTACT",
    contactBody: "zandenkelly@gmail.com. Corrections are welcome and are usually made within a week.",
  },
  suggest: {
    intro:
      "Know a free program we're missing? Suggest it here. Submissions are reviewed before appearing in the guide.",
    nameLabel: "PROGRAM NAME *",
    namePlaceholder: "e.g. Free Saturday Art Classes at …",
    descLabel: "WHAT IT IS *",
    descPlaceholder: "What does it offer? Who is it for? Is it free?",
    howLabel: "HOW TO ACCESS IT",
    howPlaceholder: "Phone, address, or how to sign up",
    urlLabel: "WEBSITE (if any)",
    catLabel: "CATEGORY",
    serveLabel: "ACCESS TYPE",
    minAge: "MIN AGE",
    maxAge: "MAX AGE",
    submitterLabel: "YOUR NAME (optional)",
    submitterPlaceholder: "So we can credit / follow up",
    required: "Program name and description are required.",
    submit: "Submit for review →",
    submitting: "Submitting…",
    thanksTitle: "Thank you",
    thanksBody:
      "Your suggestion was submitted for review. Once approved, it'll appear in the guide for every family.",
    another: "Submit another",
    error:
      "Couldn't submit right now (connection issue). Please try again in a moment.",
  },
};

const es: Strings = {
  header: {
    subtitle: "Programas gratuitos para niños y familias · Edades 0–18",
    navBrowse: "Explorar",
    navFamily: "Registro familiar",
    navSuggest: "Sugerir un recurso",
    navAdmin: "Admin",
    signOut: "SALIR",
    admin: "ADMIN",
    langToggleAria: "Switch to English",
  },
  browse: {
    all: "TODOS",
    filterAria: "Filtrar por categoría",
    dividerTitle: "COMUNIDADES Y NECESIDADES ESPECÍFICAS",
    dividerBody:
      "Apoyos específicos por identidad y necesidad. Funcionan junto con todo lo anterior: un niño puede usar los recursos de su grupo de edad y también estos.",
    footerLine1:
      "v3 · Recursos recopilados en junio de 2026 · Verifique antes de depender de un solo programa",
    footerLine2:
      "Toque una tarjeta para ampliar · Toque una categoría para filtrar",
    program: "programa",
    programs: "programas",
    howToAccess: "Cómo acceder: ",
    registerLearnMore: "Registrarse / más información",
    nearMe: "📍 Cerca de mí",
    nearMeActive: "📍 Ordenado por distancia",
    nearMeDenied:
      "La ubicación fue bloqueada. Puede activarla en la configuración de su navegador — no se guarda nada.",
    nearMeUnavailable: "La ubicación no está disponible en este dispositivo.",
    miAway: "mi",
  },
  cat: {
    education: "EDUCACIÓN",
    health: "SALUD",
    food: "COMIDA",
    enrichment: "ENRIQUECIMIENTO",
    technology: "TECNOLOGÍA",
    identity: "IDENTIDAD Y DEFENSA",
  },
  serve: {
    online: "En línea",
    inperson: "En persona",
    navigator: "Navegador ayuda",
  },
  family: {
    introMain:
      "Ingrese las edades de sus hijos y algunas necesidades, y esto crea una lista personalizada de cada programa gratuito para el que cada niño califica — con enlaces directos y cómo registrarse.",
    introNoEnroll: "Esto no inscribe a nadie automáticamente.",
    introNoEnrollRest:
      " Cada programa tiene su propia inscripción; lo llevamos directo. Su información ",
    introNotSaved: "no se guarda",
    parentLabel: "NOMBRE DEL PADRE / TUTOR (opcional)",
    parentPlaceholder: "p. ej. Jordan Smith",
    contactLabel: "TELÉFONO O CORREO (opcional)",
    contactPlaceholder: "Para que un navegador pueda darle seguimiento, si acepta abajo",
    zipLabel: "CÓDIGO POSTAL (opcional)",
    zipPlaceholder: "p. ej. 38104",
    childrenTitle: "HIJOS",
    childNameLabel: "NOMBRE (opcional)",
    childNamePlaceholder: "Nombre del niño",
    ageLabel: "EDAD",
    agePlaceholder: "0–18",
    disabilityCheck: "Tiene una discapacidad / es neurodivergente / tiene un IEP",
    lgbtqCheck: "Joven LGBTQ+ (12–17)",
    removeChild: "− quitar este niño",
    addChild: "+ Agregar otro niño",
    needsTitle: "NECESIDADES FAMILIARES (opcional)",
    needFood: "Nos vendría bien ayuda con comida / despensa",
    needImmigrant: "Somos una familia inmigrante / refugiada / multilingüe",
    consentTitle: "CONSENTIMIENTO (REQUERIDO)",
    consentLead: "Entiendo y acepto:",
    consentBody:
      " Esta herramienta emparejará a mis hijos con programas gratuitos según lo que ingresé. Si uso la exportación de Cowork, el nombre de mi familia, la información de contacto y las edades de mis hijos pueden usarse para pre-llenar formularios de registro — uno a la vez, con mi revisión y aprobación antes de enviar cualquier cosa. ",
    consentBold:
      "No se usará ni ingresará ningún número de seguro social, registro de ingresos ni información médica en mi nombre.",
    optIn:
      "También guardar mi información para que un navegador comunitario pueda darme seguimiento y ayudarme a registrarme. ",
    optInBold:
      "Déjelo sin marcar para mantener todo privado — su plan funciona igual.",
    buildPlan: "Crear el plan de mi familia →",
    checkConsent: "Marque la casilla de consentimiento para continuar",
  },
  plan: {
    editAnswers: "← editar respuestas",
    yourFamilyPlan: "El plan de su familia",
    familyPlanOf: "Plan familiar de {name}",
    subtitle:
      "Cada programa gratuito para el que su familia califica. Empiece con los programas ⚡ Cowork si tiene Claude Desktop.",
    saved: "✓ Información guardada — un navegador puede darle seguimiento.",
    saving: "Guardando su información…",
    saveError:
      "No se pudo guardar su información (problema de conexión). Su plan de abajo sigue funcionando — intente más tarde o llame al 2-1-1.",
    coworkReady: "LISTOS PARA COWORK",
    coworkBody:
      "Estos solo necesitan nombre, contacto y edad — sin números de seguro social ni comprobantes de ingresos. Claude Cowork + Chrome puede pre-llenarlos. Usted revisa y aprueba cada formulario antes de enviarlo. Nada se envía sin su OK.",
    exportButton: "⬇ Exportar plan para Cowork (.json)",
    setupSummary: "INSTRUCCIONES DE COWORK (toque para ver)",
    child: "NIÑO",
    age: "EDAD",
    seeFamilyWide: "Vea los programas para toda la familia abajo.",
    familyWideTitle: "PARA TODA LA FAMILIA",
    printButton: "⬇ Descargar como PDF / Imprimir",
    printedFrom: "Guía de Recursos Familiares de Memphis",
    printedOn: "Plan generado",
  },
  partner: {
    proposed: "DISEÑADA PARA LA BIBLIOTECA PÚBLICA DE MEMPHIS",
    agreed: "UN RECURSO DE LA BIBLIOTECA PÚBLICA DE MEMPHIS",
    navAbout: "Acerca de",
    calloutTitle: "EMPIECE AQUÍ: UNA TARJETA DE BIBLIOTECA",
    calloutBody:
      "La tarjeta de la Biblioteca Pública de Memphis es gratuita para los residentes del condado de Shelby. Abre los programas de la Biblioteca, sus computadoras e internet, y el 901 Pass, que también sirve como tarjeta de biblioteca y da acceso a todos los centros comunitarios y piscinas de la ciudad, y al zoológico de Memphis los martes.",
    calloutCard: "Obtener una tarjeta de biblioteca",
    calloutPass: "Obtener un 901 Pass",
    footerProposed:
      "Diseñada para la Biblioteca Pública de Memphis · No es una publicación oficial de la Biblioteca hasta que la Biblioteca lo diga",
    footerAgreed: "Un recurso de la Biblioteca Pública de Memphis",
  },
  about: {
    title: "Acerca de esta guía",
    dataGathered: "Programas recopilados en",
    lastReviewed: "Página revisada el",
    whatTitle: "QUÉ ES",
    whatBody:
      "Una lista de programas gratuitos para niños y familias del condado de Shelby, Tennessee, de 0 a 18 años, ordenada por grupo de edad y necesidad. Un padre o madre ingresa la edad de un niño y algunos datos; la guía muestra los programas para los que ese niño califica y cómo inscribirse. Nada se envía en su nombre.",
    whoTitle: "QUIÉN LA HACE",
    whoBody:
      "Zanden Kelly, estudiante de Rhodes College en Memphis, la construyó y la mantiene. Es un proyecto de una sola persona. No está financiada, dirigida ni afiliada a ninguna de las organizaciones que aparecen en ella, salvo que una página aquí diga lo contrario.",
    howTitle: "CÓMO SE VERIFICA LA LISTA",
    howBody:
      "Cada programa se encontró en el sitio web del proveedor o en un listado público, y su página está enlazada en la tarjeta. La lista se recopiló en junio de 2026 y se revisa cuando alguien informa un cambio, no con un calendario fijo. Los programas cambian horarios, edades y reglas sin avisar. Antes de depender de un programa, abra su enlace o llame.",
    suggestTitle: "CÓMO AGREGAR O CORREGIR UN PROGRAMA",
    suggestBody:
      "Cualquiera puede proponer un programa o una corrección. Una persona lo lee antes de que aparezca aquí. Use el formulario en",
    suggestLink: "Sugerir un recurso",
    sourcesTitle: "DE DÓNDE VIENE LA INFORMACIÓN",
    sourcesBody:
      "Sitios web de los proveedores, páginas públicas de la Biblioteca Pública de Memphis, 211 Tennessee, páginas públicas del condado de Shelby y de la ciudad de Memphis, y listados de escuelas y organizaciones sin fines de lucro. Nada aquí se copia de una base de datos de pago.",
    libraryTitle: "LA BIBLIOTECA PÚBLICA DE MEMPHIS",
    libraryProposed:
      "Esta edición de la guía fue diseñada para la Biblioteca Pública de Memphis, cuyas sucursales son donde muchas familias la buscarían primero. A la fecha de esta página, la Biblioteca no la ha revisado ni adoptado. El texto de este sitio lo dirá así hasta que lo haga. La información sobre la tarjeta de biblioteca y el 901 Pass proviene de las páginas públicas de la Biblioteca.",
    libraryAgreed:
      "Esta guía se ofrece como un recurso de la Biblioteca Pública de Memphis. La información sobre la tarjeta de biblioteca y el 901 Pass proviene de las páginas públicas de la Biblioteca.",
    privacyTitle: "PRIVACIDAD",
    privacyBody:
      "Explorar la guía no guarda nada sobre usted. El plan familiar se ejecuta en su navegador y no se guarda a menos que marque la casilla para que un navegador le dé seguimiento. Nunca se piden números de seguro social, registros de ingresos ni información médica. La ubicación se usa solo si activa Cerca de mí, y solo para ordenar por distancia.",
    notTitle: "LO QUE ESTA GUÍA NO HACE",
    notBody:
      "No inscribe a nadie, no decide la elegibilidad para ningún programa, no reemplaza al 2-1-1 y no habla en nombre de ningún proveedor. Una tarjeta en esta guía significa que un programa dijo que existe y que es gratuito; no significa que haya cupo ni que su hijo será aceptado.",
    contactTitle: "CONTACTO",
    contactBody: "zandenkelly@gmail.com. Las correcciones son bienvenidas y normalmente se hacen en una semana.",
  },
  suggest: {
    intro:
      "¿Conoce un programa gratuito que nos falta? Sugiéralo aquí. Las sugerencias se revisan antes de aparecer en la guía.",
    nameLabel: "NOMBRE DEL PROGRAMA *",
    namePlaceholder: "p. ej. Clases de arte gratis los sábados en …",
    descLabel: "QUÉ ES *",
    descPlaceholder: "¿Qué ofrece? ¿Para quién es? ¿Es gratis?",
    howLabel: "CÓMO ACCEDER",
    howPlaceholder: "Teléfono, dirección o cómo inscribirse",
    urlLabel: "SITIO WEB (si tiene)",
    catLabel: "CATEGORÍA",
    serveLabel: "TIPO DE ACCESO",
    minAge: "EDAD MÍN",
    maxAge: "EDAD MÁX",
    submitterLabel: "SU NOMBRE (opcional)",
    submitterPlaceholder: "Para dar crédito / seguimiento",
    required: "El nombre y la descripción del programa son requeridos.",
    submit: "Enviar para revisión →",
    submitting: "Enviando…",
    thanksTitle: "Gracias",
    thanksBody:
      "Su sugerencia fue enviada para revisión. Una vez aprobada, aparecerá en la guía para todas las familias.",
    another: "Enviar otra",
    error:
      "No se pudo enviar ahora (problema de conexión). Por favor intente de nuevo en un momento.",
  },
};

export const STRINGS: Record<Lang, Strings> = { en, es };

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved choice after mount (SSR always renders English, so the
  // first paint matches the server and hydration stays clean).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "es" || saved === "en") setLangState(saved);
    } catch {
      // storage unavailable — English default is fine
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // non-fatal
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
