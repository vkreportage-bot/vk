import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="container-vk flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="eyebrow mb-5">VK</p>
      <h1 className="section-title max-w-4xl">Vous êtes hors ligne.</h1>
      <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
        Cette page n’est pas disponible sans connexion. Reconnectez-vous puis
        réessayez.
      </p>
      <Link
        href="/"
        className="mt-8 border-b border-black pb-1 text-sm font-semibold uppercase tracking-[0.14em]"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
