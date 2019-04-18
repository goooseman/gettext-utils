declare module "react-gettext-parser" {
  export function parseGlob(
    path: string[],
    options: {
      output?: string;
      funcArgumentsMap?: Object;
      componentPropsMap?: Object;
      transformHeaders?(headers: Object): Object;
    },
    cb: (error: Error) => void,
  ): void;
  export function extractMessagesFromGlob(
    path: string[],
    options: {
      output?: string;
      funcArgumentsMap?: Object;
      componentPropsMap?: Object;
      transformHeaders?(headers: Object): Object;
    },
  ): {
    msgid: string;
    msgid_plural?: string;
    msgctxt: string;
    msgstr?: string[];
    comments?: {
      reference: string;
    };
  }[];
  export function toPot(
    messages: {
      msgid: string;
      msgid_plural?: string;
      msgctxt: string;
      msgstr?: string[];
      comments?: {
        reference: string;
      };
    }[],
    options?: {
      transformHeaders?(headers: Object): Object;
    },
  ): string;
}
