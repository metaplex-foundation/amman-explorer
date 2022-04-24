import {
  MSG_UPDATE_ADDRESS_LABELS,
  MSG_GET_KNOWN_ADDRESS_LABELS,
  MSG_CLEAR_ADDRESS_LABELS,
  MSG_CLEAR_TRANSACTIONS,
  MSG_RESPOND_ACCOUNT_STATES,
  MSG_UPDATE_ACCOUNT_STATES,
  RelayAccountState,
  MSG_REQUEST_ACCOUNT_STATES,
  MSG_REQUEST_AMMAN_VERSION,
  MSG_RESPOND_AMMAN_VERSION,
} from "@metaplex-foundation/amman";
import EventEmitter from "events";
import io, { Socket } from "socket.io-client";
import { logDebug } from "./log";
import { strict as assert } from "assert";
import { verifyLocalCluster } from "./utils";
import { AmmanVersionInfo } from "./AmmanVersionChecker";

export const UPDATE_ADDRESS_LABELS = "update:address-labels";
export const CLEAR_ADDRESS_LABELS = "clear:address-labels";
export const CLEAR_TRANSACTIONS = "clear:transactions";
export const RESOLVED_ACCOUNT_STATES = "resolved:account-states";

export class AmmanClient extends EventEmitter {
  readonly socket: Socket;
  constructor(readonly url: string) {
    super();
    this.socket = io(url);
  }
  connect() {
    if (this.socket.connected) return this;
    this.socket.connect();
    logDebug("AmmanClient connected");
    return this;
  }

  hookMessages() {
    this.socket
      .on(MSG_UPDATE_ADDRESS_LABELS, (labels: Record<string, string>) =>
        this.emit(UPDATE_ADDRESS_LABELS, labels)
      )
      .on(MSG_CLEAR_ADDRESS_LABELS, () => this.emit(CLEAR_ADDRESS_LABELS))
      .on(MSG_CLEAR_TRANSACTIONS, () => this.emit(CLEAR_TRANSACTIONS))
      .on(
        MSG_RESPOND_ACCOUNT_STATES,
        (accountAddress: string, states: RelayAccountState[]) =>
          this.emit(RESOLVED_ACCOUNT_STATES, accountAddress, states)
      )
      .on(
        MSG_UPDATE_ACCOUNT_STATES,
        (accountAddress: string, states: RelayAccountState[]) =>
          this.emit(RESOLVED_ACCOUNT_STATES, accountAddress, states)
      );

    return this;
  }

  requestKnownAddressLabels() {
    this.socket.emit(MSG_GET_KNOWN_ADDRESS_LABELS);
  }

  requestAccountStates(accountAddress: string) {
    this.socket.emit(MSG_REQUEST_ACCOUNT_STATES, accountAddress);
  }

  async fetchAmmanVersion(): Promise<AmmanVersionInfo> {
    const relayConnected = this.socket.connected;
    const ammanConnected = await verifyLocalCluster();
    if (!ammanConnected || !relayConnected) {
      return AmmanVersionInfo.unresolved(ammanConnected, relayConnected);
    }
    return new Promise((resolve, _reject) => {
      let resolved = false;
      // Initial Amman Versions didn't support this request
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolve(AmmanVersionInfo.unresolved(ammanConnected, relayConnected));
        }
      }, 1000);
      this.socket
        .on(MSG_RESPOND_AMMAN_VERSION, (version: [number, number, number]) => {
          clearTimeout(timeout);
          if (!resolved) {
            resolve(
              new AmmanVersionInfo(
                version,
                true,
                ammanConnected,
                relayConnected
              )
            );
          }
        })
        .emit(MSG_REQUEST_AMMAN_VERSION);
    });
  }

  private static _instance: AmmanClient | undefined;
  static setInstance(url: string) {
    assert(
      AmmanClient._instance == null,
      "should only set amman instance once"
    );
    AmmanClient._instance = new AmmanClient(url).connect().hookMessages();
  }

  static get instance() {
    assert(
      AmmanClient._instance != null,
      "need to setInstance of AmmanClient first"
    );
    return AmmanClient._instance;
  }

  static MIN_AMMAN_VERSION_REQUIRED = require("../../package.json")
    .ammanVersion.split(".")
    .map((v: string) => parseInt(v));
}
