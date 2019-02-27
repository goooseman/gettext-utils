import { po } from "gettext-parser";

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

const mergePotContents = (
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

export default mergePotContents;
