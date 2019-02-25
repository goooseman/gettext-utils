import { mkdirp, readFile, writeFile } from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { mergePotContents } from "pot-merge";
import { parseGlob } from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";

const parseGlobPromisified = promisify(parseGlob);
const encoding = "utf-8";

const updateLocale = async (
  templateFilePath: string,
  localeFilePath: string,
) => {
  const template = await readFile(templateFilePath, encoding);
  const localeFile = await readFile(localeFilePath, encoding);
  const updatedLocaleData = mergePotContents(localeFile, template);
  await writeFile(localeFilePath, updatedLocaleData);
};

const exportStrings = async (
  inputFilesGlob: string,
  templateFilePath: string,
) => {
  const templateDirPath = path.dirname(templateFilePath);
  await mkdirp(templateDirPath);
  await parseGlobPromisified([inputFilesGlob], {
    output: templateFilePath,
    ...lionessConfig,
  });
  const poFilesToUpdate = glob.sync(path.join(templateDirPath, "*.po"));
  for (const poFileToUpdate of poFilesToUpdate) {
    await updateLocale(templateFilePath, poFileToUpdate);
  }
};

export default exportStrings;
