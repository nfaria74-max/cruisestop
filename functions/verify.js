// functions/verify.js
// Automatically available at https://cruisestop.eu/verify
//
// Add this in Cloudflare Pages > Settings > Environment Variables:
//   STRIPE_SECRET_KEY  ->  sk_live_xxxxxxxxxxxx

const ALLOWED_ORIGINS = new Set([
  'https://cruisestop.eu',
  'https://www.cruisestop.eu',
  'https://cruisestop-pwa.pages.dev',
  'http://localhost:4174',
  'http://127.0.0.1:4174',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);

function corsHeaders(request, methods) {
  const origin = request.headers.get('Origin');
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://cruisestop.eu';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export async function onRequestGet({ request, env }) {
  const headers = corsHeaders(request, 'GET, OPTIONS');
  const url       = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return Response.json({ error: 'Missing session_id' }, { status: 400, headers });
  }

  if (!env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 500, headers });
  }

  try {
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      { headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}` } }
    );

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return Response.json({ error: 'Invalid session' }, { status: 400, headers });
    }

    const paid  = session.payment_status === 'paid';
    const route = session.metadata?.route || null;
    const customerEmail = session.customer_details?.email || session.customer_email || null;
    const purchaseCreatedAt = Number(session.created) * 1000;
    const accessExpiresAt = purchaseCreatedAt + 30 * 24 * 60 * 60 * 1000;

    if (!paid) {
      return Response.json({ paid, route, customerEmail, accessExpiresAt }, { headers });
    }

    if (!route) {
      return Response.json({ error: 'Missing route metadata' }, { status: 400, headers });
    }

    if (!env.ACCESS_DB) {
      return Response.json({ error: 'Access database is not configured' }, { status: 500, headers });
    }

    let purchase = await env.ACCESS_DB
      .prepare('SELECT access_token FROM purchases WHERE session_id = ?')
      .bind(sessionId)
      .first();

    if (!purchase) {
      const accessToken = crypto.randomUUID().replace(/-/g, '');

      await env.ACCESS_DB
        .prepare(`
          INSERT OR IGNORE INTO purchases
          (session_id, access_token, route, customer_email, purchased_at, expires_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(
          sessionId,
          accessToken,
          route,
          customerEmail,
          Math.floor(purchaseCreatedAt / 1000),
          Math.floor(accessExpiresAt / 1000)
        )
        .run();

      purchase = await env.ACCESS_DB
        .prepare('SELECT access_token FROM purchases WHERE session_id = ?')
        .bind(sessionId)
        .first();
    }

    if (!purchase?.access_token) {
      return Response.json({ error: 'Could not create access token' }, { status: 500, headers });
    }

    return Response.json({
      paid,
      route,
      customerEmail,
      accessExpiresAt,
      accessToken: purchase.access_token
    }, { headers });

  } catch (err) {
    console.error('Verify error:', err);
    return Response.json({ error: 'Verification failed' }, { status: 500, headers });
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, { headers: corsHeaders(request, 'GET, OPTIONS') });
}
