const ROUTE_NAMES = {
  relax: "Relaxed Funchal",
  foodie: "Taste Madeira",
  panoramic: "Panoramic Funchal"
};

const EMAIL_TEXT = {
  en: {
    locale: "en-GB",
    subject: "Your CruiseStop route is ready",
    title: "Your route is ready",
    intro: "Your personal CruiseStop access is ready.",
    routeLabel: "Route",
    validLabel: "Access valid until",
    devices: "Up to 2 devices.",
    button: "OPEN MY ROUTE",
    keep: "Keep this email. You can use this personal link again during the validity period."
  },

  pt: {
    locale: "pt-PT",
    subject: "A sua rota CruiseStop está pronta",
    title: "A sua rota está pronta",
    intro: "O seu acesso pessoal CruiseStop está pronto.",
    routeLabel: "Rota",
    validLabel: "Acesso válido até",
    devices: "Até 2 dispositivos.",
    button: "ABRIR A MINHA ROTA",
    keep: "Guarde este email. Pode voltar a utilizar este link pessoal durante o período de validade."
  },

  de: {
    locale: "de-DE",
    subject: "Deine CruiseStop-Route ist bereit",
    title: "Deine Route ist bereit",
    intro: "Dein persönlicher CruiseStop-Zugang ist bereit.",
    routeLabel: "Route",
    validLabel: "Zugang gültig bis",
    devices: "Bis zu 2 Geräte.",
    button: "MEINE ROUTE ÖFFNEN",
    keep: "Bewahre diese E-Mail auf. Du kannst diesen persönlichen Link während der Gültigkeitsdauer erneut verwenden."
  },

  fr: {
    locale: "fr-FR",
    subject: "Votre itinéraire CruiseStop est prêt",
    title: "Votre itinéraire est prêt",
    intro: "Votre accès personnel CruiseStop est prêt.",
    routeLabel: "Itinéraire",
    validLabel: "Accès valable jusqu'au",
    devices: "Jusqu'à 2 appareils.",
    button: "OUVRIR MON ITINÉRAIRE",
    keep: "Conservez cet e-mail. Vous pourrez réutiliser ce lien personnel pendant toute sa période de validité."
  }
};

function safeEqual(a, b) {
  if (a.length !== b.length) return false;

  let diff = 0;

  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}

async function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  let timestamp = null;
  const signatures = [];

  for (const part of signatureHeader.split(",")) {
    const separator = part.indexOf("=");

    if (separator === -1) continue;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (key === "t") {
      timestamp = Number(value);
    }

    if (key === "v1") {
      signatures.push(value);
    }
  }

  if (!timestamp || signatures.length === 0) return false;

  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(`${timestamp}.${rawBody}`)
  );

  const expectedSignature = Array.from(
    new Uint8Array(signatureBuffer)
  )
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  return signatures.some(signature =>
    safeEqual(expectedSignature, signature)
  );
}

function normalizeLang(value) {
  return ["pt", "de", "fr"].includes(value) ? value : "en";
}

function buildEmail({
  lang,
  route,
  accessToken,
  expiresAt
}) {
  const text = EMAIL_TEXT[lang] || EMAIL_TEXT.en;
  const routeName = ROUTE_NAMES[route];

  const expiryDate = new Intl.DateTimeFormat(
    text.locale,
    {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(new Date(expiresAt * 1000));

  const accessUrl =
    "https://cruisestop.eu/access.html?lang=" +
    encodeURIComponent(lang) +
    "&token=" +
    encodeURIComponent(accessToken);

  const html = `
    <div style="background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#182033;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">

        <div style="color:#062f73;font-size:26px;font-weight:700;margin-bottom:28px;">
          CRUISESTOP
        </div>

        <h1 style="color:#062f73;font-size:25px;margin:0 0 12px;">
          ${text.title}
        </h1>

        <p style="font-size:16px;line-height:1.6;margin-bottom:24px;">
          ${text.intro}
        </p>

        <div style="background:#f6f8fb;border-radius:12px;padding:18px;margin-bottom:26px;">
          <p style="margin:0 0 9px;">
            <strong>${text.routeLabel}:</strong> ${routeName}
          </p>

          <p style="margin:0 0 9px;">
            <strong>${text.validLabel}:</strong> ${expiryDate}
          </p>

          <p style="margin:0;">
            ${text.devices}
          </p>
        </div>

        <div style="text-align:center;margin:28px 0;">
          <a
            href="${accessUrl}"
            style="display:inline-block;background:#062f73;color:#ffffff;text-decoration:none;font-weight:700;padding:15px 28px;border-radius:10px;"
          >
            ${text.button}
          </a>
        </div>

        <p style="font-size:14px;line-height:1.6;color:#5d6470;">
          ${text.keep}
        </p>

        <p style="font-size:12px;color:#8a9099;margin-top:30px;">
          CruiseStop · Funchal, Madeira
        </p>

      </div>
    </div>
  `;

  const plainText =
`${text.title}

${text.routeLabel}: ${routeName}
${text.validLabel}: ${expiryDate}
${text.devices}

${accessUrl}

${text.keep}

CruiseStop · Funchal, Madeira`;

  return {
    subject: text.subject,
    html,
    plainText
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  const signatureHeader =
    request.headers.get("Stripe-Signature");

  const signatureValid =
    await verifyStripeSignature(
      rawBody,
      signatureHeader,
      env.STRIPE_WEBHOOK_SECRET
    );

  if (!signatureValid) {
    return Response.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({
      received: true,
      ignored: true
    });
  }

  const session = event.data?.object;

  if (!session?.id) {
    return Response.json(
      { error: "Missing Checkout Session" },
      { status: 400 }
    );
  }

  if (session.payment_status !== "paid") {
    return Response.json({
      received: true,
      ignored: "not_paid"
    });
  }

  if (!env.ACCESS_DB) {
    return Response.json(
      { error: "Access database not configured" },
      { status: 500 }
    );
  }

  if (!env.RESEND_API_KEY) {
    return Response.json(
      { error: "Resend not configured" },
      { status: 500 }
    );
  }

  const sessionId = session.id;
  const route = session.metadata?.route || null;
  const lang = normalizeLang(session.metadata?.lang);

  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    null;

  if (!route || !ROUTE_NAMES[route]) {
    return Response.json(
      { error: "Invalid route metadata" },
      { status: 400 }
    );
  }

  const purchasedAt = Number(session.created);

  if (!Number.isFinite(purchasedAt)) {
    return Response.json(
      { error: "Invalid purchase date" },
      { status: 400 }
    );
  }

  const expiresAt =
    purchasedAt + 30 * 24 * 60 * 60;

  let purchase = await env.ACCESS_DB
    .prepare(`
      SELECT
        access_token,
        customer_email,
        lang,
        email_sent_at,
        email_id
      FROM purchases
      WHERE session_id = ?
    `)
    .bind(sessionId)
    .first();

  if (!purchase) {
    const accessToken =
      crypto.randomUUID().replace(/-/g, "");

    await env.ACCESS_DB
      .prepare(`
        INSERT OR IGNORE INTO purchases
        (
          session_id,
          access_token,
          route,
          customer_email,
          purchased_at,
          expires_at,
          lang
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        sessionId,
        accessToken,
        route,
        customerEmail,
        purchasedAt,
        expiresAt,
        lang
      )
      .run();
  }

  await env.ACCESS_DB
    .prepare(`
      UPDATE purchases
      SET
        customer_email = COALESCE(?, customer_email),
        lang = COALESCE(?, lang)
      WHERE session_id = ?
    `)
    .bind(
      customerEmail,
      lang,
      sessionId
    )
    .run();

  purchase = await env.ACCESS_DB
    .prepare(`
      SELECT
        access_token,
        customer_email,
        lang,
        email_sent_at,
        email_id
      FROM purchases
      WHERE session_id = ?
    `)
    .bind(sessionId)
    .first();

  if (!purchase?.access_token) {
    return Response.json(
      { error: "Could not create purchase access" },
      { status: 500 }
    );
  }

  if (
    purchase.email_sent_at !== null &&
    purchase.email_sent_at !== undefined
  ) {
    return Response.json({
      received: true,
      emailAlreadySent: true,
      emailId: purchase.email_id || null
    });
  }

  const destinationEmail =
    customerEmail || purchase.customer_email;

  if (!destinationEmail) {
    return Response.json({
      received: true,
      emailSkipped: "missing_email"
    });
  }

  const email = buildEmail({
    lang,
    route,
    accessToken: purchase.access_token,
    expiresAt
  });

  const resendResponse = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        "Authorization":
          `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "CruiseStop/1.0",
        "Idempotency-Key":
          `route-access/${sessionId}`
      },

      body: JSON.stringify({
        from:
          "CruiseStop <access@send.cruisestop.eu>",

        to: [
          destinationEmail
        ],

        subject:
          email.subject,

        html:
          email.html,

        text:
          email.plainText
      })
    }
  );

  const resendResult =
    await resendResponse.json();

  if (!resendResponse.ok) {
    console.error(
      "Resend webhook error:",
      resendResult
    );

    return Response.json(
      {
        error: "Email delivery failed",
        details: resendResult
      },
      { status: 500 }
    );
  }

  await env.ACCESS_DB
    .prepare(`
      UPDATE purchases
      SET
        email_sent_at = unixepoch(),
        email_id = ?
      WHERE session_id = ?
    `)
    .bind(
      resendResult.id || null,
      sessionId
    )
    .run();

  return Response.json({
    received: true,
    emailSent: true,
    emailId: resendResult.id || null
  });
}