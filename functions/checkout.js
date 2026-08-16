const ROUTES = {
  relax: { name: "Relaxed Funchal", price: 499 },
  foodie: { name: "Taste Madeira", price: 499, available: false },
  panoramic: { name: "Panoramic Funchal", price: 499 }
};

const ALLOWED_ORIGINS = new Set([
  "https://cruisestop.eu",
  "https://www.cruisestop.eu",
  "https://cruisestop-pwa.pages.dev",
  "http://localhost:4174",
  "http://127.0.0.1:4174",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

function corsHeaders(request, methods) {
  const origin = request.headers.get("Origin");
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://cruisestop.eu";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin"
  };
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request, "POST, OPTIONS");

  try {
    const { route, lang } = await request.json();
    const normalizedLang = ["de", "fr", "pt", "nl"].includes(lang) ? lang : "en";
    const pageSuffix = normalizedLang === "en" ? "" : `_${normalizedLang}`;

    if (!ROUTES[route]) {
      return Response.json({ error: "Invalid route" }, { status: 400, headers });
    }

    if (ROUTES[route].available === false) {
      return Response.json({ error: "Route not available yet" }, { status: 409, headers });
    }

    if (!env.STRIPE_SECRET_KEY) {
      return Response.json({ error: "Stripe is not configured" }, { status: 500, headers });
    }

    const { name, price } = ROUTES[route];
    const siteUrl = new URL(request.url).origin;

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][product_data][name]": name,
        "line_items[0][price_data][unit_amount]": String(price),
        "line_items[0][quantity]": "1",
        mode: "payment",
        success_url: `${siteUrl}/success${pageSuffix}.html?route=${route}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/index${pageSuffix}.html#routes`,
        "metadata[route]": route
      })
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return Response.json(
        { error: session.error?.message || "Stripe error" },
        { status: 500, headers }
      );
    }

    return Response.json({ url: session.url }, { headers });
  } catch (err) {
    return Response.json({ error: "Internal error" }, { status: 500, headers });
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, { headers: corsHeaders(request, "POST, OPTIONS") });
}
