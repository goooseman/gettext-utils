import { mkdirp, readFile, writeFile } from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { mergePotContents } from "pot-merge";
import { parseGlob } from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";

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
    await updateLocale(templateFilePath, poFileToUpdate);
  }
};

export default exportStrings;
