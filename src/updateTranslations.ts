import { readFile, writeFile } from "fs-extra";
import { po } from "gettext-parser";
import * as glob from "glob";
import * as path from "path";

const encoding = "utf-8";

const updateTranslationsByPath = async (
  poDirPath: string,
  templateFilePath: string,
  defaultLocale?: string,
) => {
  const poFilesToUpdate = glob.sync(path.join(poDirPath, "*.po"));
  for (const poFileToUpdate of poFilesToUpdate) {
    await updateLocale(
      templateFilePath,
      poFileToUpdate,
      isDefaultLocale(poFileToUpdate, defaultLocale),
    );
  }
};

const translationExists = (
  translations: Translation["translations"],
  context: string,
  id: string,
) => translations && translations[context] && translations[context][id];

export const mergeTranslations = (
  templateTranslations: Translation["translations"],
  localeTranslations: Translation["translations"],
  isDefault?: boolean,
) => {
  const result: Translation["translations"] = {};
  for (const context of Object.keys(templateTranslations)) {
    result[context] = {};
    for (const id of Object.keys(templateTranslations[context])) {
      result[context][id] = templateTranslations[context][id];
      const resultTranslation = result[context][id];
      if (!isDefault) {
        resultTranslation.msgstr = translationExists(
          localeTranslations,
          context,
          id,
        )
          ? localeTranslations[context][id].msgstr
          : templateTranslations[context][id].msgstr;
      } else {
        resultTranslation.msgstr = [resultTranslation.msgid];
        if (resultTranslation.msgid_plural) {
          resultTranslation.msgstr.push(resultTranslation.msgid_plural);
        }
      }
    }
  }
  return result;
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

export const mergePotContents = (
  templatePot: string,
  localePo: string,
  isDefault?: boolean,
) => {
  const templatePotParsed = po.parse(templatePot);
  const localePoParsed = po.parse(localePo);

  const resultParsed: Translation = {
    charset: templatePotParsed.charset,
    headers: {
      ...localePoParsed.headers,
      ...templatePotParsed.headers,
      "plural-forms": localePoParsed.headers["plural-forms"],
    },
    translations: mergeTranslations(
      templatePotParsed.translations,
      localePoParsed.translations,
      isDefault,
    ),
  };

  return po.compile(resultParsed).toString();
};

export const isDefaultLocale = (localePath: string, locale?: string) => {
  return path.basename(localePath, path.extname(localePath)) === locale;
};

export default updateTranslationsByPath;
