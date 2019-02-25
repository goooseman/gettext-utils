import * as fse from "fs-extra";
import { po } from "gettext-parser";
import * as glob from "glob";
import * as path from "path";

export const getPoParsed = async (pathToPo: string) => {
  const file = await fse.readFile(pathToPo);
  return po.parse(file.toString());
};

export const getTranslations = async (poFilesPath: string) => {
  const poFilesPaths = glob.sync(path.join(poFilesPath, "*.po"));
  const translations: {
    [locale: string]: Translation;
  } = {};
  for (const poFilePath of poFilesPaths) {
    const locale = path.basename(poFilePath, path.extname(poFilePath));
    translations[locale] = await getPoParsed(poFilePath);
  }
  return translations;
};

const importStrings = async (poFilesPath: string, outputPath: string) => {
  const translations = await getTranslations(poFilesPath);
  await fse.mkdirp(outputPath);
  await fse.writeFile(
    path.join(outputPath, "translations.json"),
    JSON.stringify(translations),
  );
};

export default importStrings;
