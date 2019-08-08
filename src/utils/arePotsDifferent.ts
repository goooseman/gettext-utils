import * as assert from "assert";

const arePotsDifferent = (
  newPot: Translation,
  oldPot: Translation,
): boolean => {
  const newTranslations = { ...newPot.translations };
  const oldTranslations = { ...oldPot.translations };

  // We don't want to compare project's metadata
  if (newTranslations[""]) {
    delete newTranslations[""][""];
  }
  if (oldTranslations[""]) {
    delete oldTranslations[""][""];
  }

  try {
    assert.deepStrictEqual(newTranslations, oldTranslations);
  } catch (e) {
    return true;
  }
  return false;
};

export default arePotsDifferent;
