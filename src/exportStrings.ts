import { existsSync, mkdirp, writeFile } from "fs-extra";
import { po } from "gettext-parser";
import * as path from "path";
import { extractMessagesFromGlob, toPot } from "react-gettext-parser";

import lionessConfig from "./config/lioness.config";
import { getPoParsed } from "./importStrings";
import updateTranslations from "./updateTranslations";
import arePotsDifferent from "./utils/arePotsDifferent";
import { compileToPot } from "./utils/compileToPot";
import { optimizeMessageForGit } from "./utils/optimizeForGit";
import { getPackageNameAndVersion } from "./utils/packageInfo";

const exportStrings = async (
  inputFilesGlob: string,
  templateFilePath: string,
  defaultLocale?: string,
  poFilesPath?: string[],
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
  if (poFilesPath) {
    for (const poPath of poFilesPath) {
      await updateTranslations(poPath, templateFilePath, defaultLocale);
    }
  }
  await updateTranslations(templateDirPath, templateFilePath, defaultLocale);
};

const getUpdatedTemplateContents = async (
  inputFilesGlob: string,
  templateFilePath: string,
): Promise<string | undefined> => {
  const packageName = await getPackageNameAndVersion();
  const newMessages = extractMessagesFromGlob(
    [inputFilesGlob],
    lionessConfig,
  ).map(optimizeMessageForGit);

  const newPot = toPot(newMessages, {
    transformHeaders: packageName
      ? (x) => ({
          "Project-Id-Version": packageName,
          ...x,
        })
      : (x) => x,
  });
  const oldTemplateExists = existsSync(templateFilePath);
  const newPotParsed = po.parse(newPot);
  if (!oldTemplateExists) {
    return compileToPot(newPotParsed);
  }
  const oldPotParsed = await getPoParsed(templateFilePath);
  if (!arePotsDifferent(newPotParsed, oldPotParsed)) {
    return;
  }
  return compileToPot(newPotParsed);
};

export default exportStrings;
