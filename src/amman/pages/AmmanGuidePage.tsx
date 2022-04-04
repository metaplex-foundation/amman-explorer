import React from "react";
import { Link } from "react-router-dom";
import { Copyable } from "../../components/common/Copyable";
import { TableCardBody } from "../../components/common/TableCardBody";
import { ClusterStatus, useCluster } from "../../providers/cluster";

export function AmmanGuidePage(props: { ammanConnected: boolean }) {
  // TODO(thlorenz): what do we do if another cluster is selected here?
  const { status } = useCluster();
  return (
    <div className="container mt-4">
      <AmmanConnectionGreeting
        ammanConnected={status === ClusterStatus.Connected}
      />
      <h2 className="mt-4">Guide</h2>
      <Installation />
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

function Installation() {
  const ammanInstall = "npm install -g @metaplex-founation/amman";
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
              <code>{`npm install -g @metaplex-foundation/amman`}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>3. Launch Amman in Separate Terminal</td>
          <td className="text-lg-end">
            <Copyable text={ammanInstall}>
              <code>{`amman start`}</code>
            </Copyable>
          </td>
        </tr>
        <tr>
          <td>4. Reload this Page check Amman Connection </td>
          <td className="text-lg-end">
            <Link to="/guide" onClick={() => window.location.reload()}>
              Reload
            </Link>
          </td>
        </tr>
      </TableCardBody>
    </div>
  );
}

function Usage() {
  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Usage</h3>
      </div>
    </div>
  );
}
