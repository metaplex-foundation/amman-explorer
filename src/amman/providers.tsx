import { TransactionsMonitor } from "./TransactionsMonitor";
import { strict as assert } from "assert";

import { useCluster } from "../providers/cluster";
import { TransactionSignature } from "@solana/web3.js";
import React from "react";

const TransactionsMonitorContext: React.Context<TransactionSignature[]> =
  React.createContext([] as TransactionSignature[]);

export function useTransactionsMonitor() {
  const context = React.useContext(TransactionsMonitorContext);
  assert(
    context != null,
    "useMonitorTransactions expected to be inside MonitorTransactionsProvider"
  );
  return context as unknown as [
    TransactionSignature[],
    React.Dispatch<React.SetStateAction<TransactionSignature[]>>
  ];
}

export function TransactionsMonitorProvider(props: any) {
  //  { signatures: TransactionSignatureWithBlock[]; })
  const { url } = useCluster();
  const [signatures, setSignatures] = React.useState(
    [] as TransactionSignature[]
  );
  const value = React.useMemo(() => [signatures, setSignatures], [signatures]);
  TransactionsMonitor.instance(url, props.signatures, setSignatures);
  return <TransactionsMonitorContext.Provider value={value} {...props} />;
}
