(function () {
  "use strict";

  const MEASUREMENT_ID = "G-DWTNC068JN";
  const CONSENT_KEY = "cruisestop_analytics_consent";

  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  let analyticsLoaded = false;

  function getLanguage() {
    return (document.documentElement.lang || "en")
      .slice(0, 2)
      .toLowerCase();
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;

    analyticsLoaded = true;

    window.gtag("consent", "update", {
      analytics_storage: "granted"
    });

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(MEASUREMENT_ID);

    document.head.appendChild(script);

    window.gtag("js", new Date());

    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: true
    });
  }

  function track(eventName, parameters) {
    if (localStorage.getItem(CONSENT_KEY) !== "granted") return;

    loadAnalytics();

    window.gtag(
      "event",
      eventName,
      Object.assign(
        {
          site_language: getLanguage()
        },
        parameters || {}
      )
    );
  }

  const translations = {
    en: {
      text:
        "We use optional analytics to understand how visitors use CruiseStop and improve the experience.",
      essential: "Essential only",
      accept: "Allow analytics"
    },

    de: {
      text:
        "Wir verwenden optionale Analysen, um zu verstehen, wie Besucher CruiseStop nutzen und das Erlebnis zu verbessern.",
      essential: "Nur erforderlich",
      accept: "Analyse erlauben"
    },

    fr: {
      text:
        "Nous utilisons des statistiques facultatives pour comprendre comment les visiteurs utilisent CruiseStop et améliorer l'expérience.",
      essential: "Essentiel uniquement",
      accept: "Autoriser les statistiques"
    },

    pt: {
      text:
        "Utilizamos estatísticas opcionais para perceber como os visitantes usam o CruiseStop e melhorar a experiência.",
      essential: "Apenas essenciais",
      accept: "Permitir estatísticas"
    },

    nl: {
      text:
        "We gebruiken optionele statistieken om te begrijpen hoe bezoekers CruiseStop gebruiken en de ervaring te verbeteren.",
      essential: "Alleen noodzakelijk",
      accept: "Statistieken toestaan"
    }
  };

  function removeBanner() {
    const banner = document.getElementById("cruisestop-analytics-consent");
    if (banner) banner.remove();
  }

  function saveConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function showConsentBanner() {
    if (document.getElementById("cruisestop-analytics-consent")) return;

    const lang = getLanguage();
    const copy = translations[lang] || translations.en;

    const banner = document.createElement("div");

    banner.id = "cruisestop-analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Privacy settings");

    banner.innerHTML = `
      <div class="cs-consent-inner">
        <p>${copy.text}</p>

        <div class="cs-consent-actions">
          <button type="button" data-consent="denied">
            ${copy.essential}
          </button>

          <button
            type="button"
            class="cs-consent-accept"
            data-consent="granted"
          >
            ${copy.accept}
          </button>
        </div>
      </div>
    `;

    const style = document.createElement("style");

    style.textContent = `
      #cruisestop-analytics-consent {
        position: fixed;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 2147483000;
        font-family: Arial, sans-serif;
      }

      .cs-consent-inner {
        max-width: 680px;
        margin: 0 auto;
        background: #ffffff;
        color: #14213d;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,.22);
        border: 1px solid rgba(0,0,0,.08);
      }

      .cs-consent-inner p {
        margin: 0 0 12px;
        font-size: 14px;
        line-height: 1.45;
      }

      .cs-consent-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .cs-consent-actions button {
        border: 1px solid #062f73;
        border-radius: 999px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        background: #ffffff;
        color: #062f73;
      }

      .cs-consent-actions .cs-consent-accept {
        background: #062f73;
        color: #ffffff;
      }

      @media (max-width: 520px) {
        .cs-consent-actions {
          flex-direction: column;
        }

        .cs-consent-actions button {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    banner.addEventListener("click", function (event) {
      const button = event.target.closest("[data-consent]");
      if (!button) return;

      const choice = button.getAttribute("data-consent");

      if (choice === "granted") {
        saveConsent("granted");
        removeBanner();
        loadAnalytics();

        window.gtag("event", "analytics_consent_granted", {
          site_language: getLanguage()
        });
      } else {
        saveConsent("denied");

        window.gtag("consent", "update", {
          analytics_storage: "denied"
        });

        removeBanner();
      }
    });
  }

  window.CruiseStopAnalytics = {
    track: track,

    consentStatus: function () {
      return localStorage.getItem(CONSENT_KEY);
    },

    resetConsent: function () {
      localStorage.removeItem(CONSENT_KEY);
      showConsentBanner();
    }
  };

  function init() {
    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === "granted") {
      loadAnalytics();
      return;
    }

    if (consent !== "denied") {
      showConsentBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
