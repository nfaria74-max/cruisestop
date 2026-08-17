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

    const purchase = await env.ACCESS_DB
      .prepare(`
        SELECT session_id, route, expires_at
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

    const expiresAt = Number(purchase.expires_at);
    const now = Math.floor(Date.now() / 1000);

    if (!expiresAt || now >= expiresAt) {
      return Response.json(
        { error: "Access expired" },
        { status: 410, headers }
      );
    }

    const existing = await env.ACCESS_DB
      .prepare(`
        SELECT id
        FROM device_activations
        WHERE session_id = ? AND device_token = ?
      `)
      .bind(purchase.session_id, deviceToken)
      .first();

    if (existing) {
      await env.ACCESS_DB
        .prepare(`
          UPDATE device_activations
          SET last_seen_at = unixepoch()
          WHERE session_id = ? AND device_token = ?
        `)
        .bind(purchase.session_id, deviceToken)
        .run();

      return Response.json({
        activated: true,
        alreadyActivated: true,
        route: purchase.route,
        accessExpiresAt: expiresAt * 1000,
        maxDevices: 2
      }, { headers });
    }

    await env.ACCESS_DB
      .prepare(`
        INSERT OR IGNORE INTO device_activations
          (session_id, device_token, activated_at, last_seen_at)
        SELECT ?, ?, unixepoch(), unixepoch()
        WHERE (
          SELECT COUNT(*)
          FROM device_activations
          WHERE session_id = ?
        ) < 2
      `)
      .bind(
        purchase.session_id,
        deviceToken,
        purchase.session_id
      )
      .run();

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
        {
          error: "Device limit reached",
          maxDevices: 2
        },
        { status: 409, headers }
      );
    }

    const count = await env.ACCESS_DB
      .prepare(`
        SELECT COUNT(*) AS total
        FROM device_activations
        WHERE session_id = ?
      `)
      .bind(purchase.session_id)
      .first();

    return Response.json({
      activated: true,
      alreadyActivated: false,
      route: purchase.route,
      accessExpiresAt: expiresAt * 1000,
      activatedDevices: Number(count?.total || 1),
      maxDevices: 2
    }, { headers });

  } catch (err) {
    console.error("Activate error:", err);

    return Response.json(
      { error: "Activation failed" },
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    headers: corsHeaders(request, "POST, OPTIONS")
  });
}
