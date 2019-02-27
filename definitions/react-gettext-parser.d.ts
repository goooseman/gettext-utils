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
}
