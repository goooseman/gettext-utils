import * as assert from "assert";

const arePotsDifferent = (
  newPot: Translation,
  oldPot: Translation,
): boolean => {
  const newTranslations = { ...newPot.translations };
  const oldTranslations = { ...oldPot.translations };
  delete newTranslations[""];
  delete oldTranslations[""];
  try {
    assert.deepStrictEqual(newTranslations, oldTranslations);
  } catch (e) {
    return true;
  }
  return false;
};

export default arePotsDifferent;
