import {
  Connection,
  Context,
  Logs,
  TransactionSignature,
} from "@solana/web3.js";

export type TransactionInfo = {
  signature: TransactionSignature;
  block: number;
  index: number;
};
export type OnTransactionsChanged = (transactions: TransactionInfo[]) => void;
export class TransactionsMonitor {
  readonly latestTransactions: TransactionInfo[] = [];
  transactionIdx: number = 0;
  private constructor(
    readonly connection: Connection,
    initialSignatures: { block: number; signature: TransactionSignature }[],
    private onTransactionsChanged: OnTransactionsChanged,
    readonly maxTransactions: number
  ) {
    this.connection.onLogs("all", this.onLog);
    this.addSortedSliceOfSignatures(initialSignatures);
    this.update();
  }

  private addSortedSliceOfSignatures(
    currentSignatures: { block: number; signature: TransactionSignature }[]
  ) {
    const sorted = Array.from(currentSignatures).sort(
      ({ block: blockA }, { block: blockB }) => (blockA < blockB ? -1 : 1)
    );
    const len = sorted.length;
    for (const { block, signature } of sorted.slice(
      Math.max(len - this.maxTransactions, 0),
      len
    )) {
      this.latestTransactions.push({
        signature,
        block,
        index: this.transactionIdx++,
      });
    }
  }

  private onLog = (logs: Logs, ctx: Context) => {
    const txsBefore = Array.from(this.latestTransactions);
    this.latestTransactions.push({
      signature: logs.signature,
      block: ctx.slot,
      index: this.transactionIdx++,
    });
    this._purgeOldSignatures();
    this.update(txsBefore);
  };

  private update(txsBefore: TransactionInfo[] = []) {
    if (
      txsBefore.map((x) => x.signature).join("") !==
      this.latestTransactions.map((x) => x.signature).join("")
    ) {
      const currentTransactions = Array.from(this.latestTransactions).reverse();
      this.onTransactionsChanged(currentTransactions);
    }
  }

  private _purgeOldSignatures() {
    // Assuming they are sorted by block ascending
    while (this.latestTransactions.length > this.maxTransactions) {
      this.latestTransactions.shift();
    }
  }

  private static _instance?: TransactionsMonitor;
  static instance(
    url: string,
    currentSignatures: { block: number; signature: TransactionSignature }[],
    onTransactionsChanged: OnTransactionsChanged,
    maxTransactions: number = TransactionsMonitor.DEFAULT_MAX_TRANSACTIONS
  ): TransactionsMonitor {
    if (TransactionsMonitor._instance != null) {
      TransactionsMonitor._instance.onTransactionsChanged =
        onTransactionsChanged;
      return TransactionsMonitor._instance;
    }
    const connection = new Connection(url, "singleGossip");
    TransactionsMonitor._instance = new TransactionsMonitor(
      connection,
      currentSignatures,
      onTransactionsChanged,
      maxTransactions
    );
    return TransactionsMonitor._instance;
  }

  static DEFAULT_MAX_TRANSACTIONS = 12;
}
