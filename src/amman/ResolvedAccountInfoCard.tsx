import { ErrorCard } from "../components/common/ErrorCard";
import { TableCardBody } from "../components/common/TableCardBody";
import { ResolvedAccountInfo } from "./AccountInfoResolver";
import { useCustomAddressLabels } from "./providers";

export function ResolvedAccountInfoCard({
  resolvedAccountInfo,
  accountAddress,
}: {
  resolvedAccountInfo?: ResolvedAccountInfo;
  accountAddress: string;
}) {
  const [customAddressLabels] = useCustomAddressLabels();
  const customLabel = customAddressLabels.get(accountAddress);
  const label = customLabel ?? `${accountAddress.slice(0, 20)}...`;

  let content;
  if (resolvedAccountInfo == null) {
    content = (
      <ErrorCard
        text={
          "No account info resolved, please set `relay.accountProviders` in your .ammanrc.js "
        }
      />
    );
  } else {
    const rows = Object.entries(resolvedAccountInfo.pretty).map(
      ([key, val]) => (
        <tr>
          <td className="">{key}</td>
          <td className="text-lg-end font-monospace">{val} </td>
        </tr>
      )
    );
    content = <TableCardBody>{rows}</TableCardBody>;
  }
  return (
    <div>
      <h3 className="card-header-title mb-4 text-uppercase">{label}</h3>
      {content}
    </div>
  );
}
