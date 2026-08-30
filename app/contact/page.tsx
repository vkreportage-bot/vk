// import type { Metadata } from "next";
// import { siteConfig } from "@/lib/site";

// export const metadata: Metadata = {
//   title: "Contact",
//   description: "Contacter VK pour un projet vidéo, un mariage, un événement ou une collaboration."
// };

// export default function ContactPage() {
//   return (
//     <div className="container-vk min-h-screen pb-24 pt-36 md:pt-44">
//       <p className="eyebrow mb-5">Contact</p>
//       <h1 className="section-title max-w-5xl">Un projet à raconter ?</h1>

//       <div className="mt-14 grid gap-10 border-t hairline pt-10 md:grid-cols-12">
//         <p className="text-sm text-[var(--muted)] md:col-span-3">
//           Décrivez simplement le projet, le lieu et la date envisagée.
//         </p>
//         <div className="md:col-span-7 md:col-start-5">
//           <a
//             href={`mailto:${siteConfig.email}`}
//             className="block border-b hairline pb-4 text-2xl tracking-[-0.03em] md:text-4xl"
//           >
//             {siteConfig.email}
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter VK pour un projet vidéo, un mariage, un événement ou une collaboration."
};

type ContactSearchParams = Promise<{
  sent?: string;
  error?: string;
}>;

const fieldClassName =
  "w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none transition placeholder:text-black/30 focus:border-black";

export default async function ContactPage({
  searchParams
}: {
  searchParams: ContactSearchParams;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const hasError = Boolean(params.error);

  return (
    <div className="container-vk min-h-screen pb-24 pt-28 md:pt-36">
      <header className="max-w-5xl">
        <p className="eyebrow mb-5">Contact</p>
        <h1 className="section-title">Un projet à raconter ?</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-(--muted) md:text-base">
          Mariage, événement, film de marque ou projet personnel : décrivez votre
          idée, le lieu et la date envisagée. VK vous répondra directement.
        </p>
      </header>

      <div className="mt-14 grid gap-12 border-t hairline pt-10 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-black/40">
            Contact direct
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-block break-all text-sm underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </aside>

        <section className="md:col-span-7 md:col-start-5">
          {sent ? (
            <div
              role="status"
              className="mb-8 border border-black/15 bg-black/2.5 p-5 text-sm leading-6"
            >
              Votre message a bien été envoyé. Merci, nous revenons vers vous
              rapidement.
            </div>
          ) : null}

          {hasError ? (
            <div
              role="alert"
              className="mb-8 border border-black/15 p-5 text-sm leading-6"
            >
              Le message n’a pas pu être envoyé. Vérifiez les champs puis
              réessayez.
            </div>
          ) : null}

          <form action="/api/contact" method="post" className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-black/45">
                  Nom *
                </span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  className={fieldClassName}
                  placeholder="Votre nom"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-black/45">
                  E-mail *
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className={fieldClassName}
                  placeholder="vous@exemple.fr"
                />
              </label>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-black/45">
                  Téléphone
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  className={fieldClassName}
                  placeholder="06…"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-black/45">
                  Sujet
                </span>
                <input
                  name="subject"
                  type="text"
                  maxLength={160}
                  className={fieldClassName}
                  placeholder="Mariage, événement, collaboration…"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-black/45">
                Message *
              </span>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={7}
                className={`${fieldClassName} resize-y leading-7`}
                placeholder="Parlez-nous du projet, du lieu, de la date et de vos attentes."
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center bg-black px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-70"
            >
              Envoyer le message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
