import { AmmanClient, RESOLVED_ACCOUNT_STATES } from "./amman-client";
import { strict as assert } from "assert";
import { CustomAddressLabelsMonitor } from "./CustomAddressLabelsMonitor";
import { RelayAccountState } from "@metaplex-foundation/amman";

export type ResolvedAccountStates = {
  states: RelayAccountState[];
  accountAddress: string;
};
export type HandleAccountStatesResolved = (
  resolvedAccountStates: Map<string, ResolvedAccountStates>
) => void;

export class AccountStatesResolver {
  private readonly resolvedAccountStates: Map<string, ResolvedAccountStates> =
    new Map();
  private constructor(
    readonly ammanClient: AmmanClient,
    readonly handleAccountStatesResolved: HandleAccountStatesResolved
  ) {
    this.ammanClient.on(RESOLVED_ACCOUNT_STATES, this.onResolvedAccountStates);
  }

  requestAccountStates(accountAddress: string) {
    this.ammanClient.requestAccountStates(accountAddress);
  }

  private onResolvedAccountStates = (
    accountAddress: string,
    accountStates: RelayAccountState[]
  ) => {
    const labeledStates = [];
    for (const state of accountStates) {
      const labeledState: RelayAccountState = { ...state, account: {} };
      for (const [key, val] of Object.entries(state.account)) {
        const label = CustomAddressLabelsMonitor.instance.get(val);
        labeledState.account[key] = label != null ? `${label} (${val})` : val;
      }
      labeledStates.push(labeledState);
    }
    this.resolvedAccountStates.set(accountAddress, {
      states: labeledStates,
      accountAddress,
    });
    this.handleAccountStatesResolved(new Map(this.resolvedAccountStates));
  };

  private static _instance?: AccountStatesResolver;
  static get instance() {
    assert(
      AccountStatesResolver._instance != null,
      "AccountInfoResolver.setInstance needs to be called first"
    );
    return AccountStatesResolver._instance;
  }
  static setInstance(
    ammanClient: AmmanClient,
    handleAccountStatesResolved: HandleAccountStatesResolved
  ): AccountStatesResolver {
    if (AccountStatesResolver._instance != null) {
      console.warn("can only set AccountInfoResolver instance once");
      return AccountStatesResolver._instance;
    }
    return (AccountStatesResolver._instance = new AccountStatesResolver(
      ammanClient,
      handleAccountStatesResolved
    ));
  }
}
