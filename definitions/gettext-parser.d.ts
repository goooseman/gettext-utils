declare module "gettext-parser" {
  const def: {
    po: {
      parse(
        fileContents: string | Buffer,
      ): {
        charset: Object;
        headers: Object;
        translations: Object;
      };
    };
  };
  export = def;
}
