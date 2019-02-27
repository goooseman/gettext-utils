import { po } from "gettext-parser";

export const translateDefaultLocale = (
  translationObject: Translation,
): Translation => {
  const translationContextKeys = Object.keys(translationObject.translations);
  for (const translationContextKey of translationContextKeys) {
    const translationsKeys = Object.keys(
      translationObject.translations[translationContextKey],
    );
    for (const key of translationsKeys) {
      const translation =
        translationObject.translations[translationContextKey][key];
      translation.msgstr = [translation.msgid];
      if (translation.msgid_plural) {
        translation.msgstr.push(translation.msgid_plural);
      }
    }
  }
  return translationObject;
};

const mergePotContents = (
  templatePot: string,
  localePo: string,
  isDefault?: boolean,
) => {
  const templatePotParsed = po.parse(templatePot);
  const localePoParsed = po.parse(localePo);

  let resultParsed: Translation = {
    charset: templatePotParsed.charset,
    headers: {
      ...localePoParsed.headers,
      ...templatePotParsed.headers,
      "plural-forms": localePoParsed.headers["plural-forms"],
    },
    translations: {
      ...templatePotParsed.translations,
      ...localePoParsed.translations,
    },
  };

  if (isDefault) {
    resultParsed = translateDefaultLocale(resultParsed);
  }

  return po.compile(resultParsed).toString();
};

export default mergePotContents;
