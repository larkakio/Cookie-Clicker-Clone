import { describe, expect, it } from "vitest";
import { LEVELS, shouldCompleteLevel } from "@/lib/game/levels";

describe("level progression", () => {
  it("does not complete level 1 below target lifetime", () => {
    expect(shouldCompleteLevel(1, LEVELS[0].targetLifetime - 1)).toBe(false);
  });

  it("completes level 1 at target lifetime", () => {
    expect(shouldCompleteLevel(1, LEVELS[0].targetLifetime)).toBe(true);
  });

  it("completes level 2 only at its threshold", () => {
    expect(shouldCompleteLevel(2, LEVELS[1].targetLifetime - 1)).toBe(false);
    expect(shouldCompleteLevel(2, LEVELS[1].targetLifetime)).toBe(true);
  });
});
