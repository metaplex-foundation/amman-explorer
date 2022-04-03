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

  // TODO(thlorenz): This reloads the page which is kinda hacky, but
  // it'll be tricky to update the TransactionsMonitor after it was initialized
  const loadTxHistory = query.has("loadTransactionHistory")
  const onLoadHistoryInput = useDebounceCallback((event: any) => {
    console.log(event.target.checked)
      if (event.target.checked) {
        query.set("loadTransactionHistory", "true");
      } else {
        query.delete("loadTransactionHistory")
      }
      history.push({ ...location, search: query.toString() });
      window.location.reload()
  }, 200);

  return (
    <div className="header-signatures container my-4">
      <h5 className="d-inline">Recent Transactions</h5>
      <div className="fs-5 d-inline ms-4 text-muted">
        <label className="form-check-label secondary" htmlFor="historyToggle">Include History</label>
        <input
          type="checkbox"
          id="historyToggle"
          defaultChecked={loadTxHistory}
          className="form-check-input ms-2 mt-1"
          onChange={onLoadHistoryInput}
        />
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
