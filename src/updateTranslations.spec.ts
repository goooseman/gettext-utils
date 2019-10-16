import {
  isDefaultLocale,
  mergePotContents,
  mergeTranslations,
} from "./updateTranslations";

// tslint:disable
const templatePot = `
msgid ""
msgstr ""
"Project-Id-Version: trucknet-boilerplate-typescript-react 0.0.1\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"POT-Creation-Date: Wed Feb 27 2019 10:04:14 GMT+0200 (Israel Standard Time)\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"

#: src/layouts/Header.tsx:24
msgctxt "header.title"
msgid "Some name"
msgstr ""

#: src/layouts/Header.tsx:25
msgctxt "header.title2"
msgid "Some name"
msgstr ""
`;

const localePo = `
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\\n"
"POT-Creation-Date: Mon Feb 25 2019 16:43:13 GMT+0200 (Israel Standard Time)\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);\\n"
"Project-Id-Version: \\n"
"PO-Revision-Date: \\n"
"Language-Team: \\n"
"MIME-Version: 1.0\\n"
"X-Generator: Poedit 2.2.1\\n"
"Last-Translator: \\n"
"Language: ru\\n"


#: src/layouts/Header.tsx:24
msgctxt "header.title"
msgid "Some name"
msgstr "Какое-то название"

#: src/layouts/Header.tsx:29
msgctxt "outdated.title"
msgid "No more in the code"
msgstr "No more in the code"
`;

const result = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"POT-Creation-Date: Wed Feb 27 2019 10:04:14 GMT+0200 (Israel Standard Time)\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 "
"&& (n%100<12 || n%100>14) ? 1 : 2);\\n"
"Project-Id-Version: trucknet-boilerplate-typescript-react 0.0.1\\n"
"PO-Revision-Date: \\n"
"Language-Team: \\n"
"MIME-Version: 1.0\\n"
"X-Generator: Poedit 2.2.1\\n"
"Last-Translator: \\n"
"Language: ru\\n"

#: src/layouts/Header.tsx:24
msgctxt "header.title"
msgid "Some name"
msgstr "Какое-то название"

#: src/layouts/Header.tsx:25
msgctxt "header.title2"
msgid "Some name"
msgstr ""`;
// tslint:enable

test("it should update headers and messages from .pot file to a existing .po file", () => {
  expect(mergePotContents(templatePot, localePo)).toBe(result);
});

describe("mergeTranslations", () => {
  const templateTranslationsObject = {
    "header.title": {
      "Some name": {
        msgid: "Some name",
        msgid_plural: "{{ count }} names",
        msgctxt: "header.title",
        comments: {
          reference: "src/layout/Header.tsx:24",
        },
      },
    },
  };
  const localeTranslationsObject = {
    "header.title": {
      "Some name": {
        msgid: "Some name",
        msgid_plural: "{{ count }} names",
        msgctxt: "header.title",
        msgstr: [
          "Translated",
          "{{ count }} translated",
          "and 3 {{ count }} translated",
        ],
        comments: {
          reference: "some other",
        },
      },
    },
  };

  it("should take a translation string from locale file, if it is not a default locale", () => {
    expect(
      mergeTranslations(templateTranslationsObject, localeTranslationsObject),
    ).toMatchObject({
      "header.title": {
        "Some name": {
          msgid: "Some name",
          msgid_plural: "{{ count }} names",
          msgctxt: "header.title",
          msgstr: [
            "Translated",
            "{{ count }} translated",
            "and 3 {{ count }} translated",
          ],
          comments: {
            reference: "src/layout/Header.tsx:24",
          },
        },
      },
    });
  });

  it("should take a translation string from template file, if it is a default locale", () => {
    expect(
      mergeTranslations(
        templateTranslationsObject,
        localeTranslationsObject,
        true,
      ),
    ).toMatchObject({
      "header.title": {
        "Some name": {
          msgid: "Some name",
          msgid_plural: "{{ count }} names",
          msgctxt: "header.title",
          msgstr: ["Some name", "{{ count }} names"],
          comments: {
            reference: "src/layout/Header.tsx:24",
          },
        },
      },
    });
  });
});

describe("isDefaultLocale", () => {
  test("it should return true", () => {
    expect(isDefaultLocale("foo/bar/en.po", "en")).toBe(true);
  });
  test("it should return false", () => {
    expect(isDefaultLocale("foo/bar/pl.po", "en")).toBe(false);
  });

  test("it should return false if locale is undefined", () => {
    expect(isDefaultLocale("foo/bar/pl.po")).toBe(false);
  });
});
