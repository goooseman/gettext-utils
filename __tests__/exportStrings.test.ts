import exportStrings from "@src/exportStrings";
import { getTmpPath } from "__helpers__/fs";
import * as fse from "fs-extra";
import * as path from "path";

jest.mock("@src/utils/packageInfo");

import { getPackageNameAndVersion } from "@src/utils/packageInfo";

const mockedProjectName = "gettext-utils 0.0.0";

beforeEach(() => {
  global.Date.prototype.toString = () => "Thu Jan 01 2018 00:00:00";
});

const templateName = "template.pot";
const encoding = "utf-8";
const msgIdsToCheck = [
  /msgctxt "lion\.females"/,
  /msgctxt "lion\.children"/,
  /msgctxt "lion\.title"/,
  /msgctxt "lion\.sound"/,
];

const copyPoAndGeneratePot = async (
  tmpPath: string,
  defaultLocale?: string,
) => {
  await fse.copy("__fixtures__/po", tmpPath);
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
    defaultLocale,
  );
};

it("Should export correct strings from .jsx and .tsx files", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const result = await fse.readFile(filePath, encoding);
  expect(result).toMatchSnapshot(templateName);
  for (const msgIdToCheck of msgIdsToCheck) {
    expect(result).toMatch(msgIdToCheck);
  }
});

it("Should overwrite template.pot", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await fse.createFile(filePath);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const result = await fse.readFile(filePath, encoding);
  expect(result).toMatchSnapshot(templateName);
  expect(result).toMatch(/msgctxt "lion\.females"/);
});

it("Should update .po files with new translations", async () => {
  const tmpPath = await getTmpPath();
  await copyPoAndGeneratePot(tmpPath);
  const locales = ["fr.po", "he.po", "ru.po", "en.po"];

  for (const locale of locales) {
    const localeFilePath = path.join(tmpPath, locale);
    const result = await fse.readFile(localeFilePath, encoding);
    expect(result).toMatch(/msgctxt "lion\.sound"\n.+\nmsgstr "[^"]/gm);
    for (const msgIdToCheck of msgIdsToCheck) {
      expect(result).toMatch(msgIdToCheck);
    }
    expect(result).toMatchSnapshot(locale);
  }
});

it("Should update translations by --po-files-path", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await fse.createFile(filePath);

  // Reset po files before testing that they are actually updated
  const poHeader = await fse.readFile("__fixtures__/en.header.po", encoding);
  const poPaths = ["__fixtures__/poPath1", "__fixtures__/poPath2"];
  await fse.writeFile(`${poPaths[0]}/en.po`, poHeader);
  await fse.writeFile(`${poPaths[1]}/en.po`, poHeader);

  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
    "en",
    poPaths,
  );
  const templatePot = await fse.readFile(filePath, encoding);
  expect(templatePot).toMatchSnapshot(templateName);
  expect(templatePot).toMatch(/msgctxt "lion\.females"/);

  const po1 = await fse.readFile(`${poPaths[0]}/en.po`, encoding);
  const po2 = await fse.readFile(`${poPaths[1]}/en.po`, encoding);
  expect(po1).toMatch(/msgctxt "lion\.females"/);
  expect(po2).toMatch(/msgctxt "lion\.females"/);
});

it("Should generate Project-Id-Version header", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const result = await fse.readFile(filePath, encoding);
  expect(result).toMatch(
    new RegExp(`"Project-Id-Version: ${mockedProjectName}\\\\n"`, "m"),
  );
});

it("Should generate Project-Id-Version header in .po files", async () => {
  const tmpPath = await getTmpPath();
  await copyPoAndGeneratePot(tmpPath);
  const locales = ["fr.po", "he.po", "ru.po", "en.po"];
  for (const locale of locales) {
    const localeFilePath = path.join(tmpPath, locale);
    const result = await fse.readFile(localeFilePath, encoding);
    expect(result).toMatch(
      new RegExp(`"Project-Id-Version: ${mockedProjectName}\\\\n"`, "m"),
    );
  }
});

it("Should generate translation in default locale .po file", async () => {
  const tmpPath = await getTmpPath();
  await copyPoAndGeneratePot(tmpPath, "en");
  const localeFilePath = path.join(tmpPath, "en.po");
  const result = await fse.readFile(localeFilePath, encoding);
  expect(result).toMatch(`msgctxt "lion.title"
msgid "Lion"
msgstr "Lion"`);
});

it("Should not update any files if there are no new translations", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const firstResult = await fse.readFile(filePath, encoding);
  global.Date.prototype.toString = () => "Thu Jan 02 2018 00:00:00";
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const secondResult = await fse.readFile(filePath, encoding);
  expect(secondResult).toBe(firstResult);
});

it("Should update all files if there are new translations", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const firstResult = await fse.readFile(filePath, encoding);
  global.Date.prototype.toString = () => "Thu Jan 02 2018 00:00:00";
  await exportStrings(
    "__fixtures__/react-project-updated/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const secondResult = await fse.readFile(filePath, encoding);
  expect(secondResult).not.toBe(firstResult);
  expect(secondResult).toMatch(`msgctxt "lion.title-two"`);
});

describe("diffs", () => {
  let tmpPath: string;
  let filePath: string;
  let componentPath: string;
  let componentBefore: string;

  beforeEach(async () => {
    tmpPath = await getTmpPath();
    filePath = path.join(tmpPath, templateName);
    await fse.remove(filePath);
    componentPath = path.join(
      __dirname,
      "../__fixtures__/diffTest/src/components/LionessHocComponent.tsx",
    );
    componentBefore = await fse.readFile(componentPath, encoding);
  });

  afterEach(async () => {
    await fse.writeFile(componentPath, componentBefore);
  });

  it("Should not update any files if only line/column number changed", async () => {
    await exportStrings(
      "__fixtures__/diffTest/src/**/{*.ts,*.tsx,*.js,*.jsx}",
      filePath,
    );

    const result1 = await fse.readFile(filePath, encoding);
    expect(result1).toMatchSnapshot();

    const componentAfter = componentBefore.replace(
      `    this.props.tp(`,
      `console.log("Adding line doesn't affect anything!");\n    this.props.tp(`,
    );
    await fse.writeFile(componentPath, componentAfter);

    await exportStrings(
      "__fixtures__/diffTest/src/**/{*.ts,*.tsx,*.js,*.jsx}",
      filePath,
    );

    const result2 = await fse.readFile(filePath, encoding);
    expect(result2).toEqual(result1);
  });

  it("Should preserve translation headers except for Project-Id-Version on update", async () => {
    // Create ru.po so that exportStrings updates it with template contents
    const ruPoPath = path.join(tmpPath, "ru.po");
    await fse.ensureFile(ruPoPath);
    await fse.writeFile(ruPoPath, "");
    await exportStrings(
      "__fixtures__/diffTest/src/**/{*.ts,*.tsx,*.js,*.jsx}",
      filePath,
    );

    const result1 = await fse.readFile(filePath, encoding);
    expect(result1).toMatch("Project-Id-Version: gettext-utils 0.0.0");
    // Simulate updating project's version
    (getPackageNameAndVersion as jest.Mock).mockResolvedValueOnce(
      "gettext-utils 1.2.3",
    );

    // Simulate updating message in component
    const componentAfter = componentBefore.replace(
      `80 chars long string: asdasdasd asdasda asdasd asd a sdas dasd asd asda dsasd fu`,
      `Template and po files should be updated after this change`,
    );
    await fse.writeFile(componentPath, componentAfter);

    // Simulate updating ru.po from weblate
    const ruPo = await fse.readFile(ruPoPath, encoding);
    const ruPoWeblated = ruPo.replace(
      `"Project-Id-Version: gettext-utils 0.0.0\\n"`,
      `"Project-Id-Version: gettext-utils 0.0.0\\n"
"Last-Translator: Olesea Mereacle <olesea.mereacle@trucknet.io>\\n"
"PO-Revision-Date: 2019-10-15 13:13+0000\\n"
"X-Generator: Weblate 3.7.1\\n"`,
    );
    await fse.writeFile(ruPoPath, ruPoWeblated);

    await exportStrings(
      "__fixtures__/diffTest/src/**/{*.ts,*.tsx,*.js,*.jsx}",
      filePath,
    );

    const result2 = await fse.readFile(filePath, encoding);
    const ruPo2 = await fse.readFile(ruPoPath, encoding);

    expect(result2).toMatch("Project-Id-Version: gettext-utils 1.2.3");

    expect(ruPo2).toMatch("Project-Id-Version: gettext-utils 1.2.3");
    expect(ruPo2).toMatch(
      "Last-Translator: Olesea Mereacle <olesea.mereacle@trucknet.io>",
    );
    expect(ruPo2).toMatch("PO-Revision-Date: 2019-10-15 13:13+0000");
    expect(ruPo2).toMatch("X-Generator: Weblate 3.7.1");
  });
});
