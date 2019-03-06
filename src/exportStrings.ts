import { mkdirp, readFile } from "fs-extra";
import * as path from "path";
import { parseGlob } from "react-gettext-parser";
import { promisify } from "util";
import lionessConfig from "./config/lioness.config";
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
  await updateTranslations(templateFilePath, templateDirPath, defaultLocale);
};

export default exportStrings;
