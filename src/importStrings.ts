import * as fse from "fs-extra";
import * as gettextParser from "gettext-parser";
import * as glob from "glob";
import * as path from "path";

const importStrings = async (poFilesPath: string, outputPath: string) => {
  const poFilePaths = glob.sync(path.join(poFilesPath, "*.po"));
  const translations = {};
  for (const poFilePath of poFilePaths) {
    const locale = path.basename(poFilePath, path.extname(poFilePath));
    const file = await fse.readFile(poFilePath);
    // @ts-ignore
    translations[locale] = gettextParser.po.parse(file.toString());
  }
  await fse.mkdirp(outputPath);
  await fse.writeFile(
    path.join(outputPath, "translations.json"),
    JSON.stringify(translations),
  );
};

export default importStrings;
