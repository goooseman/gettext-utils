interface Translation {
  charset: Object;
  headers: Object;
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
    };
  };
  export = def;
}
