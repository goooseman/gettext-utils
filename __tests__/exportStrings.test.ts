import { exportStrings } from "@src/main";
import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";

beforeAll(() => {
  global.Date.prototype.toString = () => "Thu Jan 01 2018 00:00:00";
});

const templateName = "template.pot";

it("Should export correct strings from .tsx files", async () => {
  const tmpPath = await getTmpPath();
  await exportStrings(
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  expect(readFileFromTmp(tmpPath, templateName)).toMatchSnapshot(templateName);
});

it("Should overwrite template.pot", async () => {
  const tmpPath = await getTmpPath();
  const filePath = path.join(tmpPath, templateName);
  await fse.createFile(filePath);
  await exportStrings(
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  expect(readFileFromTmp(tmpPath, templateName)).toMatchSnapshot(templateName);
});

it("Should update .po files with new translations", async () => {
  const tmpPath = await getTmpPath();
  await fse.copy("__fixtures__/po", tmpPath);
  await exportStrings(
    tmpPath,
    "__fixtures__/react-project/src/**/{*.ts,*.tsx,*.js,*.jsx}",
  );
  const locales = ["fr.po", "he.po"];

  for (const locale of locales) {
    expect(readFileFromTmp(tmpPath, locale)).toMatchSnapshot(locale);
  }
});

const readFileFromTmp = (tmpPath: string, filePath: string) => {
  return fse.readFileSync(path.join(tmpPath, filePath)).toString();
};

const getTmpPath = async () => {
  const exportFolder = path.join(os.tmpdir(), `lioness-utils`);
  await fse.remove(exportFolder);
  return exportFolder;
};
