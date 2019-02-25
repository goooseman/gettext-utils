import { mkdirp, readFile, writeFile } from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { mergePotContents } from "pot-merge";
import { parseGlob } from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";

const parseGlobPromisified = promisify(parseGlob);
const encoding = "utf-8";

const updateLocale = async (templatePath: string, localeFilePath: string) => {
  const template = await readFile(templatePath, encoding);
  const localeFile = await readFile(localeFilePath, encoding);
  const updatedLocaleData = mergePotContents(localeFile, template);
  await writeFile(localeFilePath, updatedLocaleData);
};

const exportStrings = async (inputFilesGlob: string, outputDirPath: string) => {
  await mkdirp(outputDirPath);
  const templateOutputPath = path.join(outputDirPath, "template.pot");
  await parseGlobPromisified([inputFilesGlob], {
    output: templateOutputPath,
    ...lionessConfig,
  });
  const poFilesToUpdate = glob.sync(path.join(outputDirPath, "*.po"));
  for (const poFileToUpdate of poFilesToUpdate) {
    await updateLocale(templateOutputPath, poFileToUpdate);
  }
};

export default exportStrings;
