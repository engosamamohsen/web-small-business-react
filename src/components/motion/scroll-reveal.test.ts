import { describe, expect, it } from "vitest";
import { revealProps } from "./scroll-reveal";

describe("revealProps", () => {
  it("marks an element for the scroll reveal", () => {
    expect(revealProps()).toEqual({ "data-reveal": "" });
  });

  it("passes the cascade position to CSS as --ct-i", () => {
    expect(revealProps(3)).toEqual({
      "data-reveal": "",
      style: { "--ct-i": 3 },
    });
  });
});
