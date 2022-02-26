import { Link } from "react-router-dom";
import { customAddressLabels } from "../utils/custom-address-labels";
import { useTransactionsMonitor } from "./providers";

export function TransactionsMonitorView() {
  const [transactionSignatures] = useTransactionsMonitor();

  return (
    <div className="header-signatures container my-4">
      <h5>Recent Transactions</h5>
      <div className="row align-items-center">
        {transactionSignatures.map((x) => {
          let label = <span>{x}</span>;
          const addressLabel = customAddressLabels.get(x);
          if (addressLabel != null) {
            label = (
              <>
                <span>{addressLabel}</span> <p className="opacity-25">{x}</p>
              </>
            );
          }
          return (
            <Link className="col" key={x} to={"/tx/" + x}>
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
