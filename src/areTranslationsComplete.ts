import { getPoParsed, getTranslations } from "./importStrings";

export class TranslationMissingError extends Error {}

const areTranslationsComplete = async (
  poFilesDirPath: string,
  templateFilePath: string,
) => {
  const translations = await getTranslations(poFilesDirPath);
  const template = await getPoParsed(templateFilePath);
  // quoted from gettext-parser:
  // Translations can be found from the translations object
  // which in turn holds context objects for msgctxt.
  // Default context can be found from translations[""].
  for (const translationKey of Object.keys(template.translations[""])) {
    const locales = Object.keys(translations);
    for (const locale of locales) {
      if (!translations[locale].translations[translationKey]) {
        throw new TranslationMissingError(
          `${translationKey} in ${locale} is missing`,
        );
      }
    }
  }

  return true;
};

export default areTranslationsComplete;
