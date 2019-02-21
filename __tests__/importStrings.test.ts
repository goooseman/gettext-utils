import { importStrings } from "@src/main";
import { getTmpPath, readFileFromTmp } from "__helpers__/fs";

it("should generate node-gettext .json files from .po files", async () => {
  const tmpPath = await getTmpPath();
  await importStrings("__fixtures__/po", tmpPath);

  const file = readFileFromTmp(tmpPath, "translations.json");
  expect(file).toMatchSnapshot();
  const localesToCheck = ["he", "fr", "ru"];
  for (const localeToCheck of localesToCheck) {
    expect(JSON.parse(file)).toHaveProperty(localeToCheck);
  }
});
