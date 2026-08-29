import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-vk flex min-h-screen flex-col justify-center pt-24">
      <p className="eyebrow mb-4">404</p>
      <h1 className="section-title">Cette page n&apos;existe pas.</h1>
      <Link href="/" className="mt-8 text-sm font-semibold underline underline-offset-4">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
