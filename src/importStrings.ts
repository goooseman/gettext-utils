import * as fse from "fs-extra";
import { po } from "gettext-parser";
import * as glob from "glob";
import * as path from "path";

import { optimizeAllTranslations } from "./utils/optimizeTranslations";

export const getPoParsed = async (pathToPo: string) => {
  const file = await fse.readFile(pathToPo);
  return po.parse(file.toString());
};

export const getTranslations = async (poFilesPath: string) => {
  const poFilesPaths = glob.sync(path.join(poFilesPath, "*.po"));
  const translations: TranslationsMap = {};
  for (const poFilePath of poFilesPaths) {
    const locale = path.basename(poFilePath, path.extname(poFilePath));
    translations[locale] = await getPoParsed(poFilePath);
  }
  return translations;
};

const writeTranslationsByLocale = async (
  translations: TranslationsMap,
  outputFilePath: string,
) => {
  const extname = path.extname(outputFilePath).replace(".", "");
  // If file path was passed instead of a folder, then remove it's
  // extension, create a folder by its path and put translations there
  const localeOutputPath = extname
    ? outputFilePath.replace(new RegExp(`(\.${extname})$`, "gi"), "")
    : outputFilePath;
  await fse.mkdirp(localeOutputPath);

  for (const locale of Object.keys(translations)) {
    await fse.writeFile(
      path.join(localeOutputPath, `./${locale}.json`),
      JSON.stringify(translations[locale]),
    );
  }
};

const importStrings = async (
  poFilesDirPath: string,
  outputFilePath: string,
  optimize?: boolean,
  splitByLocale?: boolean,
) => {
  const translations = await getTranslations(poFilesDirPath);
  const finalTranslations = optimize
    ? optimizeAllTranslations(translations)
    : translations;
  await fse.mkdirp(path.dirname(outputFilePath));

  if (splitByLocale) {
    await writeTranslationsByLocale(finalTranslations, outputFilePath);
  } else {
    await fse.writeFile(outputFilePath, JSON.stringify(finalTranslations));
  }
};

export default importStrings;
