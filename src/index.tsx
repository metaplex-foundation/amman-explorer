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
  AccountStatesResolverProvider,
  AmmanClient,
  AmmanVersionProvider,
  CustomAddressLabelsProvider,
  TransactionsMonitorProvider,
} from "./amman";
import { AMMAN_RELAY_PORT } from "@metaplex-foundation/amman";
import { verifyLocalCluster } from "./amman/utils";

async function main() {
  const ammanClient = initAmmanClient();
  const connected = await verifyLocalCluster();
  renderApp(ammanClient, connected);
}

function renderApp(ammanClient: AmmanClient, connected: boolean) {
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
                        <AmmanVersionProvider ammanClient={ammanClient}>
                          <TransactionsMonitorProvider
                            ammanClient={ammanClient}
                          >
                            <CustomAddressLabelsProvider
                              ammanClient={ammanClient}
                            >
                              <AccountStatesResolverProvider
                                ammanClient={ammanClient}
                              >
                                <App ammanConnected={connected} />
                              </AccountStatesResolverProvider>
                            </CustomAddressLabelsProvider>
                          </TransactionsMonitorProvider>
                        </AmmanVersionProvider>
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

main().catch((err: any) => {
  console.error(err);
});

// -----------------
// Helpers
// -----------------
function initAmmanClient() {
  const url = `http://localhost:${AMMAN_RELAY_PORT}`;
  AmmanClient.setInstance(url);
  return AmmanClient.instance;
}
