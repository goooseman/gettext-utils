# gettext-utils

[![Build Status](https://travis-ci.org/goooseman/gettext-utils.svg?branch=develop)](https://travis-ci.org/goooseman/gettext-utils)
[![Coverage Status](https://coveralls.io/repos/github/goooseman/gettext-utils/badge.svg?branch=develop)](https://coveralls.io/github/goooseman/gettext-utils?branch=develop)

> A set of utils to extract strings from JS application to .pot file, merge it with existing .po files and / import these strings back to a [react-targem](https://github.com/trucknet-io/react-targem) or [lioness](https://github.com/alexanderwallin/lioness) compatible .json file / validate that all the strings are translated before release

## Installation

`npm i --save-dev gettext-utils`

## Usage

- `export-strings [input-files-glob] [output] [--default-locale=locale]` parse through all the files provided in `input-files-glob` (`src/**/{*.js,*.jsx,*.ts,*.tsx}` by default) (uses [glob](https://www.npmjs.com/package/glob)) and generate .pot file in the output path (`./src/i18n/template.pot` by default). Then searches for all the `.po` files in the same directory and updates them with new strings to translate. If `default-locale` is provided (e.g. `en`) and this locale's `.po` file exists in the same folder (e.g. `en.po`), this file will be populated with the translations automatically.
- `import-strings [po-files-path] [output]` parse all the `.po` files inside the directory provided as `po-files-path` (`./src/i18n/` by default) and generate [react-targem](https://github.com/trucknet-io/react-targem) or [lioness](https://github.com/alexanderwallin/lioness) compatible `.json` file in the output path (`./src/i18n/translations.json`), which is an object with each locale as a key and [gettext-parser](https://www.npmjs.com/package/gettext-parser) object for this locale as a value. By default all `translations.json` are optimized, e.g. all unnecessary fields are removed. Pass `--no-optimize` or `--optimize=false` to disabled optimizations.
- `merge-translations [po-files-dir-path] [template-path]` merge updated .pot file with .po. Done automatically by `export-strings` command. If `default-locale` is provided (e.g. `en`) and this locale's `.po` file exists in the same folder (e.g. `en.po`), this file will be populated with the translations automatically.
- `validate-strings [po-files-dir-path] [template-path]` validate all `.po` files inside `po-files-dir-path` (`./src/i18n/` by default) to have all the translations in the `.pot` file provided in `template-path` (`./src/i18n/template.pot` by default).

## Use-case

For example, you have a react project in `src` folder and you want to use [react-targem](https://github.com/trucknet-io/react-targem) or [lioness](https://github.com/alexanderwallin/lioness) to translate your application.

### Init

1. `npm i --save react-targem` or `npm i --save lioness`
1. `npm i --save-dev gettext-utils`
1. Write your first translatable string with `<T>` component or `withTranslations` HOC.
1. `npx gettext-utils export-strings` to create a `src/i18n/template.pot` file.
1. Open it with [POEdit](https://poedit.net/) and create locale files from it in the same folder (including the default locale, e.g. en)
1. Create a `prestart` and `prebuild` scripts inside `scripts` section of your `package.json`: `"prestart": "gettext-utils import-strings"` to generate `translations.json` file automatically.
1. Include `/src/i18n/translations.json` file inside your `.gitignore` (this file is generated automatically).
1. Add `gettext-utils export-strings --default-locale=en && git add src/i18n/*` in any precommit hook you are using, so the translations will be exported automatically ([husky](https://www.npmjs.com/package/husky)).

### Translate

1. There are plenty of tools, that connect to your git repository with an online translation tool (eg. [POEditor](https://poeditor.com/) or open-source [Weblate](https://weblate.org/en/)).
1. Translators can translate all the application in the `develop` branch before relase.

### Release

1. You can run `npx gettext-utils validate-strings` to make sure that everything is translated before each release.
