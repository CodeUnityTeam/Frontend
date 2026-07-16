import { cn } from "@/shared/lib/utils";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import "highlight.js/styles/github.css";

type MarkdownViewerProps = {
  markdown: string;
  className?: string;
  imageVariant?: "full" | "thumbnail";
};

type MarkdownImage = {
  alt: string;
  src: string;
};

const markdownImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;

function extractMarkdownImages(markdown: string): MarkdownImage[] {
  return Array.from(markdown.matchAll(markdownImagePattern), ([, alt, rawSrc]) => ({
    alt,
    src: rawSrc.trim().split(/\s+/)[0] ?? "",
  })).filter((image) => image.src.length > 0);
}

function stripMarkdownImages(markdown: string) {
  return markdown
    .replace(markdownImagePattern, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const markdownComponents = (imageVariant: "full" | "thumbnail"): Components => ({
  a: ({ className, ...props }) => (
    <a
      {...props}
      className={cn(
        "font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary-hover",
        className,
      )}
      target="_blank"
      rel="noreferrer noopener"
    />
  ),
  p: ({ className, ...props }) => (
    <p
      {...props}
      className={cn("my-3 leading-7 first:mt-0 last:mb-0", className)}
    />
  ),
  h1: ({ className, ...props }) => (
    <h1
      {...props}
      className={cn(
        "mt-6 mb-3 text-3xl leading-tight font-bold first:mt-0",
        className,
      )}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      {...props}
      className={cn(
        "mt-6 mb-3 text-2xl leading-tight font-bold first:mt-0",
        className,
      )}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      {...props}
      className={cn("mt-5 mb-2 text-xl leading-tight font-semibold", className)}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      {...props}
      className={cn("mt-4 mb-2 text-lg leading-tight font-semibold", className)}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      {...props}
      className={cn(
        "my-3 list-disc space-y-2 pl-6 leading-7 first:mt-0",
        className,
      )}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      {...props}
      className={cn(
        "my-3 list-decimal space-y-2 pl-6 leading-7 first:mt-0",
        className,
      )}
    />
  ),
  li: ({ className, ...props }) => (
    <li {...props} className={cn("leading-7", className)} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "my-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground",
        className,
      )}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");

    if (isInline) {
      return (
        <code
          {...props}
          className={cn(
            "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.95em] text-foreground",
            className,
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        className={cn("font-mono text-[0.95em]", className)}
      >
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      {...props}
      className={cn(
        "my-4 overflow-x-auto rounded-2xl border border-border bg-muted px-4 py-3 text-sm leading-6 shadow-sm",
        className,
      )}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-4 w-full overflow-x-auto">
      <table
        {...props}
        className={cn("w-full border-collapse text-left", className)}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      {...props}
      className={cn(
        "border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground",
        className,
      )}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      {...props}
      className={cn("border border-border px-3 py-2 align-top", className)}
    />
  ),
  img: ({ className, alt, ...props }) => (
    <img
      {...props}
      alt={alt ?? ""}
      loading="lazy"
      className={cn(
        "my-4",
        className,
      )}
      style={
        imageVariant === "thumbnail"
          ? {
              display: "inline-block",
              maxHeight: "4.5rem",
              maxWidth: "6.5rem",
              width: "auto",
              objectFit: "contain",
              verticalAlign: "top",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: 0,
            }
          : {
              maxHeight: "32rem",
              width: "100%",
              objectFit: "contain",
              borderRadius: 0,
            }
      }
    />
  ),
  hr: ({ className, ...props }) => (
    <hr {...props} className={cn("my-6 border-border", className)} />
  ),
});

export function MarkdownViewer({
  markdown,
  className,
  imageVariant = "full",
}: MarkdownViewerProps) {
  if (!markdown.trim()) {
    return null;
  }

  const compactImages =
    imageVariant === "thumbnail" ? extractMarkdownImages(markdown) : [];
  const markdownBody =
    imageVariant === "thumbnail" ? stripMarkdownImages(markdown) : markdown;

  return (
    <div className={cn("markdown-viewer wrap-break-word", className)}>
      {markdownBody && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents(imageVariant)}
        >
          {markdownBody}
        </ReactMarkdown>
      )}

      {compactImages.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 overflow-hidden">
          {compactImages.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="block h-auto shrink-0"
              style={{
                maxHeight: "4.5rem",
                maxWidth: "6.5rem",
                objectFit: "contain",
                borderRadius: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
