import { AmmanClient, RESOLVED_ACCOUNT_INFO } from "./amman-client";
import { strict as assert } from "assert";
import { CustomAddressLabelsMonitor } from "./CustomAddressLabelsMonitor";

export type ResolvedAccountInfo = {
  pretty: Record<string, any>;
};
export type HandleAccountInfoResolved = (
  providedAccountInfos: Map<string, ResolvedAccountInfo>
) => void;

export class AccountInfoResolver {
  readonly resolvedAccountInfos: Map<string, ResolvedAccountInfo> = new Map();
  private constructor(
    readonly ammanClient: AmmanClient,
    readonly handleAccountInfoProvided: HandleAccountInfoResolved
  ) {
    this.ammanClient.on(RESOLVED_ACCOUNT_INFO, this.onResolvedAccountInfo);
  }

  requestAccountInfo(accountAddress: string) {
    if (!this.resolvedAccountInfos.has(accountAddress)) {
      this.ammanClient.requestAccountInfo(accountAddress);
    }
  }

  private onResolvedAccountInfo = (
    accountAddress: string,
    accountInfo: ResolvedAccountInfo
  ) => {
    for (const key of Object.keys(accountInfo.pretty)) {
      const val = accountInfo.pretty[key];
      const label = CustomAddressLabelsMonitor.instance.get(val);
      accountInfo.pretty[key] = label != null ? `${label} (${val})` : val;
    }
    this.resolvedAccountInfos.set(accountAddress, accountInfo);
    this.handleAccountInfoProvided(this.resolvedAccountInfos);
  };

  get(accountAddress: string) {
    return this.resolvedAccountInfos.get(accountAddress);
  }

  private static _instance?: AccountInfoResolver;
  static get instance() {
    assert(
      AccountInfoResolver._instance != null,
      "AccountInfoResolver.setInstance needs to be called first"
    );
    return AccountInfoResolver._instance;
  }
  static setInstance(
    ammanClient: AmmanClient,
    handleAccountInfoProvided: HandleAccountInfoResolved
  ): AccountInfoResolver {
    return (AccountInfoResolver._instance = new AccountInfoResolver(
      ammanClient,
      handleAccountInfoProvided
    ));
  }
}
