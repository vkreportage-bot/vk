import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function safeHref(href?: string) {
  if (!href) return "#";

  return /^(https?:\/\/|\/|#|mailto:|tel:)/.test(href) ? href : "#";
}

type BlogContentProps = {
  content: string;
  compact?: boolean;
};

export function BlogContent({
  content,
  compact = false,
}: BlogContentProps) {
  const h2Class = compact
    ? "pt-3 text-xl font-medium leading-tight tracking-[-0.03em] text-black"
    : "pt-5 text-2xl font-medium leading-[1.1] tracking-[-0.035em] text-black md:text-3xl";

  const h3Class = compact
    ? "pt-2 text-lg font-medium leading-tight tracking-[-0.025em] text-black"
    : "pt-4 text-xl font-medium leading-[1.15] tracking-[-0.03em] text-black md:text-2xl";

  return (
    <div
      className={
        compact
          ? "space-y-4 text-sm leading-6 text-black/70"
          : "space-y-5 text-[17px] leading-7 text-black/75 md:text-[18px] md:leading-8"
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className={h2Class}>{children}</h2>
          ),

          h2: ({ children }) => (
            <h2 className={h2Class}>{children}</h2>
          ),

          h3: ({ children }) => (
            <h3 className={h3Class}>{children}</h3>
          ),

          h4: ({ children }) => (
            <h4 className="pt-3 text-lg font-semibold leading-tight tracking-[-0.02em] text-black md:text-xl">
              {children}
            </h4>
          ),

          p: ({ children }) => <p>{children}</p>,

          strong: ({ children }) => (
            <strong className="font-semibold text-black">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),

          ul: ({ children }) => (
            <ul className="space-y-1.5 pl-5">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="space-y-1.5 pl-5">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="list-outside pl-2 marker:text-black/35">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote
              className={
                compact
                  ? "border-l border-black/25 py-1 pl-4 text-base leading-6 text-black"
                  : "border-l border-black/30 py-1 pl-6 text-lg leading-7 tracking-[-0.02em] text-black md:text-xl md:leading-8"
              }
            >
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => {
            const safe = safeHref(href);
            const external = safe.startsWith("http");

            return (
              <a
                href={safe}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
              >
                {children}
              </a>
            );
          },

          hr: () => (
            <hr className="my-8 border-black/15" />
          ),

          code: ({ children }) => (
            <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-[0.88em] text-black">
              {children}
            </code>
          ),

          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-xl bg-black p-4 text-sm leading-6 text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
              {children}
            </pre>
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="border-b border-black/20 text-black">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-black/10">
              {children}
            </tbody>
          ),

          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-3 py-2 align-top">
              {children}
            </td>
          ),

          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") {
              return null;
            }

            return (
              <div className="relative my-6 w-full overflow-hidden">
                <Image
                  src={src}
                  alt={alt ?? ""}
                  width={1600}
                  height={1067}
                  sizes="(min-width: 1280px) 900px, (min-width: 768px) 80vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}