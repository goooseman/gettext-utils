import importStrings from "@src/importStrings";
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

it("can optimize translations if boolean flag is passed", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, "translations.json");
  await importStrings("__fixtures__/po", filePath, true);

  const file = JSON.parse(
    fse.readFileSync(filePath, "utf-8"),
  ) as TranslationsMap;
  expect(file).toMatchSnapshot();

  const translation = file.en;
  expect(translation).not.toHaveProperty("charset");
  expect(Object.keys(translation.headers)).toHaveLength(1);
  expect(translation.headers).toHaveProperty("plural-forms");

  const message = translation.translations["lion.females"]["one female lion"];
  expect(message).not.toHaveProperty("msgid");
  expect(message).not.toHaveProperty("comments");
});
