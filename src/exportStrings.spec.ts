import { isDefaultLocale } from "./exportStrings";

describe("isDefaultLocale", () => {
  test("it should return true", () => {
    expect(isDefaultLocale("foo/bar/en.po", "en")).toBe(true);
  });
  test("it should return false", () => {
    expect(isDefaultLocale("foo/bar/pl.po", "en")).toBe(false);
  });

  test("it should return false if locale is undefined", () => {
    expect(isDefaultLocale("foo/bar/pl.po")).toBe(false);
  });
});
