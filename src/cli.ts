#!/usr/bin/env node

import * as yargs from "yargs";
// tslint:disable-next-line no-duplicate-imports
import { Argv } from "yargs";
import { areTranslationsComplete, exportStrings, importStrings } from "./main";

// tslint:disable no-unused-expression
yargs
  .command(
    "export-strings [input-files-glob] [output-path]",
    "exports translations from  to .pot and .po files",
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("inputFilesGlob", {
          describe: "Glob to look for the source code with translations",
          default: "src/**/{*.js,*.jsx,*.ts,*.tsx}",
        })
        .positional("outputPath", {
          describe: "Path to output .pot file",
          default: "./src/i18n/",
        });
    },
    ({
      outputPath,
      inputFilesGlob,
    }: {
      inputFilesGlob: string;
      outputPath: string;
    }) => {
      exportStrings(outputPath, inputFilesGlob).catch(console.error);
    },
  )
  .command(
    "import-strings [po-files-path] [output-path]",
    "generate translations.json from all .po files in the source folder",
    (yargsArguments: Argv) => {
      return yargsArguments
        .positional("poFilesPath", {
          describe: "Path to look for .po files in",
          default: "./src/i18n/",
        })
        .positional("outputPath", {
          describe: "Path to output translations.json file",
          default: "./src/i18n/",
        });
    },
    ({
      poFilesPath,
      outputPath,
    }: {
      poFilesPath: string;
      outputPath: string;
    }) => {
      importStrings(poFilesPath, outputPath).catch(console.error);
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
      areTranslationsComplete(poFilesDirPath, templatePath).catch(
        console.error,
      );
    },
  )
  .showHelpOnFail(true)
  .demandCommand(1, "")
  .help()
  .alias("help", "h").argv;
