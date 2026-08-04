(function () {
  const SITE_VERSION = "v253";
  const CACHE_PREFIX = "cruisestop-funchal-";
  const VERSION_KEY = "cruisestop_site_version";
  const UPDATE_REDIRECT_KEY = "cruisestop_update_redirect_" + SITE_VERSION;
  const UPDATE_PAGE = "/update.html";

  function isUpdatePage() {
    return new URL(window.location.href).pathname === UPDATE_PAGE;
  }

  function currentPageTarget() {
    const url = new URL(window.location.href);
    url.searchParams.delete("appv");
    url.searchParams.delete("updated");
    return url.pathname + url.search + url.hash;
  }

  function updatePageUrl(target) {
    const url = new URL(UPDATE_PAGE, window.location.origin);
    url.searchParams.set("to", target || currentPageTarget());
    url.searchParams.set("appv", SITE_VERSION);
    return url.toString();
  }

  async function deleteOldCaches() {
    if (!("caches" in window)) return;

    const currentCache = CACHE_PREFIX + SITE_VERSION;
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) =>
        key.startsWith(CACHE_PREFIX) && key !== currentCache
          ? caches.delete(key)
          : Promise.resolve(false)
      )
    );
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return null;

    const registration = await navigator.serviceWorker.register("/sw.js?v=" + SITE_VERSION, {
      updateViaCache: "none",
    });

    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    registration.update().catch(function () {});
    return registration;
  }

  async function checkForUpdates() {
    try {
      const previousVersion = localStorage.getItem(VERSION_KEY);
      await registerServiceWorker();

      if (previousVersion && previousVersion !== SITE_VERSION) {
        if (!isUpdatePage() && sessionStorage.getItem(UPDATE_REDIRECT_KEY) !== "1") {
          sessionStorage.setItem(UPDATE_REDIRECT_KEY, "1");
          window.location.replace(updatePageUrl());
          return;
        }
      }

      if (previousVersion !== SITE_VERSION) {
        await deleteOldCaches();
        localStorage.setItem(VERSION_KEY, SITE_VERSION);
      }

      if (!isUpdatePage()) {
        sessionStorage.removeItem(UPDATE_REDIRECT_KEY);
      }
    } catch (error) {
      // Updating should never block the route experience.
    }
  }

  async function clearAndReload(targetUrl) {
    const target = targetUrl || "/";

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    localStorage.setItem(VERSION_KEY, SITE_VERSION);

    const url = new URL(target, window.location.origin);
    url.searchParams.set("appv", SITE_VERSION);
    url.searchParams.set("updated", Date.now().toString());
    window.location.replace(url.toString());
  }

  window.CruiseStopUpdate = {
    version: SITE_VERSION,
    clearAndReload,
    checkForUpdates,
  };

  document.addEventListener(
    "error",
    function (event) {
      const image = event.target;
      if (!image || image.tagName !== "IMG" || image.dataset.fallbackApplied === "1") return;

      image.dataset.fallbackApplied = "1";
      image.src = "/images/funchal-hero.webp.jpg";
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkForUpdates);
  } else {
    checkForUpdates();
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (isUpdatePage() || sessionStorage.getItem(UPDATE_REDIRECT_KEY) === "1") return;
      const previousVersion = localStorage.getItem(VERSION_KEY);
      if (!previousVersion || previousVersion === SITE_VERSION) return;

      sessionStorage.setItem(UPDATE_REDIRECT_KEY, "1");
      window.location.replace(updatePageUrl());
    });
  }
})();

