declare module "react-gettext-parser" {
  export function parseGlob(
    path: string[],
    options: { output: string },
    cb: (error: Error) => void,
  ): void;
}
