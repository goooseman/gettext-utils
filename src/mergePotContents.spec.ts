import mergePotContents, { translateDefaultLocale } from "./mergePotContents";

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
`;

const result = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"POT-Creation-Date: Wed Feb 27 2019 10:04:14 GMT+0200 (Israel Standard Time)\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && "
"n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);\\n"
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

describe("translateDefaultLocale", () => {
  const translationStub = {
    charset: {},
    headers: {
      "plural-forms": "",
    },
    translations: {
      test: {
        test: {
          msgctxt: "test",
          msgid: "one test",
        },
      },
      testPlural: {
        testPlural: {
          msgctxt: "test.plural",
          msgid: "one test",
          msgid_plural: "%s tests",
        },
      },
    },
  };

  it("Should put default translation to translation object", () => {
    expect(translateDefaultLocale(translationStub)).toMatchObject({
      translations: {
        test: {
          test: {
            msgctxt: "test",
            msgid: "one test",
            msgstr: ["one test"],
          },
        },
        testPlural: {
          testPlural: {
            msgctxt: "test.plural",
            msgid: "one test",
            msgid_plural: "%s tests",
            msgstr: ["one test", "%s tests"],
          },
        },
      },
    });
  });
});
