import * as potOne from "./__fixtures__/pot.json";
import arePotsDifferent from "./arePotsDifferent";

const potTwo = {
  ...potOne,
  translations: {
    ...potOne.translations,
    "lion.title2": {
      Lion2: {
        msgid: "Lion2",
        msgctxt: "lion.title2",
        comments2: {
          reference:
            "__fixtures__/react-project/src/components/LionessTComponent.jsx:22",
        },
        msgstr2: [""],
      },
    },
  },
};

const potThree = {
  ...potOne,
  translations: {
    ...potOne.translations,
    "lion.title": {
      Lion: {
        msgid: "Lion2",
        msgctxt: "lion.title",
        comments2: {
          reference:
            "__fixtures__/react-project/src/components/LionessTComponent.jsx:22",
        },
        msgstr2: [""],
      },
    },
  },
};

test("it should return false for same translations", () => {
  expect(arePotsDifferent(potOne, potOne)).toBe(false);
});

test("it should return true if new translations were added", () => {
  expect(arePotsDifferent(potOne, potTwo)).toBe(true);
});

test("it should return true if translation was changed", () => {
  expect(arePotsDifferent(potOne, potThree)).toBe(true);
});
