import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot must stay empty
  locale: z.enum(["sl", "en", "de"]).optional(),
});

// Simple per-IP throttle: 5 messages per 10 minutes per server instance.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (throttled(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", issues: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot filled: pretend success so bots learn nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[contact] SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `[haja.si] ${data.subject || "Povpraševanje"} – ${data.name}`;
  const lines = [
    `Ime / podjetje: ${data.name}`,
    `E-pošta: ${data.email}`,
    `Telefon: ${data.phone || "-"}`,
    `Zadeva: ${data.subject || "-"}`,
    `Jezik strani: ${data.locale || "-"}`,
    `IP: ${ip}`,
    "",
    data.message,
  ];

  try {
    await transporter.sendMail({
      from: CONTACT_FROM || SMTP_USER,
      to: CONTACT_TO || site.email,
      replyTo: `${data.name} <${data.email}>`,
      subject,
      text: lines.join("\n"),
      html: `<pre style="font: 14px/1.5 -apple-system, Segoe UI, sans-serif; white-space: pre-wrap">${escapeHtml(
        lines.join("\n"),
      )}</pre>`,
    });
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
