"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushNotificationSettings() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(isSupported);

    if (!isSupported) return;

    setPermission(Notification.permission);

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setSubscribed(Boolean(subscription)))
      .catch(() => setSubscribed(false));
  }, []);

  async function enable() {
    setBusy(true);
    setMessage("");

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Clé VAPID publique manquante.");
      }

      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        throw new Error("Les notifications n'ont pas été autorisées.");
      }

      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const json = subscription.toJSON();

      const response = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: json.keys?.p256dh,
            auth: json.keys?.auth,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible d'enregistrer cet appareil.");
      }

      setSubscribed(true);
      setMessage("Notifications activées sur cet appareil.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'activer les notifications."
      );
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/admin/push/subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        await subscription.unsubscribe();
      }

      setSubscribed(false);
      setMessage("Notifications désactivées sur cet appareil.");
    } catch {
      setMessage("Impossible de désactiver les notifications.");
    } finally {
      setBusy(false);
    }
  }

  if (supported === null) {
    return null;
  }

  if (!supported) {
    return (
      <p className="text-sm text-black/50">
        Les notifications Push ne sont pas disponibles sur ce navigateur.
      </p>
    );
  }

  return (
    <section className="border border-black/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium">Notifications messages</h2>
          <p className="mt-1 text-sm text-black/45">
            Recevoir une alerte lorsqu'un visiteur envoie un message.
          </p>
        </div>

        <button
          type="button"
          disabled={busy || permission === "denied"}
          onClick={subscribed ? disable : enable}
          className="min-h-11 border border-black px-4 text-sm transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy
            ? "Mise à jour…"
            : subscribed
              ? "Désactiver"
              : "Activer"}
        </button>
      </div>

      {permission === "denied" ? (
        <p className="mt-4 text-sm text-red-700">
          Les notifications sont bloquées dans les réglages du navigateur.
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 text-sm text-black/55" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
