import React from "react";
import { Link } from "react-router-dom";
import { Copyable } from "../../components/common/Copyable";
import { TableCardBody } from "../../components/common/TableCardBody";
import { ClusterStatus, useCluster } from "../../providers/cluster";

export function AmmanGuidePage() {
  // TODO(thlorenz): what do we do if another cluster is selected here?
  const { status } = useCluster();
  const ammanConnected = status === ClusterStatus.Connected;
  return (
    <div className="container mt-4">
      <AmmanConnectionGreeting ammanConnected={ammanConnected} />
      <h2 className="mt-4">Guide</h2>
      <Installation ammanConnected={ammanConnected} />
      <Usage />
      <CliExample />
    </div>
  );
}

const btnClasses = (variant: string) => {
  return `p-3 d-block btn-${variant}`;
};

function AmmanConnectionGreeting(props: { ammanConnected: boolean }) {
  return props.ammanConnected ? (
    <span className={btnClasses("primary")}>
      <span className="fe fe-check-circle me-2"></span>
      Amman Connected
    </span>
  ) : (
    <span className={btnClasses("danger")}>
      <span className="fe fe-alert-circle me-2"></span>
      Amman Not Connected
    </span>
  );
}

function Installation({ ammanConnected }: { ammanConnected: boolean }) {
  const ammanInstall = "npm install -g @metaplex-founation/amman";
  const ammanStart = "amman start ";
  const refresh = ammanConnected ? null : (
    <tr>
      <td>4. Reload this Page check Amman Connection </td>
      <td className="text-lg-end">
        <Link to="/guide" onClick={() => window.location.reload()}>
          Reload
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Installation</h3>
      </div>
      <TableCardBody>
        <tr>
          <td>1. Install Solana</td>
          <td className="text-lg-end">
            <Link
              to="https://docs.solana.com/cli/install-solana-cli-tools"
              target="_blank"
            >
              https://docs.solana.com/cli/install-solana-cli-tools
            </Link>
          </td>
        </tr>
        <tr>
          <td>2. Install Amman</td>
          <td className="text-lg-end">
            <Copyable text={ammanInstall}>
              <code>{ammanInstall}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>3. Launch Amman in Separate Terminal</td>
          <td className="text-lg-end">
            <Copyable text={ammanStart}>
              <code>{ammanStart}</code>
            </Copyable>
          </td>
        </tr>
        {refresh}
      </TableCardBody>
    </div>
  );
}

function Usage() {
  const createWallet = `solana-keygen new --no-bip39-passphrase -s -o ./wallet.json`;
  const airdrop = `amman airdrop ./wallet.json -l wallet`;
  const ammanHelp = `amman --help`;
  const ammanStop = `amman stop`;

  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Command Line Usage</h3>
      </div>
      <TableCardBody>
        <tr>
          <td>1. Open new Terminal</td>
          <td> </td>
        </tr>
        <tr>
          <td>2. Create Wallet</td>
          <td className="text-lg-end">
            <Copyable text={createWallet}>
              <code>{createWallet}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>
            3. Airdrop to the Wallet and label it <em>wallet</em>
          </td>
          <td className="text-lg-end">
            <Copyable text={airdrop}>
              <code>{airdrop}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>4. Inspect transaction in Amman Explorer</td>
          <td className="text-lg-end">
            <em>It'll show up under "Recent Transactions" above</em>
          </td>
        </tr>
        <tr>
          <td>5. Discover more Amman Commands</td>
          <td className="text-lg-end">
            <Copyable text={ammanHelp}>
              <code>{ammanHelp}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>
            6. When finished Stop Amman (<em>Ctrl-C also works</em>)
          </td>
          <td className="text-lg-end">
            <Copyable text={ammanStop}>
              <code>{ammanStop}</code>
            </Copyable>
          </td>
        </tr>
      </TableCardBody>
    </div>
  );
}

function CliExample() {
  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Full Command Line Example</h3>
      </div>
      <TableCardBody>
      <p className="m-3">Follow <Link to={walkThruUrl}>this walk through</Link>
        <span>or run the script below</span>
      </p>
            <Copyable text={CLI_EXAMPLE}>
      <pre className="m-3 p-3" >
        {CLI_EXAMPLE}
      </pre>
      </Copyable>
    </TableCardBody>
    </div>
  );
}
// -----------------
// CLI Example
// -----------------

const walkThruUrl =
  '"https://gist.github.com/thlorenz/0a4fd8afe81dc1ba81e63619ed5a77bf#file-walk-thru-md';

const CLI_EXAMPLE = `
#!/usr/bin/env bash

## Prepare Wallets

solana-keygen new --silent --no-bip39-passphrase --outfile solpair1.json 
solana-keygen new --silent --no-bip39-passphrase --outfile solpair2.json 

### Airdrop and label them

amman airdrop ./solpair1.json -l soladdr1
amman airdrop ./solpair2.json -l soladdr2

### Use first one as default wallet

solana config set --keypair ./solpair1.json

amman account soladdr1

## Token Creation

amman run -l token1 -l tx-create-token1 -- \
  spl-token create-token --mint-authority ./solpair1.json

## Token Account Creation

amman run -l ata-tok1-addr1 -l tx-create-ata-tok1-addr1 -- \
  spl-token create-account +token1 --owner +soladdr1

## Token Minting

amman run -l tx-mint-token1-to-ata-tok1-addr1 -t -- \
  spl-token mint +token1 10 +ata-tok1-addr1 --mint-authority ./solpair1.json

## Token Transferring

### Create ATA for 'soladdr2'

amman run -l ata-tok1-addr2 -l tx-ata-tok1-addr2 -- \
  spl-token create-account +token1 --owner +soladdr2

### Transfer the token Soladdr2

amman run -l tx-transfer-token1-addr2 -t -- \
  spl-token transfer +token1 1 +soladdr2 --owner ./solpair1.json
`;
