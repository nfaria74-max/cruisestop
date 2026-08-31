const CACHE_NAME = "cruisestop-funchal-v264";
const APP_ASSETS = [
  // NOTE: "./" removed intentionally — it was fetching cruisestop.eu/ which
  // app.js was redirecting to index_pt.html, so the cache stored PT content
  // under the "/" key. Now we pre-cache index.html explicitly instead.
  "./index.html",
  "./update.html",
  "./site-update.js?v=254",
  "./index_de.html",
  "./index_fr.html",
  "./index_pt.html",
  "./relex.html",
  "./relax_EN.html",
  "./relex_de.html",
  "./relex_fr.html",
  "./relex_pt.html",
  "./foddie.html",
  "./foodie_EN.html",
  "./foddie_de.html",
  "./foddie_fr.html",
  "./foddie_pt.html",
  "./panoramic.html",
  "./panoramic_de.html",
  "./panoramic_fr.html",
  "./panoramic_pt.html",
  "./route_summary.html",
  "./route_summary_de.html",
  "./route_summary_fr.html",
  "./route_summary_pt.html",
  "./relax_summary.html",
  "./relax_summary_de.html",
  "./relax_summary_fr.html",
  "./relax_summary_pt.html",
  "./foodie_summary.html",
  "./foodie_summary_de.html",
  "./foodie_summary_fr.html",
  "./foodie_summary_pt.html",
  "./panoramic_summary.html",
  "./panoramic_summary_de.html",
  "./panoramic_summary_fr.html",
  "./panoramic_summary_pt.html",
  "./help.html",
  "./help_de.html",
  "./help_fr.html",
  "./help_pt.html",
  "./success.html",
  "./success_de.html",
  "./success_fr.html",
  "./success_pt.html",
  "./funchal-walk-gourmet/index.html",
  "./funchal-walk-gourmet/",
  "./funchal-walk-panoramic/index.html",
  "./funchal-walk-panoramic/",
  "./funchal-walk-relax/index.html",
  "./funchal-walk-relax/",
  "./styles.css?v=254",
  "./styles-route.css?v=254",
  "./images/panoramic/panoramic-stop6.jpg",
  "./images/RELAX/relax-stop6.png",
  "./img/avatar-emma.jpg",
  "./ux-performance.js?v=254",
  "./styles-fixes.css?v=254",
  "./mobile-scroll-fix.css?v=254",
  "./mobile-scroll-touch.js?v=254",
  "./styles-ux-optimized.css?v=254",
  "./app.js?v=254",
  "./route-page.js?v=264",
  "./manifest.webmanifest",
  "./manifest.json",
  "./sitemap.xml",
  "./robots.txt",
  "./assets/hero-main.png",
  "./img/hero-funchal-new.jpg",
  "./img/hero-funchal-mobile.jpg",
  "./assets/hero-funchal.png",
  "./assets/route-relax.png",
  "./assets/route-gourmet.png",
  "./assets/route-local.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./icons/192.png",
  "./icons/512.png",
  "./icons/flag/EN.png",
  "./icons/flag/DE.png",
  "./icons/flag/FR.png",
  "./icons/flag/PT.png",
  "./images/cruisestop_logo.png",
  "./images/product-preview-phone-v256.png",
  "./images/product-preview-phone-v256_pt.png",
  "./images/product-preview-phone-v256_de.png",
  "./images/product-preview-phone-v256_fr.png",
  "./images/mapa.png",
  "./images/funchal-hero.webp.jpg",
  "./images/RELAX/relax-stop1.png",
  "./images/RELAX/relax-stop2.png",
  "./images/RELAX/relax-stop3.jpg",
  "./images/RELAX/relax-stop4.jpg",
  "./images/RELAX/relax-stop5.png",
  "./images/FOODIE/foodie-stop1.jpg",
  "./images/FOODIE/foodie-stop2.jpg",
  "./images/FOODIE/foodie-stop3.jpg",
  "./images/FOODIE/foodie-stop4.jpg",
  "./images/FOODIE/foodie-stop5.jpg",
  "./images/panoramic/panoramic-stop1.jpg",
  "./images/panoramic/panoramic-stop2.jpg",
  "./images/panoramic/panoramic-stop3.jpg",
  "./images/panoramic/panoramic-stop4.jpg",
  "./images/panoramic/panoramic-stop5.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Delete old caches while keeping the current cache — ensures no stale PT
    // content cached under "/" survives across the version bump.
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "CLEAR_CACHES") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))));
  }
});

function isHtmlRequest(request) {
  const accept = request.headers.get("accept") || "";
  return request.mode === "navigate" || accept.includes("text/html");
}

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

function isImageRequest(request) {
  const pathname = new URL(request.url).pathname;
  return request.destination === "image" || /\.(png|jpe?g|webp|svg|gif|ico)$/i.test(pathname);
}

async function putInCache(request, response) {
  if (!isSameOrigin(request) || !response || !response.ok) return response;

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function htmlFallback(request) {
  const url = new URL(request.url);
  const candidates = [
    request,
    "." + url.pathname,
    "." + url.pathname + ".html",
    "./index.html",
  ];

  for (const candidate of candidates) {
    const cached = await caches.match(candidate);
    if (cached) return cached;
  }

  return Response.error();
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (isHtmlRequest(event.request)) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => putInCache(event.request, response))
        .catch(() => htmlFallback(event.request))
    );
    return;
  }

  if (!isSameOrigin(event.request)) {
    return;
  }

  if (isImageRequest(event.request)) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => putInCache(event.request, response))
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => putInCache(event.request, response))
        .catch(() => cached || Response.error());
    })
  );
});

