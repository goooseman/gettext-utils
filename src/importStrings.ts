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

const importStrings = async (
  poFilesDirPath: string,
  outputFilePath: string,
  optimize?: boolean,
) => {
  const translations = await getTranslations(poFilesDirPath);
  const finalTranslations = optimize
    ? optimizeAllTranslations(translations)
    : translations;
  await fse.mkdirp(path.dirname(outputFilePath));
  await fse.writeFile(outputFilePath, JSON.stringify(finalTranslations));
};

export default importStrings;
