"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/dictionaries";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-azure focus:bg-white focus:outline-none";

export function ContactForm({ t, email }: { t: Dictionary["contact"]; email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="sheet space-y-5 p-6 sm:p-9">
      <p className="text-lg text-muted">{t.intro}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {t.name}
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium">
          {t.email}
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        {t.message}
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={`${field} resize-y`} />
      </label>
      {/* Honeypot for bots; hidden from people. */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-scarlet px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.send}
        </button>
        <p aria-live="polite" className="text-sm">
          {status === "sent" && <span className="text-azure">{t.sent}</span>}
          {status === "error" && (
            <>
              {t.error}{" "}
              <a href={`mailto:${email}`} className="font-medium text-scarlet underline">
                {email}
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
