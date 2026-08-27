import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { iconify } = vi.hoisted(() => ({ iconify: vi.fn((props) => <svg data-testid="iconify" {...props} />) }));

vi.mock("@iconify/react", () => ({ Icon: iconify }));
vi.mock("@/shared/assets/icons/mail-ru.svg?react", () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mail-ru" {...props} />,
}));
vi.mock("@/shared/assets/icons/yandex.svg?react", () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="yandex" {...props} />,
}));

import { Icon } from "./icon";

describe("Icon", () => {
  it("uses local SVG components for branded names and Iconify for all other names", () => {
    // Init
    const { rerender, getByTestId, queryByTestId } = render(
      <Icon name="yandex" size={32} className="brand" />,
    );

    // Action
    rerender(<Icon name="ph:heart" size={16} className="remote" />);

    // Assert
    expect(queryByTestId("yandex")).not.toBeInTheDocument();
    expect(getByTestId("iconify")).toHaveAttribute("icon", "ph:heart");
    expect(iconify).toHaveBeenLastCalledWith(
      expect.objectContaining({ width: 16, height: 16, className: expect.stringContaining("remote") }),
      expect.any(Object),
    );
  });
});
