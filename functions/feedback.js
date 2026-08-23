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
  const allowOrigin =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://cruisestop.eu";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    Vary: "Origin"
  };
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request, "POST, OPTIONS");

  if (!env.ACCESS_DB) {
    return Response.json(
      { error: "Access database is not configured" },
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();

    const accessToken = String(body.accessToken || "").trim();
    const deviceToken = String(body.deviceToken || "").trim();
    const rating = Number(body.rating);

    const language = ["pt", "de", "fr"].includes(body.language)
      ? body.language
      : "en";

    if (!/^[a-f0-9]{32}$/i.test(accessToken)) {
      return Response.json(
        { error: "Invalid access token" },
        { status: 400, headers }
      );
    }

    if (!/^[A-Za-z0-9_-]{16,128}$/.test(deviceToken)) {
      return Response.json(
        { error: "Invalid device token" },
        { status: 400, headers }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json(
        { error: "Invalid rating" },
        { status: 400, headers }
      );
    }

    const purchase = await env.ACCESS_DB
      .prepare(`
        SELECT session_id, route
        FROM purchases
        WHERE access_token = ?
      `)
      .bind(accessToken)
      .first();

    if (!purchase) {
      return Response.json(
        { error: "Access link not found" },
        { status: 404, headers }
      );
    }

    const activation = await env.ACCESS_DB
      .prepare(`
        SELECT id
        FROM device_activations
        WHERE session_id = ? AND device_token = ?
      `)
      .bind(purchase.session_id, deviceToken)
      .first();

    if (!activation) {
      return Response.json(
        { error: "Device not activated for this purchase" },
        { status: 403, headers }
      );
    }

    await env.ACCESS_DB
      .prepare(`
        INSERT INTO feedback
          (session_id, route, rating, language, device_token, created_at)
        VALUES (?, ?, ?, ?, ?, unixepoch())
        ON CONFLICT(session_id) DO UPDATE SET
          rating = excluded.rating,
          language = excluded.language,
          device_token = excluded.device_token,
          updated_at = unixepoch()
      `)
      .bind(
        purchase.session_id,
        purchase.route,
        rating,
        language,
        deviceToken
      )
      .run();

    return Response.json({ ok: true }, { headers });

  } catch (err) {
    console.error("Feedback error:", err);

    return Response.json(
      { error: "Feedback failed" },
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    headers: corsHeaders(request, "POST, OPTIONS")
  });
}
