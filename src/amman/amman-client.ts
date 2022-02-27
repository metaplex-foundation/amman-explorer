import {
  MSG_UPDATE_ADDRESS_LABELS,
  MSG_GET_KNOWN_ADDRESS_LABELS,
} from "@metaplex-foundation/amman";
import EventEmitter from "events";
import io, { Socket } from "socket.io-client";
import { logDebug } from "./log";
import { strict as assert } from "assert";

export const UPDATE_ADDRESS_LABELS = "update:address-labels";
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

  hookAddressLabels() {
    this.socket.on(
      MSG_UPDATE_ADDRESS_LABELS,
      (labels: Record<string, string>) =>
        this.emit(UPDATE_ADDRESS_LABELS, labels)
    );
    return this;
  }

  requestKnownAddressLabels() {
    this.socket.emit(MSG_GET_KNOWN_ADDRESS_LABELS);
  }

  private static _instance: AmmanClient | undefined;
  static setInstance(url: string) {
    assert(
      AmmanClient._instance == null,
      "should only set amman instance once"
    );
    AmmanClient._instance = new AmmanClient(url).connect().hookAddressLabels();
  }

  static get instance() {
    assert(
      AmmanClient._instance != null,
      "need to setInstance of AmmanClient first"
    );
    return AmmanClient._instance;
  }
}
