import { getPackageNameAndVersion } from "./packageInfo";

test("should return current package's name and version", async () => {
  const nameVersion = await getPackageNameAndVersion();
  expect(nameVersion).toMatch(/^gettext-utils \d.\d.\d$/);
});

test("should return false if could not extract version from package.json", async () => {
  const spy = jest.spyOn(process, "cwd");
  spy.mockImplementationOnce(() => "/home");

  const nameVersion = await getPackageNameAndVersion();
  expect(nameVersion).toEqual(false);

  spy.mockReset();
});
