import { getPoParsed, getTranslations } from "./importStrings";

const areTranslationsComplete = async (
  poFilesDirPath: string,
  templatePath: string,
) => {
  const translations = await getTranslations(poFilesDirPath);
  const template = await getPoParsed(templatePath);

  for (const translationKey of Object.keys(template.translations)) {
    const locales = Object.keys(translations);
    for (const locale of locales) {
      if (!translations[locale].translations[translationKey]) {
        return false;
      }
    }
  }

  return true;
};

export default areTranslationsComplete;
