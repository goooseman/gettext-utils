interface Translation {
  charset: Object;
  headers: {
    "plural-forms": string;
    [key: string]: string;
  };
  translations: {
    [key: string]: {
      [key: string]: {
        msgid: string;
        msgctxt: string;
        msgstr: string;
        comments: {
          reference: string;
        };
      };
    };
  };
}

declare module "gettext-parser" {
  const def: {
    po: {
      parse(fileContents: string | Buffer): Translation;
      compile(translation: Translation): Buffer;
    };
  };
  export = def;
}
