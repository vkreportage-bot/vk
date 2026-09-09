"use client";

import Link from "next/link";
import { ExternalLink, Loader2, Wrench } from "lucide-react";
import { useState } from "react";

export function MaintenanceToggle({
  initialEnabled
}: {
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleMaintenance() {
    const previous = enabled;
    const next = !enabled;

    setEnabled(next);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ enabled: next })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(payload?.error || "Impossible de modifier le mode maintenance.");
      }
    } catch (err) {
      setEnabled(previous);
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier le mode maintenance."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border-b border-black/10 py-6 sm:py-8">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-black/[0.055] text-black/65">
                <Wrench size={17} strokeWidth={1.8} />
              </span>

              <div>
                <p className="text-sm font-semibold tracking-[-0.02em]">
                  Mode maintenance
                </p>
                <p className="mt-1 text-xs text-black/45">
                  {enabled
                    ? "Le site public affiche actuellement la page de maintenance."
                    : "Le site public est actuellement accessible normalement."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`text-xs font-medium ${
                enabled ? "text-black" : "text-black/40"
              }`}
            >
              {saving ? "Enregistrement…" : enabled ? "Activé" : "Désactivé"}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Activer ou désactiver le mode maintenance"
              disabled={saving}
              onClick={toggleMaintenance}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 disabled:cursor-wait disabled:opacity-60 ${
                enabled ? "bg-black" : "bg-black/15"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {saving ? (
                  <Loader2 size={12} className="animate-spin text-black/55" />
                ) : null}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
          <Link
            href="/maintenance"
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-medium text-black/55 transition hover:text-black"
          >
            Prévisualiser la page de maintenance
            <ExternalLink size={13} />
          </Link>

          {error ? (
            <p className="text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
