import {useDebounceCallback} from "@react-hook/debounce";
import { Link, useHistory, useLocation } from "react-router-dom";
import {useQuery} from "../utils/url";
import { useCustomAddressLabels, useTransactionsMonitor } from "./providers";
import { TransactionInfo } from "./TransactionsMonitor";

export function TransactionsMonitorView() {
  const [transactionInfos] = useTransactionsMonitor();
  const [customAddressLabels] = useCustomAddressLabels();
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const loadTxHistory = query.has("loadTransactionHistory")

  // TODO(thlorenz): Make those buttons just a simple link
  const historyToggleLink = { ...location, search: query.toString() }

  function onReloadWithHistory() {
      query.set("loadTransactionHistory", "true");
      history.push({ ...location, search: query.toString() });
      window.location.reload()
  }
  function onReloadWithoutHistory() {
      query.delete("loadTransactionHistory");
      history.push({ ...location, search: query.toString() });
      window.location.reload()
  }

  return (
    <div className="header-signatures container my-4">
      <h5 className="d-inline">Recent Transactions</h5>
      <div className="fs-5 d-inline ms-4 text-muted">
        {!loadTxHistory &&
          <button
            className="btn btn-secondary fs-6"
            type="button"
            onClick={onReloadWithHistory}
          >Reload with History</button> 
        }
        {loadTxHistory &&
          <Link
            className="btn btn-secondary fs-6 float-end pb-0"
            style={{marginLeft: '-200px' }}
            click={onReloadWithoutHistory}
          >Reload without History</button> 
        }
      </div>
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
