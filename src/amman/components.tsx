import { Link } from "react-router-dom";
import { useCustomAddressLabels, useTransactionsMonitor } from "./providers";
import { TransactionInfo } from "./TransactionsMonitor";

export function TransactionsMonitorView() {
  const [transactionInfos] = useTransactionsMonitor();
  const [customAddressLabels] = useCustomAddressLabels();
  return (
    <div className="header-signatures container my-4">
      <h5>Recent Transactions</h5>
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
