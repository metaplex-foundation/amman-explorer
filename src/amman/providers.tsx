import { TransactionInfo, TransactionsMonitor } from "./TransactionsMonitor";
import { strict as assert } from "assert";

import { useCluster } from "../providers/cluster";
import React from "react";
import { CustomAddressLabelsMonitor } from "./CustomAddressLabelsMonitor";
import {
  AccountStatesResolver,
  ResolvedAccountStates,
} from "./AccountStatesResolver";

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
  TransactionsMonitor.instance(url, props.ammanClient, setTransactionInfos);
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
  CustomAddressLabelsMonitor.setInstance(props.ammanClient, setAddressLabels);
  return <CustomAddressLabelsContext.Provider value={value} {...props} />;
}

// -----------------
// Account States
// -----------------
const ResolvedAccountStatesContext: React.Context<
  Map<string, ResolvedAccountStates>
> = React.createContext(new Map());

export function useResolvedAccountStates() {
  const context = React.useContext(ResolvedAccountStatesContext);
  assert(
    context != null,
    "useResolvedAccountStates expected to be inside AccountStatesResolverProvider"
  );
  return context as unknown as [
    Map<string, ResolvedAccountStates>,
    React.Dispatch<React.SetStateAction<Map<string, ResolvedAccountStates>>>
  ];
}

export function AccountStatesResolverProvider(props: any) {
  const [resolvedAccountStates, setResolvedAccountStates] = React.useState(
    new Map() as Map<string, ResolvedAccountStates>
  );
  const value = React.useMemo(
    () => [resolvedAccountStates, setResolvedAccountStates],
    [resolvedAccountStates]
  );
  AccountStatesResolver.setInstance(
    props.ammanClient,
    setResolvedAccountStates
  );
  return <ResolvedAccountStatesContext.Provider value={value} {...props} />;
}
