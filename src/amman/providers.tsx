import { TransactionInfo, TransactionsMonitor } from "./TransactionsMonitor";
import { strict as assert } from "assert";

import { useCluster } from "../providers/cluster";
import React from "react";
import { CustomAddressLabelsMonitor } from "./CustomAddressLabelsMonitor";

// -----------------
// TransactionsMonitor
// -----------------
const TransactionsMonitorContext: React.Context<TransactionInfo[]> =
  React.createContext([] as TransactionInfo[]);

export function useTransactionsMonitor() {
  const context = React.useContext(TransactionsMonitorContext);
  assert(
    context != null,
    "useMonitorTransactions expected to be inside MonitorTransactionsProvider"
  );
  return context as unknown as [
    TransactionInfo[],
    React.Dispatch<React.SetStateAction<TransactionInfo[]>>
  ];
}

export function TransactionsMonitorProvider(props: any) {
  const { url } = useCluster();
  const [transactionInfos, setTransactionInfos] = React.useState(
    [] as TransactionInfo[]
  );
  const value = React.useMemo(
    () => [transactionInfos, setTransactionInfos],
    [transactionInfos]
  );
  TransactionsMonitor.instance(
    url,
    props.ammanClient,
    props.signatures,
    setTransactionInfos
  );
  return <TransactionsMonitorContext.Provider value={value} {...props} />;
}

// -----------------
// Custom Address Labels
// -----------------
const CustomAddressLabelsContext: React.Context<Map<string, string>> =
  React.createContext(new Map());

export function useCustomAddressLabels() {
  const context = React.useContext(CustomAddressLabelsContext);
  assert(
    context != null,
    "useCustomAddressLabels expected to be inside CustomAddressLabelsProvider"
  );
  return context as unknown as [
    Map<string, string>,
    React.Dispatch<React.SetStateAction<Map<string, string>>>
  ];
}

export function CustomAddressLabelsProvider(props: any) {
  const [addressLabels, setAddressLabels] = React.useState(
    new Map() as Map<string, string>
  );
  const value = React.useMemo(
    () => [addressLabels, setAddressLabels],
    [addressLabels]
  );
  CustomAddressLabelsMonitor.instance(props.ammanClient, setAddressLabels);
  return <CustomAddressLabelsContext.Provider value={value} {...props} />;
}
