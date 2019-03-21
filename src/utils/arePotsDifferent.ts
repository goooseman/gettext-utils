const arePotsDifferent = (
  newPot: Translation,
  oldPot: Translation,
): boolean => {
  return newPot.translations.length !== oldPot.translations.length;
};

export default arePotsDifferent;
