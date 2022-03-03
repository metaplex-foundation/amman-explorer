import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./scss/theme-dark.scss";
import App from "./App";
import { ClusterProvider } from "./providers/cluster";
import { RichListProvider } from "./providers/richList";
import { SupplyProvider } from "./providers/supply";
import { TransactionsProvider } from "./providers/transactions";
import { AccountsProvider } from "./providers/accounts";
import { BlockProvider } from "./providers/block";
import { EpochProvider } from "./providers/epoch";
import { StatsProvider } from "providers/stats";
import { MintsProvider } from "providers/mints";
import {
  AmmanClient,
  CustomAddressLabelsProvider,
  TransactionsMonitorProvider,
} from "./amman";
import { getLatestTransactionSignatures } from "./amman/queries";
import { LOCALHOST } from "./amman/consts";
import { Connection } from "@solana/web3.js";
import { AMMAN_RELAY_PORT } from "@metaplex-foundation/amman";

async function verifyLocalCluster() {
  const connection = new Connection(LOCALHOST);
  try {
    const clusterNodes = await connection.getClusterNodes();
    console.log({ clusterNodes });
    return true;
  } catch (err) {
    return false;
  }
}

function initAmmanClient() {
  const url = `http://localhost:${AMMAN_RELAY_PORT}`;
  AmmanClient.setInstance(url);
  return AmmanClient.instance;
}

async function main() {
  const ammanClient = initAmmanClient();
  if (!(await verifyLocalCluster())) {
    ReactDOM.render(
      <div>
        <h2>Failed to connect to local test validator at {LOCALHOST}</h2>
        <div>
          Please start one, ideally via{" "}
          <a href="https://github.com/metaplex-foundation/amman">amman</a>.
        </div>
      </div>,
      document.getElementById("root")
    );
  } else {
    const currentTransactionSignatures = await getLatestTransactionSignatures();

    ReactDOM.render(
      <Router>
        <ClusterProvider>
          <StatsProvider>
            <SupplyProvider>
              <RichListProvider>
                <AccountsProvider>
                  <BlockProvider>
                    <EpochProvider>
                      <MintsProvider>
                        <TransactionsProvider>
                          <TransactionsMonitorProvider
                            signatures={currentTransactionSignatures}
                          >
                            <CustomAddressLabelsProvider
                              ammanClient={ammanClient}
                            >
                              <App />
                            </CustomAddressLabelsProvider>
                          </TransactionsMonitorProvider>
                        </TransactionsProvider>
                      </MintsProvider>
                    </EpochProvider>
                  </BlockProvider>
                </AccountsProvider>
              </RichListProvider>
            </SupplyProvider>
          </StatsProvider>
        </ClusterProvider>
      </Router>,
      document.getElementById("root")
    );
  }
}

main().catch((err: any) => {
  console.error(err);
});
