import exportStrings from "@src/exportStrings";
import { getTmpPath } from "__helpers__/fs";
import * as fse from "fs-extra";
import * as path from "path";
import * as packageJson from "../package.json"; // tslint:disable-line no-relative-imports max-line-length

beforeAll(() => {
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
  await fse.copy("__fixtures__/po", tmpPath);
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const locales = ["fr.po", "he.po", "ru.po"];

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

it("Should generate Project-Id-Version header", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await exportStrings(
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
    filePath,
  );
  const result = await fse.readFile(filePath, encoding);
  expect(result).toMatch(
    new RegExp(
      `"Project-Id-Version: ${packageJson.name} ${packageJson.version}\\\\n"`,
      "m",
    ),
  );
});
