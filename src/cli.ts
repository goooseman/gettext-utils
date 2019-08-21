#!/usr/bin/env node

import * as yargs from "yargs";
// tslint:disable-next-line no-duplicate-imports
import { Argv } from "yargs";
import {
  areTranslationsComplete,
  exportStrings,
  importStrings,
  updateTranslations,
} from "./main";

// tslint:disable no-unused-expression
yargs
  .command(
    "export-strings [input-files-glob] [output-file-path]",
    "exports translations from  to .pot and .po files",
    // @ts-ignore
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("inputFilesGlob", {
          describe: "Glob to look for the source code with translations",
          default: "src/**/{*.js,*.jsx,*.ts,*.tsx}",
        })
        .positional("outputFilePath", {
          describe: "Path to output .pot file",
          default: "./src/i18n/template.pot",
        })
        .array("poFilesPath");
    },
    ({
      inputFilesGlob,
      outputFilePath,
      defaultLocale,
      poFilesPath,
    }: {
      inputFilesGlob: string;
      outputFilePath: string;
      defaultLocale?: string;
      poFilesPath?: string[];
    }) => {
      return exportStrings(
        inputFilesGlob,
        outputFilePath,
        defaultLocale,
        poFilesPath,
      );
    },
  )
  .command(
    "import-strings [po-files-path] [output-file-path]",
    "generate translations.json from all .po files in the source folder",
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("poFilesPath", {
          describe: "Path to look for .po files in",
          default: "./src/i18n/",
        })
        .positional("outputFilePath", {
          describe: "Path to output .json file",
          default: "./src/i18n/translations.json",
        });
    },
    ({
      poFilesPath,
      outputFilePath,
      optimize = true,
    }: {
      poFilesPath: string;
      outputFilePath: string;
      optimize?: boolean;
    }) => {
      return importStrings(poFilesPath, outputFilePath, optimize);
    },
  )
  .command(
    "validate-strings [po-files-dir-path] [template-path]",
    "validate all .po files to have every key from .pot translated",
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("poFilesDirPath", {
          describe: "Path to look for .po files in",
          default: "./src/i18n/",
        })
        .positional("templatePath", {
          describe: "Path to template.pot file",
          default: "./src/i18n/template.pot",
        });
    },
    ({
      poFilesDirPath,
      templatePath,
    }: {
      poFilesDirPath: string;
      templatePath: string;
    }) => {
      return areTranslationsComplete(poFilesDirPath, templatePath);
    },
  )
  .command(
    "merge-translations [po-files-dir-path] [template-path]",
    "merge all new translations from .pot file to .po files in a dir",
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("poFilesDirPath", {
          describe: "Path to look for .po files in",
          default: "./src/i18n/",
        })
        .positional("templatePath", {
          describe: "Path to template.pot file",
          default: "./src/i18n/template.pot",
        });
    },
    ({
      poFilesDirPath,
      templatePath,
      defaultLocale,
    }: {
      poFilesDirPath: string;
      templatePath: string;
      defaultLocale?: string;
    }) => {
      return updateTranslations(poFilesDirPath, templatePath, defaultLocale);
    },
  )
  .showHelpOnFail(false)
  .demandCommand(1, "")
  .help()
  .strict()
  .alias("help", "h").argv;
