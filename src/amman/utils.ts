import { inspect } from "util";

export function dump(x: any) {
  console.log(inspect(x, { depth: 5, colors: true }));
}

export class UnreachableCaseError extends Error {
  constructor(value: never) {
    super(`Unreachable case: ${value}`);
  }
}
