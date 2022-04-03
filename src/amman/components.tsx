import { Link, useHistory, useLocation } from "react-router-dom";
import { useQuery } from "../utils/url";
import { useCustomAddressLabels, useTransactionsMonitor } from "./providers";
import { TransactionInfo, TransactionsMonitor } from "./TransactionsMonitor";

export function TransactionsMonitorView() {
  const [transactionInfos] = useTransactionsMonitor();
  const [customAddressLabels] = useCustomAddressLabels();
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  function reloadWithHistory() {
    query.set("loadTransactionHistory", "true");
    history.push({ ...location, search: query.toString() });
    window.location.reload();
  }
  function reloadWithoutHistory() {
    query.delete("loadTransactionHistory");
    history.push({ ...location, search: query.toString() });
    window.location.reload();
  }

  const loadedTxHistory =
    query.has("loadTransactionHistory") ||
    TransactionsMonitor.existingInstance.instantiatedWithTransactionHistory;

  const linkLabel = loadedTxHistory
    ? "Reload without History"
    : "Reload with History";
  const onClick = loadedTxHistory ? reloadWithoutHistory : reloadWithHistory;

  return (
    <div className="header-signatures container my-4">
      <h5 className="d-inline">Recent Transactions</h5>
      <Link
        className="fs-5 d-inline ms-4 text-muted float-end"
        to={"#"}
        onClick={onClick}
      >
        {linkLabel}
      </Link>

      <div className="row align-items-center">
        {transactionInfos.map((x) => TransactionView(x, customAddressLabels))}
      </div>
    </div>
  );
}

function TransactionView(
  x: TransactionInfo,
  customAddressLabels: Map<string, string>
) {
  const statusClass = x.err != null ? "text-warning" : "";
  let label = (
    <p
      className={`display-6 text-truncate ${statusClass}`}
      style={{ maxWidth: 255 }}
    >
      {x.index}. {x.signature}
    </p>
  );
  const addressLabel = customAddressLabels.get(x.signature);
  if (addressLabel != null) {
    label = (
      <div>
        <span className={statusClass}>
          {x.index}. {addressLabel}
        </span>
        <p
          className="opacity-25 display-6 text-truncate"
          style={{ maxWidth: 250 }}
        >
          {x.signature}
        </p>
      </div>
    );
  }
  return (
    <Link className="col-md" key={x.signature} to={"/tx/" + x.signature}>
      {label}
    </Link>
  );
}
