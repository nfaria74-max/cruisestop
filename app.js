const supportedLangs = ["en", "de", "fr", "pt"];
const languageHomePages = {
  en: "index.html",
  de: "index_de.html",
  fr: "index_fr.html",
  pt: "index_pt.html"
};

function readStoredLanguage() {
  try {
    return localStorage.getItem("cruisestop-lang") || "";
  } catch {
    return "";
  }
}

function saveStoredLanguage(lang) {
  if (!supportedLangs.includes(lang)) return;

  try {
    localStorage.setItem("cruisestop-lang", lang);
  } catch {
    // Private browsing can block storage; language detection still works.
  }
}

function homeLanguageFromPath(pathname) {
  const fileName = pathname.split("/").filter(Boolean).pop() || "index.html";
  const match = fileName.match(/^index(?:_([a-z]{2}))?\.html$/i);
  if (!match) return "";
  return match[1] ? match[1].toLowerCase() : "en";
}

function detectDeviceLanguage() {
  const deviceLanguages =
    Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];

  for (const language of deviceLanguages) {
    const baseLanguage = String(language).toLowerCase().split("-")[0];
    if (supportedLangs.includes(baseLanguage)) return baseLanguage;
  }

  return "en";
}

// redirectFromEnglishHomeToPreferredLanguage() removed 2026-08-04.
// index.html opens always in English regardless of stored preference or device language.
// Language switching is manual only via the lang picker.

const cta = document.querySelector(".primary-cta span");
const routeCards = [...document.querySelectorAll(".route-card")];
const languageLinks = [...document.querySelectorAll(".language-strip a")];
const previewModal = document.querySelector("#previewModal");
const previewButtons = [...document.querySelectorAll("[data-preview]")];
const closePreviewButtons = [...document.querySelectorAll("[data-close-preview]")];
const buyButtons = [...document.querySelectorAll("[data-buy-route]")];
const stickyCta = document.querySelector(".sticky-cta");

function updateStickyCtaVisibility() {
  if (!stickyCta) return;

  const revealOffset = Math.max(640, Math.round(window.innerHeight * 0.9));
  document.body.classList.toggle("has-sticky-cta-visible", window.scrollY > revealOffset);
}

if (stickyCta) {
  window.addEventListener("scroll", updateStickyCtaVisibility, { passive: true });
  window.addEventListener("resize", updateStickyCtaVisibility);
  window.addEventListener("load", updateStickyCtaVisibility);
  updateStickyCtaVisibility();
}

const TEST_MODE_NO_STRIPE = false;
const pageLang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
const activeLang = supportedLangs.includes(pageLang) ? pageLang : "en";
const pageSuffix = activeLang === "en" ? "" : `_${activeLang}`;

const copy = {
  en: {
    routeSelectedCta: "Explore {route} for €4,99",
    stripeFileAlert:
      "Stripe checkout only works after publishing this folder to Cloudflare Pages. Add STRIPE_SECRET_KEY in Cloudflare, then test from the pages.dev or cruisestop.eu URL.",
    openingCheckout: "Opening secure checkout...",
    checkoutError: "Could not open checkout. Please try again in a moment.",
    previews: {
      easy: {
        eyebrow: "Free Preview - Stop 1",
        image: "images/RELAX/relax-stop1.png",
        title: "Municipal Garden",
        subtitle: "A garden in the heart of the city",
        description:
          "Step off the ship and into one of Funchal's most peaceful corners. Sit on a bench, watch locals pass by and let the city come to you.",
        why: "It sets the tone for the whole route: calm, unhurried and completely local.",
        duration: "Suggested duration: 20 minutes",
        cta: "Explore for €4,99",
        route: "relax"
      },
      food: {
        eyebrow: "Free Preview - Stop 1",
        image: "images/FOODIE/foodie-stop1.jpg",
        title: "Mercado dos Lavradores",
        subtitle: "Local market start",
        description:
          "Begin among fruit, flowers, fish stalls and local produce in one of Funchal's most vivid food landmarks.",
        why: "It is the fastest way to feel the food culture of the city without wasting shore time.",
        duration: "Suggested duration: 25 minutes",
        cta: "Explore for €4,99",
        route: "foodie"
      },
      panoramic: {
        eyebrow: "Free Preview - Stop 1",
        image: "images/panoramic/panoramic-stop1.jpg",
        title: "Avenida do Mar",
        subtitle: "Ocean views from the first minutes",
        description:
          "Start with a wide sea view and an easy orientation moment before the route moves toward Funchal's most scenic corners.",
        why: "It sets the promise of the route: open views, simple walking choices and enough time to return calmly.",
        duration: "Suggested duration: 20 minutes",
        cta: "Explore for €4,99",
        route: "panoramic"
      }
    }
  },
  de: {
    routeSelectedCta: "Route {route} für €4,99 entdecken",
    stripeFileAlert:
      "Stripe Checkout funktioniert erst nach der Veröffentlichung bei Cloudflare Pages. Hinterlege STRIPE_SECRET_KEY in Cloudflare und teste dann über pages.dev oder cruisestop.eu.",
    openingCheckout: "Sicherer Checkout wird geöffnet...",
    checkoutError: "Checkout konnte nicht geöffnet werden. Bitte versuche es gleich noch einmal.",
    previews: {
      easy: {
        eyebrow: "Kostenlose Vorschau - Stopp 1",
        image: "images/RELAX/relax-stop1.png",
        title: "Jardim Municipal",
        subtitle: "Ein Garten im Herzen der Stadt",
        description:
          "Geh vom Schiff direkt in eine der ruhigsten Ecken Funchals. Setz dich auf eine Bank, beobachte das lokale Leben und lass die Stadt zu dir kommen.",
        why: "Dieser Stopp gibt der ganzen Route den Ton: ruhig, entspannt und sehr lokal.",
        duration: "Empfohlene Zeit: 20 Minuten",
        cta: "Für €4,99 entdecken",
        route: "relax"
      },
      food: {
        eyebrow: "Kostenlose Vorschau - Stopp 1",
        image: "images/FOODIE/foodie-stop1.jpg",
        title: "Mercado dos Lavradores",
        subtitle: "Start am lokalen Markt",
        description:
          "Beginne zwischen Obst, Blumen, Fischständen und lokalen Produkten an einem der lebendigsten Food-Orte Funchals.",
        why: "So spürst du die Esskultur der Stadt schnell, ohne wertvolle Landgangszeit zu verlieren.",
        duration: "Empfohlene Zeit: 25 Minuten",
        cta: "Für €4,99 entdecken",
        route: "foodie"
      },
      panoramic: {
        eyebrow: "Kostenlose Vorschau - Stopp 1",
        image: "images/panoramic/panoramic-stop1.jpg",
        title: "Avenida do Mar",
        subtitle: "Meerblick ab den ersten Minuten",
        description:
          "Beginne mit einem weiten Blick aufs Meer und einer einfachen Orientierung, bevor die Route zu den schönsten Aussichtspunkten Funchals führt.",
        why: "Dieser Stopp zeigt sofort, worum es geht: offene Ausblicke, klare Wege und genug Zeit für eine ruhige Rückkehr.",
        duration: "Empfohlene Zeit: 20 Minuten",
        cta: "Für €4,99 entdecken",
        route: "panoramic"
      }
    }
  },
  fr: {
    routeSelectedCta: "Explorer {route} pour €4,99",
    stripeFileAlert:
      "Stripe Checkout fonctionne seulement après la publication sur Cloudflare Pages. Ajoutez STRIPE_SECRET_KEY dans Cloudflare, puis testez depuis pages.dev ou cruisestop.eu.",
    openingCheckout: "Ouverture du paiement sécurisé...",
    checkoutError: "Impossible d'ouvrir le paiement. Veuillez réessayer dans un instant.",
    previews: {
      easy: {
        eyebrow: "Aperçu gratuit - arrêt 1",
        image: "images/RELAX/relax-stop1.png",
        title: "Jardim Municipal",
        subtitle: "Un jardin au coeur de la ville",
        description:
          "Descendez du navire et entrez dans l'un des coins les plus paisibles de Funchal. Asseyez-vous, observez les habitants et laissez la ville venir à vous.",
        why: "Cet arrêt donne le rythme de toute la route : calme, simple et vraiment local.",
        duration: "Temps conseillé : 20 minutes",
        cta: "Explorer pour €4,99",
        route: "relax"
      },
      food: {
        eyebrow: "Aperçu gratuit - arrêt 1",
        image: "images/FOODIE/foodie-stop1.jpg",
        title: "Mercado dos Lavradores",
        subtitle: "Départ au marché local",
        description:
          "Commencez parmi les fruits, les fleurs, les étals de poisson et les produits locaux dans l'un des lieux les plus vivants de Funchal.",
        why: "C'est le moyen le plus rapide de sentir la culture culinaire de la ville sans perdre votre temps d'escale.",
        duration: "Temps conseillé : 25 minutes",
        cta: "Explorer pour €4,99",
        route: "foodie"
      },
      panoramic: {
        eyebrow: "Aperçu gratuit - arrêt 1",
        image: "images/panoramic/panoramic-stop1.jpg",
        title: "Avenida do Mar",
        subtitle: "La mer dès les premières minutes",
        description:
          "Commencez par une grande vue sur l'océan et un repère simple avant de continuer vers les coins les plus panoramiques de Funchal.",
        why: "Cet arrêt donne le ton : vues ouvertes, marche simple et assez de temps pour revenir calmement.",
        duration: "Temps conseillé : 20 minutes",
        cta: "Explorer pour €4,99",
        route: "panoramic"
      }
    }
  },
  pt: {
    routeSelectedCta: "Explorar {route} por €4,99",
    stripeFileAlert:
      "O checkout Stripe só funciona depois de publicar esta pasta na Cloudflare Pages. Adicione STRIPE_SECRET_KEY na Cloudflare e teste no pages.dev ou cruisestop.eu.",
    openingCheckout: "A abrir checkout seguro...",
    checkoutError: "Não foi possível abrir o checkout. Tente novamente dentro de instantes.",
    previews: {
      easy: {
        eyebrow: "Pré-visualização grátis - paragem 1",
        image: "images/RELAX/relax-stop1.png",
        title: "Jardim Municipal",
        subtitle: "Um jardim no coração da cidade",
        description:
          "Saia do navio e entre num dos recantos mais tranquilos do Funchal. Sente-se num banco, veja os locais passar e deixe a cidade chegar até si.",
        why: "Esta paragem define o ritmo de toda a rota: calma, descontraída e totalmente local.",
        duration: "Tempo sugerido: 20 minutos",
        cta: "Explorar por €4,99",
        route: "relax"
      },
      food: {
        eyebrow: "Pré-visualização grátis - paragem 1",
        image: "images/FOODIE/foodie-stop1.jpg",
        title: "Mercado dos Lavradores",
        subtitle: "Começo no mercado local",
        description:
          "Comece entre fruta, flores, bancas de peixe e produtos locais num dos pontos gastronómicos mais vivos do Funchal.",
        why: "É a forma mais rápida de sentir a cultura gastronómica da cidade sem perder tempo da sua escala.",
        duration: "Tempo sugerido: 25 minutos",
        cta: "Explorar por €4,99",
        route: "foodie"
      },
      panoramic: {
        eyebrow: "Pré-visualização grátis - paragem 1",
        image: "images/panoramic/panoramic-stop1.jpg",
        title: "Avenida do Mar",
        subtitle: "Vista de mar desde os primeiros minutos",
        description:
          "Comece com uma vista aberta sobre o Atlântico e uma orientação simples antes de seguir para os recantos mais panorâmicos do Funchal.",
        why: "Esta paragem mostra logo a promessa da rota: vistas abertas, escolhas fáceis e tempo para regressar com calma.",
        duration: "Tempo sugerido: 20 minutos",
        cta: "Explorar por €4,99",
        route: "panoramic"
      }
    }
  },
  nl: {
    routeSelectedCta: "Ontgrendel de {route}-route nu",
    stripeFileAlert:
      "Stripe Checkout werkt pas nadat deze map is gepubliceerd op Cloudflare Pages. Voeg STRIPE_SECRET_KEY toe in Cloudflare en test via pages.dev of cruisestop.eu.",
    openingCheckout: "Veilige checkout openen...",
    checkoutError: "Checkout kon niet worden geopend. Probeer het zo opnieuw.",
    previews: {
      easy: {
        eyebrow: "Gratis voorbeeld - stop 1",
        image: "images/RELAX/relax-stop1.png",
        alt: "Jardim Municipal preview op de Slow Funchal cruisehaven-wandeling",
        title: "Jardim Municipal",
        subtitle: "Een tuin in het hart van de stad",
        description:
          "Stap van het schip en wandel naar een van de rustigste plekken van Funchal. Ga even zitten, kijk naar het lokale leven en laat de stad naar je toe komen.",
        why: "Deze stop zet de toon voor de hele route: rustig, ontspannen en echt lokaal.",
        duration: "Aanbevolen tijd: 20 minuten",
        cta: "Volledige route kopen - €4.99",
        route: "relax"
      },
      food: {
        eyebrow: "Gratis voorbeeld - stop 1",
        image: "images/FOODIE/foodie-stop1.jpg",
        alt: "Mercado dos Lavradores preview op de Taste Madeira food walk",
        title: "Mercado dos Lavradores",
        subtitle: "Start op de lokale markt",
        description:
          "Begin tussen fruit, bloemen, viskramen en lokale producten op een van de levendigste foodplekken van Funchal.",
        why: "Dit is de snelste manier om de eetcultuur van de stad te voelen zonder kostbare wal-tijd te verliezen.",
        duration: "Aanbevolen tijd: 25 minuten",
        cta: "Volledige route kopen - €4.99",
        route: "foodie"
      }
    }
  }
};

const i18n = copy[activeLang] || copy.en;

const routePages = {
  relax: `relex${pageSuffix}.html`,
  foodie: `foddie${pageSuffix}.html`,
  panoramic: `panoramic${pageSuffix}.html`
};

const routeSummaryPages = {
  relax: `relax_summary${pageSuffix}.html`,
  foodie: `foodie_summary${pageSuffix}.html`,
  panoramic: `panoramic_summary${pageSuffix}.html`
};

const previews = i18n.previews;

const selectedRoute = localStorage.getItem("cruisestop-route");
if (selectedRoute) {
  const selectedCard = routeCards.find((card) => card.dataset.route === selectedRoute);
  if (selectedCard) {
    selectedCard.classList.add("is-selected");
    if (cta) cta.textContent = i18n.routeSelectedCta.replace("{route}", selectedRoute);
  }
}

languageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetUrl = new URL(link.getAttribute("href"), window.location.href);
    const targetLanguage = homeLanguageFromPath(targetUrl.pathname);
    saveStoredLanguage(targetLanguage || "en");
  });
});

routeCards.forEach((card) => {
  card.addEventListener("click", () => {
    routeCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    localStorage.setItem("cruisestop-route", card.dataset.route);
    if (cta) cta.textContent = i18n.routeSelectedCta.replace("{route}", card.dataset.route);
  });
});

function setPreview(routeKey) {
  const preview = previews[routeKey] || previews.easy;
  document.querySelector("#previewEyebrow").textContent = preview.eyebrow;
  const previewImage = document.querySelector("#previewImage");
  previewImage.src = preview.image;
  previewImage.alt = preview.alt || preview.title;
  document.querySelector("#previewTitle").textContent = preview.title;
  document.querySelector("#previewSubtitle").textContent = preview.subtitle;
  document.querySelector("#previewDescription").textContent = preview.description;
  document.querySelector("#previewWhy").textContent = preview.why;
  document.querySelector("#previewDuration").textContent = preview.duration;
  const previewCta = document.querySelector("#previewCta");
  const foodieComingSoon = {
    en: "Coming soon",
    pt: "Brevemente",
    de: "Demnächst",
    fr: "Bientôt"
  };

  if (preview.route === "foodie" && foodieComingSoon[activeLang]) {
    previewCta.textContent = foodieComingSoon[activeLang];
    previewCta.disabled = true;
    previewCta.removeAttribute("data-buy-route");
  } else {
    previewCta.textContent = preview.cta;
    previewCta.disabled = false;
    previewCta.dataset.buyRoute = preview.route;
  }
}

function openPreview(routeKey) {
  setPreview(routeKey);
  previewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-preview-open");
  document.querySelector(".preview-close").focus();
}

function closePreview() {
  previewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-preview-open");
}

previewButtons.forEach((button) => {
  button.addEventListener("click", () => openPreview(button.dataset.preview));
});

closePreviewButtons.forEach((button) => {
  button.addEventListener("click", closePreview);
});

async function buyRoute(route, button) {
  if (TEST_MODE_NO_STRIPE) {
    if (!routeSummaryPages[route]) return;

    localStorage.setItem(
      `access_${route}`,
      JSON.stringify({
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        sessionId: "test-mode"
      })
    );

    window.location.href = routeSummaryPages[route];
    return;
  }

  if (window.location.protocol === "file:") {
    alert(i18n.stripeFileAlert);
    return;
  }

  if (route === "relax" && routeSummaryPages[route]) {
    window.location.href = routeSummaryPages[route];
    return;
  }

  const saved = localStorage.getItem(`access_${route}`);
  if (saved) {
    try {
      const access = JSON.parse(saved);
      if (access.expiry && access.expiry > Date.now() && routePages[route]) {
        window.location.href = routePages[route];
        return;
      }
    } catch {
      localStorage.removeItem(`access_${route}`);
    }
  }

  const originalText = button ? button.textContent : "";
  if (button) {
    button.disabled = true;
    button.textContent = i18n.openingCheckout;
  }

  try {
    const response = await fetch("/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route, lang: activeLang })
    });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error(data.error || "Checkout unavailable");
  } catch (error) {
    alert(i18n.checkoutError);
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

buyButtons.forEach((button) => {
  button.addEventListener("click", () => buyRoute(button.dataset.buyRoute, button));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && previewModal.getAttribute("aria-hidden") === "false") {
    closePreview();
  }
});

const previewParam = new URLSearchParams(window.location.search).get("preview");
if (previewParam && previews[previewParam]) {
  window.addEventListener("load", () => openPreview(previewParam));
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js?v=253", { updateViaCache: "none" })
      .catch(() => {});
  });
}

