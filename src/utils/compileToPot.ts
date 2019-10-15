import { po } from "gettext-parser";

export const compileToPot = (translation: Translation) =>
  po.compile(translation, { foldLength: 80 }).toString();
