import {
  Connection,
  Context,
  Logs,
  TransactionSignature,
} from "@solana/web3.js";

export type OnSignaturesChanged = (signatures: TransactionSignature[]) => void;
export class TransactionsMonitor {
  readonly latestSignatures: Map<TransactionSignature, number> = new Map();
  private constructor(
    readonly connection: Connection,
    currentSignatures: { block: number; signature: TransactionSignature }[],
    private onSignaturesChanged: OnSignaturesChanged,
    readonly maxSignatures: number
  ) {
    this.connection.onLogs("all", this.onLog);
    for (const { block, signature } of currentSignatures.slice(
      0,
      maxSignatures
    )) {
      this.latestSignatures.set(signature, block);
    }
    this.update();
  }

  private onLog = (logs: Logs, ctx: Context) => {
    const sigsBefore = this.signaturesSortedDesc();
    this.latestSignatures.set(logs.signature, ctx.slot);
    this._purgeOldSignatures();
    this.update(sigsBefore);
  };

  private signaturesSortedDesc() {
    const entries: [string, number][] = Array.from(
      this.latestSignatures.entries()
    );
    entries.sort(([_a, blockA], [_b, blockB]) => (blockA < blockB ? 1 : -1));
    return entries.map(([sig, _]) => sig);
  }

  private update(sigsBefore: string[] = []) {
    const currentSignatures = this.signaturesSortedDesc();
    if (sigsBefore.join("") !== currentSignatures.join("")) {
      console.log(currentSignatures);
      this.onSignaturesChanged(currentSignatures);
    }
  }

  private _purgeOldSignatures() {
    if (this.latestSignatures.size < this.maxSignatures) return;
    let oldest: { signature: string; slot: number } = {
      signature: "",
      slot: Number.MAX_VALUE,
    };

    for (const [signature, slot] of this.latestSignatures) {
      if (slot < oldest.slot) {
        oldest = { signature, slot };
      }
    }
    this.latestSignatures.delete(oldest.signature);
  }

  private static _instance?: TransactionsMonitor;
  static instance(
    url: string,
    currentSignatures: { block: number; signature: TransactionSignature }[],
    onSignaturesChanged: OnSignaturesChanged,
    maxSignatures: number = 10
  ): TransactionsMonitor {
    if (TransactionsMonitor._instance != null) {
      TransactionsMonitor._instance.onSignaturesChanged = onSignaturesChanged;
      return TransactionsMonitor._instance;
    }
    const connection = new Connection(url, "singleGossip");
    TransactionsMonitor._instance = new TransactionsMonitor(
      connection,
      currentSignatures,
      onSignaturesChanged,
      maxSignatures
    );
    return TransactionsMonitor._instance;
  }
}
