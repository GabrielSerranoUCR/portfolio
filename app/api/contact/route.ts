import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Simple in-memory rate limit; fine for a single VPS process.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (body.company) return Response.json({ ok: true });

  const name = typeof body.name === "string" ? body.name.replace(/[\r\n]+/g, " ").trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 100 || !EMAIL_RE.test(email) || email.length > 200 || message.length < 10 || message.length > 5000) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT = "465", SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("Contact form: SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO must be set");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM ?? SMTP_USER,
      to: CONTACT_TO,
      replyTo: { name, address: email },
      subject: `Portfolio postcard from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
  } catch (error) {
    console.error("Contact form: failed to send", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
