import { TransactionSignature } from "@solana/web3.js";

export type TransactionSignatureWithBlock = {
  block: number;
  signature: TransactionSignature;
};
