interface TranslationMessage {
  msgid?: string;
  msgid_plural?: string;
  msgctxt?: string;
  msgstr?: string[];
  comments?: {
    reference: string;
  };
}

interface TranslationHeaders {
  "project-id-version"?: string;
  "content-type"?: string;
  "pot-creation-date"?: string;
  "content-transfer-encoding"?: string;
  "plural-forms"?: string;
  "po-revision-date"?: string;
  "language-team"?: string;
  "mime-version"?: string;
  "x-generator"?: string;
  "last-translator"?: string;
  language?: string;
}

interface TranslationContext {
  [msgid: string]: TranslationMessage;
}

interface Translation {
  charset?: string;
  headers: TranslationHeaders;
  translations: {
    [msgctxt: string]: TranslationContext;
  };
}

interface TranslationsMap {
  [locale: string]: Translation;
}

declare module "gettext-parser" {
  const def: {
    po: {
      parse(fileContents: string | Buffer): Translation;
      compile(
        translation: Translation,
        options?: { foldLength?: number; sort?: boolean | (() => number) },
      ): Buffer;
    };
  };
  export = def;
}
