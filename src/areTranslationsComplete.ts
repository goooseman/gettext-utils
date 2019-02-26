import { getPoParsed, getTranslations } from "./importStrings";

export class TranslationMissingError extends Error {}

const areTranslationsComplete = async (
  poFilesDirPath: string,
  templateFilePath: string,
) => {
  const translations = await getTranslations(poFilesDirPath);
  const template = await getPoParsed(templateFilePath);

  for (const translationKey of Object.keys(template.translations)) {
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
