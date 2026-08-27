import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { api, useEmblaCarousel } = vi.hoisted(() => {
  const listeners = new Map<string, (instance: unknown) => void>();
  const api = {
    canScrollPrev: vi.fn(() => false),
    canScrollNext: vi.fn(() => true),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((event, listener) => listeners.set(event, listener)),
    off: vi.fn(),
  };
  return { api, useEmblaCarousel: vi.fn(() => [vi.fn(), api]) };
});

vi.mock("embla-carousel-react", () => ({ default: useEmblaCarousel }));

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

describe("Carousel", () => {
  it("exposes carousel semantics and maps keyboard and controls to the Embla API", async () => {
    // Init
    const user = userEvent.setup();
    render(
      <Carousel aria-label="Featured work">
        <CarouselContent><CarouselItem>One</CarouselItem></CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    const carousel = screen.getByRole("region", { name: "Featured work" });

    // Action
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    await user.click(screen.getByRole("button", { name: "Next slide" }));

    // Assert
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group")).toHaveAttribute("aria-roledescription", "slide");
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(api.scrollNext).toHaveBeenCalledTimes(2);
  });
});
