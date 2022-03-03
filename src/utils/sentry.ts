type Tags =
  | {
      [key: string]: string;
    }
  | undefined;

export function reportError(err: unknown, tags: Tags) {
  if (err instanceof Error) {
    console.error(err, err.message, tags);
  }
}
