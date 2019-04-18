import { existsSync, mkdirp, writeFile } from "fs-extra";
import { po } from "gettext-parser";
import * as path from "path";
import { extractMessagesFromGlob, toPot } from "react-gettext-parser";
import lionessConfig from "./config/lioness.config";
import { getPoParsed } from "./importStrings";
import updateTranslations from "./updateTranslations";
import arePotsDifferent from "./utils/arePotsDifferent";
import { getPackageNameAndVersion } from "./utils/packageInfo";

const exportStrings = async (
  inputFilesGlob: string,
  templateFilePath: string,
  defaultLocale?: string,
) => {
  const templateDirPath = path.dirname(templateFilePath);

  await mkdirp(templateDirPath);
  const templatePot = await getUpdatedTemplateContents(
    inputFilesGlob,
    templateFilePath,
  );
  if (!templatePot) {
    return;
  }
  await writeFile(templateFilePath, templatePot, "utf-8");
  await updateTranslations(templateDirPath, templateFilePath, defaultLocale);
};

const getUpdatedTemplateContents = async (
  inputFilesGlob: string,
  templateFilePath: string,
): Promise<string | undefined> => {
  const packageName = await getPackageNameAndVersion();
  const newMessages = extractMessagesFromGlob([inputFilesGlob], lionessConfig);
  const newPot = toPot(newMessages, {
    transformHeaders: packageName
      ? (x) => ({
          "Project-Id-Version": packageName,
          ...x,
        })
      : (x) => x,
  });
  const oldTemplateExists = existsSync(templateFilePath);
  if (!oldTemplateExists) {
    return newPot;
  }
  const oldPotParsed = await getPoParsed(templateFilePath);
  const newPotParsed = po.parse(newPot);
  if (!arePotsDifferent(newPotParsed, oldPotParsed)) {
    return;
  }
  return newPot;
};

export default exportStrings;
