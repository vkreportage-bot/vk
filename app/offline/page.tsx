import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="container-vk flex min-h-screen flex-col items-start justify-center py-24">
      <p className="text-sm uppercase tracking-[0.2em] text-black/50">VK</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Vous êtes hors ligne.</h1>
      <p className="mt-4 max-w-xl text-black/60">
        Cette page n’est pas disponible sans connexion. Reconnectez-vous puis réessayez.
      </p>
      <Link href="/" className="mt-8 underline underline-offset-4">
        Retour à l’accueil
      </Link>
    </div>
  );
}
