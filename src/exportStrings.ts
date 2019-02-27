import { mkdirp, readFile, writeFile } from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { parseGlob } from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";
import mergePotContents from "./mergePotContents";

const parseGlobPromisified = promisify(parseGlob);
const encoding = "utf-8";

const getPackageNameAndVersion = async () => {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(
      await readFile(packageJsonPath, encoding),
    ) as {
      name?: string;
      version?: string;
    };
    return `${packageJson.name} ${packageJson.version}`;
  } catch (e) {
    return false;
  }
};

const updateLocale = async (
  templateFilePath: string,
  localeFilePath: string,
  isDefault: boolean,
) => {
  const template = await readFile(templateFilePath, encoding);
  const localeFile = await readFile(localeFilePath, encoding);
  const updatedLocaleData = mergePotContents(template, localeFile, isDefault);
  await writeFile(localeFilePath, updatedLocaleData);
};

export const isDefaultLocale = (localePath: string, locale?: string) => {
  return path.basename(localePath, path.extname(localePath)) === locale;
};

const exportStrings = async (
  inputFilesGlob: string,
  templateFilePath: string,
  defaultLocale?: string,
) => {
  const templateDirPath = path.dirname(templateFilePath);
  const packageName = await getPackageNameAndVersion();
  await mkdirp(templateDirPath);
  await parseGlobPromisified([inputFilesGlob], {
    output: templateFilePath,
    transformHeaders: packageName
      ? (x) => ({
          "Project-Id-Version": packageName,
          ...x,
        })
      : (x) => x,
    ...lionessConfig,
  });
  const poFilesToUpdate = glob.sync(path.join(templateDirPath, "*.po"));
  for (const poFileToUpdate of poFilesToUpdate) {
    await updateLocale(
      templateFilePath,
      poFileToUpdate,
      isDefaultLocale(poFileToUpdate, defaultLocale),
    );
  }
};

export default exportStrings;
