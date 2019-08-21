const optimizeMessage = (message: TranslationMessage) => {
  return {
    msgid_plural: message.msgid_plural || undefined,
    msgctxt: message.msgctxt || undefined,
    msgstr: message.msgstr || undefined,
  };
};

const optimizeHeaders = (headers: TranslationHeaders) => {
  return {
    "plural-forms": headers["plural-forms"] || undefined,
  };
};

const optimizeContext = (context: TranslationContext) => {
  return Object.entries(context).reduce(
    (res: TranslationContext, [msgid, message]) => {
      res[msgid] = optimizeMessage(message);
      return res;
    },
    {},
  );
};

export const optimizeTranslation = (translation: Translation) => {
  const optimizedTranslations = Object.entries(translation.translations).reduce(
    (res: Translation["translations"], [contextId, context]) => {
      res[contextId] = optimizeContext(context);
      return res;
    },
    {},
  );

  return {
    headers: optimizeHeaders(translation.headers),
    translations: optimizedTranslations,
  };
};

export const optimizeAllTranslations = (translations: TranslationsMap) => {
  return Object.entries(translations).reduce(
    (res: TranslationsMap, [locale, translation]) => {
      res[locale] = optimizeTranslation(translation);
      return res;
    },
    {},
  );
};
