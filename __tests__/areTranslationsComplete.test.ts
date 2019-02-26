import areTranslationsComplete, {
  TranslationMissingError,
} from "@src/areTranslationsComplete";
import * as path from "path";

const fixturesPath = "__fixtures__";
const goodFixturesPath = path.join(fixturesPath, "po");
const badFixturesPath = path.join(fixturesPath, "poInvalid");

test("it should return true for po folder", async () => {
  expect(
    await areTranslationsComplete(
      goodFixturesPath,
      getTemplatePathInDir(goodFixturesPath),
    ),
  ).toBe(true);
});

test("it should return false for poInvalid folder", async () => {
  expect.assertions(1);
  try {
    await areTranslationsComplete(
      badFixturesPath,
      getTemplatePathInDir(badFixturesPath),
    );
  } catch (e) {
    expect(e).toBeInstanceOf(TranslationMissingError);
  }
});

const getTemplatePathInDir = (dir: string) => {
  return path.join(dir, "template.pot");
};
