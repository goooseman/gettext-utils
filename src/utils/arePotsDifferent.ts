const arePotsDifferent = (
  newPot: Translation,
  oldPot: Translation,
): boolean => {
  return (
    Object.keys(newPot.translations).length !==
    Object.keys(oldPot.translations).length
  );
};

export default arePotsDifferent;
