import { LOCALHOST } from "@metaplex-foundation/amman";
import { Connection } from "@solana/web3.js";
import { inspect } from "util";

export function dump(x: any) {
  console.log(inspect(x, { depth: 5, colors: true }));
}

export class UnreachableCaseError extends Error {
  constructor(value: never) {
    super(`Unreachable case: ${value}`);
  }
}

export async function verifyLocalCluster() {
  const connection = new Connection(LOCALHOST);
  try {
    await connection.getClusterNodes();
    return true;
  } catch (err) {
    return false;
  }
}
