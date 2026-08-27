import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownViewer } from "./markdown-viewer";

describe("MarkdownViewer", () => {
  it("renders standard Markdown, highlighted code, and hardened external links", () => {
    // Init
    const markdown = "# Heading\n\n[Documentation](https://example.com)\n\n`inline`\n\n```ts\nconst value = 1;\n```\n\n| Name | Value |\n| --- | --- |\n| React | 18 |";

    // Action
    render(<MarkdownViewer markdown={markdown} className="custom-viewer" />);

    // Assert
    expect(screen.getByRole("heading", { name: "Heading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText("inline").tagName).toBe("CODE");
    expect(screen.getByText((_, element) => element?.tagName === "CODE" && element.textContent === "const value = 1;\n")).toHaveClass("hljs");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(document.querySelector(".custom-viewer")).toBeInTheDocument();
  });

  it("renders whitespace that contains a Markdown line break", () => {
    // Init
    const { container } = render(<MarkdownViewer markdown=" \n\t " />);

    // Action
    const viewer = container.firstChild;

    // Assert
    expect(viewer).toHaveClass("markdown-viewer");
    expect(viewer?.querySelector("p")).toBeInTheDocument();
  });

  it("extracts Markdown images into compact thumbnails without duplicating image content", () => {
    // Init
    const markdown = "Intro\n\n![First image]( /first.png )\n![Second image](/second.png \"title\")";

    // Action
    render(<MarkdownViewer markdown={markdown} imageVariant="thumbnail" />);

    // Assert
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByAltText("First image")).toHaveAttribute("src", "/first.png");
    expect(screen.getByAltText("Second image")).toHaveAttribute("src", "/second.png");
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("renders inline images at full width by default", () => {
    // Init
    const markdown = "![Diagram](/diagram.png)";

    // Action
    render(<MarkdownViewer markdown={markdown} />);

    // Assert
    expect(screen.getByAltText("Diagram")).toHaveStyle({ maxHeight: "32rem", width: "100%" });
    expect(screen.getByAltText("Diagram")).toHaveAttribute("loading", "lazy");
  });
});
