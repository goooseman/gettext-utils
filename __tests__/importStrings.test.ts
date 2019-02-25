import { importStrings } from "@src/main";
import { getTmpPath } from "__helpers__/fs";
import * as fse from "fs-extra";
import * as path from "path";

it("should generate node-gettext .json files from .po files", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, "translations.json");
  await importStrings("__fixtures__/po", filePath);

  const file = JSON.parse(fse.readFileSync(filePath, "utf-8"));
  expect(file).toMatchSnapshot();
  const localesToCheck = ["he", "fr", "ru"];
  for (const localeToCheck of localesToCheck) {
    expect(file).toHaveProperty(localeToCheck);
  }
});
