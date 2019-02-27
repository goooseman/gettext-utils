import { po } from "gettext-parser";

const mergePotContents = (templatePot: string, localePo: string) => {
  const templatePotParsed = po.parse(templatePot);
  const localePoParsed = po.parse(localePo);

  const resultParsed: Translation = {
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

  return po.compile(resultParsed).toString();
};

export default mergePotContents;
