import { exportStrings } from "@src/main";
import { getTmpPath, readFileFromTmp } from "__helpers__/fs";
import * as fse from "fs-extra";
import * as path from "path";

beforeAll(() => {
  global.Date.prototype.toString = () => "Thu Jan 01 2018 00:00:00";
});

const templateName = "template.pot";
const msgIdsToCheck = [
  /msgctxt "lion\.females"/,
  /msgctxt "lion\.children"/,
  /msgctxt "lion\.title"/,
  /msgctxt "lion\.sound"/,
];

it("Should export correct strings from .jsx and .tsx files", async () => {
  const tmpPath = await getTmpPath();
  await exportStrings(
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  const result = readFileFromTmp(tmpPath, templateName);
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
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  const result = readFileFromTmp(tmpPath, templateName);
  expect(result).toMatchSnapshot(templateName);
  expect(result).toMatch(/msgctxt "lion\.females"/);
});

it("Should update .po files with new translations", async () => {
  const tmpPath = await getTmpPath();
  await fse.copy("__fixtures__/po", tmpPath);
  await exportStrings(
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  const locales = ["fr.po", "he.po", "ru.po"];

  for (const locale of locales) {
    const result = readFileFromTmp(tmpPath, locale);
    expect(result).toMatch(/msgctxt "lion\.sound"\n.+\nmsgstr "[^"]/gm);
    for (const msgIdToCheck of msgIdsToCheck) {
      expect(result).toMatch(msgIdToCheck);
    }
    expect(result).toMatchSnapshot(locale);
  }
});
