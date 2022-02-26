import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as Sentry from "@sentry/react";
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
import { TransactionsMonitorProvider } from "./amman";
import { getLatestTransactionSignatures } from "./amman/queries";

if (process?.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://5efdc15b4828434fbe949b5daed472be@o434108.ingest.sentry.io/5390542",
  });
}

async function main() {
  const currentTransactionSignatures = await getLatestTransactionSignatures();
  console.log({ currentTransactionSignatures });

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
                          <App />
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

main().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
