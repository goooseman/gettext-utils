import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";

export const readFileFromTmp = (tmpPath: string, filePath: string) => {
  return fse.readFileSync(path.join(tmpPath, filePath)).toString();
};

export const getTmpPath = async () => {
  const exportFolder = path.join(os.tmpdir(), `lioness-utils`);
  await fse.remove(exportFolder);
  return exportFolder;
};
