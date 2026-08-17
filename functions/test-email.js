export async function onRequestPost(context) {
  const { request, env } = context;

  const suppliedToken = request.headers.get("X-Test-Token");

  if (
    !env.EMAIL_TEST_TOKEN ||
    !suppliedToken ||
    suppliedToken !== env.EMAIL_TEST_TOKEN
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!env.RESEND_API_KEY || !env.EMAIL_TEST_TO) {
    return Response.json(
      { error: "Email configuration missing" },
      { status: 500 }
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "CruiseStop <access@send.cruisestop.eu>",
      to: [env.EMAIL_TEST_TO],
      subject: "CruiseStop email test",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;">
          <h1 style="color:#062f73;">CruiseStop</h1>

          <h2>Email system is working ✅</h2>

          <p>
            This is a test email sent securely from
            <strong>cruisestop.eu</strong>.
          </p>

          <p>
            The next step will be to send the customer's personal
            route access link automatically after payment.
          </p>

          <p style="color:#666;font-size:13px;">
            CruiseStop · Funchal, Madeira
          </p>
        </div>
      `
    })
  });

  const result = await resendResponse.json();

  if (!resendResponse.ok) {
    return Response.json(
      {
        error: "Resend error",
        details: result
      },
      { status: resendResponse.status }
    );
  }

  return Response.json({
    sent: true,
    emailId: result.id
  });
}
