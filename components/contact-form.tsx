"use client";

import { FormEvent, useState } from "react";

type FormState = {
  status: "idle" | "sending" | "success" | "error";
  message: string;
};

export function ContactForm() {
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({
      status: "sending",
      message: "Envoi en cours…",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Impossible d'envoyer le message.");
      }

      form.reset();

      setState({
        status: "success",
        message: data.message || "Votre message a bien été envoyé.",
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue. Merci de réessayer.",
      });
    }
  }

  const disabled = state.status === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span>Nom *</span>
          <input
            required
            minLength={2}
            maxLength={120}
            name="name"
            autoComplete="name"
            className="min-h-12 border border-black/15 bg-transparent px-4 outline-none transition focus:border-black"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span>E-mail *</span>
          <input
            required
            maxLength={254}
            type="email"
            name="email"
            autoComplete="email"
            className="min-h-12 border border-black/15 bg-transparent px-4 outline-none transition focus:border-black"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span>Téléphone</span>
          <input
            maxLength={40}
            type="tel"
            name="phone"
            autoComplete="tel"
            className="min-h-12 border border-black/15 bg-transparent px-4 outline-none transition focus:border-black"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span>Sujet</span>
          <input
            maxLength={160}
            name="subject"
            className="min-h-12 border border-black/15 bg-transparent px-4 outline-none transition focus:border-black"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span>Message *</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          name="message"
          rows={8}
          className="resize-y border border-black/15 bg-transparent px-4 py-3 outline-none transition focus:border-black"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          disabled={disabled}
          type="submit"
          className="min-h-12 bg-[#101010] px-7 text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Envoi…" : "Envoyer"}
        </button>

        {state.message ? (
          <p
            role="status"
            aria-live="polite"
            className={
              state.status === "error"
                ? "text-sm text-red-700"
                : "text-sm text-black/60"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
