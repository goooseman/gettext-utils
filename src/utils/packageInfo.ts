import { readFile } from "fs-extra";
import * as path from "path";

const encoding = "utf-8";

export const getPackageNameAndVersion = async () => {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(
      await readFile(packageJsonPath, encoding),
    ) as {
      name?: string;
      version?: string;
    };
    return `${packageJson.name} ${packageJson.version}`;
  } catch (e) {
    return false;
  }
};
