import { existsSync, mkdirp, readFile } from "fs-extra";
import { po } from "gettext-parser";
import * as path from "path";
import {
  extractMessagesFromGlob,
  parseGlob,
  toPot,
} from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";
import { getPoParsed } from "./importStrings";
import updateTranslations from "./updateTranslations";

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

const exportStrings = async (
  inputFilesGlob: string,
  templateFilePath: string,
  defaultLocale?: string,
) => {
  const templateDirPath = path.dirname(templateFilePath);
  const packageName = await getPackageNameAndVersion();
  await mkdirp(templateDirPath);
  await getUpdatedTemplateContents(inputFilesGlob, templateFilePath);
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
  await updateTranslations(templateDirPath, templateFilePath, defaultLocale);
};

const getUpdatedTemplateContents = async (
  inputFilesGlob: string,
  templateFilePath: string,
): Promise<string | undefined> => {
  const newMessages = extractMessagesFromGlob([inputFilesGlob], lionessConfig);
  const newPot = toPot(newMessages);
  const oldTemplateExists = existsSync(templateFilePath);
  if (!oldTemplateExists) {
    return newPot;
  }
  const oldPotParsed = await getPoParsed(templateFilePath);
  const newPotParsed = po.parse(newPot);
  console.log(oldPotParsed, newPotParsed);
  return;
};

export default exportStrings;
