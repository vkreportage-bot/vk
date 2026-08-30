import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.filter(Boolean).map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, rawHref] = link;
      const href = /^(https?:\/\/|\/|mailto:)/.test(rawHref) ? rawHref : "#";
      const external = href.startsWith("http");

      return (
        <a
          key={index}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

export function BlogContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-8 text-[17px] leading-8 text-black/75 md:text-lg md:leading-9">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed === "---") {
          return <hr key={index} className="my-12 border-black/15" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="pt-3 text-2xl font-medium leading-tight tracking-[-0.035em] text-black md:text-3xl"
            >
              {renderInline(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-6 text-3xl font-medium leading-[1.05] tracking-[-0.045em] text-black md:text-5xl"
            >
              {renderInline(trimmed.slice(3))}
            </h2>
          );
        }

        const lines = trimmed.split("\n");

        if (lines.every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={index} className="space-y-3 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-disc pl-2">
                  {renderInline(line.trim().slice(2))}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s/.test(line.trim()))) {
          return (
            <ol key={index} className="space-y-3 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-decimal pl-2">
                  {renderInline(line.trim().replace(/^\d+\.\s/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => line.trim().startsWith("> "))) {
          return (
            <blockquote
              key={index}
              className="border-l border-black/30 py-1 pl-6 text-xl leading-9 tracking-[-0.02em] text-black md:text-2xl"
            >
              {renderInline(lines.map((line) => line.trim().slice(2)).join(" "))}
            </blockquote>
          );
        }

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
