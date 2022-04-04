import React from "react";
import { Link } from "react-router-dom";
import { Copyable } from "../../components/common/Copyable";
import { TableCardBody } from "../../components/common/TableCardBody";
import { ClusterStatus, useCluster } from "../../providers/cluster";

export function AmmanGuidePage() {
  // TODO(thlorenz): what do we do if another cluster is selected here?
  const { status } = useCluster();
  const  ammanConnected = status === ClusterStatus.Connected
  return (
    <div className="container mt-4">
      <AmmanConnectionGreeting
        ammanConnected={ammanConnected}
      />
      <h2 className="mt-4">Guide</h2>
      <Installation ammanConnected={ammanConnected} />
      <Usage />
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
          <td>3. Airdrop to the Wallet and label it <em>wallet</em></td>
          <td className="text-lg-end">
            <Copyable text={airdrop}>
              <code>{airdrop}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>4. Discover more Amman Commands</td>
          <td className="text-lg-end">
            <Copyable text={ammanHelp}>
              <code>{ammanHelp}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>5. When finished Stop Amman (<em>Ctrl-C also works</em>)</td>
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
