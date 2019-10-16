interface PotReference {
  filename: string;
  line?: number | string;
  column?: number | string;
}

type ExtractedMessage = {
  msgid: string;
  msgid_plural?: string;
  msgctxt: string;
  msgstr?: string[];
  comments?: {
    reference: PotReference[];
  };
};

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
  ): ExtractedMessage[];
  export function toPot(
    messages: ExtractedMessage[],
    options?: {
      transformHeaders?(headers: Object): Object;
    },
  ): string;
}
