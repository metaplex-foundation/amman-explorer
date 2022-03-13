import { ErrorCard } from "../components/common/ErrorCard";
import { TableCardBody } from "../components/common/TableCardBody";
import { ResolvedAccountInfo } from "./AccountInfoResolver";
import { useCustomAddressLabels } from "./providers";

export function ResolvedAccountInfosCard({
  resolvedAccountInfos,
  accountAddress,
}: {
  resolvedAccountInfos?: ResolvedAccountInfo[];
  accountAddress: string;
}) {
  const [customAddressLabels] = useCustomAddressLabels();
  const customLabel = customAddressLabels.get(accountAddress);
  const label = customLabel ?? `${accountAddress.slice(0, 20)}...`;

  let content;
  if (resolvedAccountInfos == null) {
    content = (
      <ErrorCard
        text={
          "No account info resolved, please set `relay.accountProviders` in your .ammanrc.js "
        }
      />
    );
  } else {
    const len = resolvedAccountInfos.length;
    content = Array.from(resolvedAccountInfos)
      .reverse()
      .map((x, idx) => {
        const slot = len - idx;
        return RenderedResolvedAccountInfo(x, `${label} ${slot}`);
      });
  }

  return <>{content}</>;
}

export function RenderedResolvedAccountInfo(
  resolvedAccountInfo: ResolvedAccountInfo,
  label: string
) {
  const rows = Object.entries(resolvedAccountInfo.pretty).map(([key, val]) => (
    <tr key={key}>
      <td className="">{key}</td>
      <td className="text-lg-end font-monospace">{val} </td>
    </tr>
  ));
  let content;
  if (resolvedAccountInfo.rendered != null) {
    content = (
      <>
        <TableCardBody>{rows}</TableCardBody>
        <h4>Rendered</h4>
        <pre>{resolvedAccountInfo.rendered}</pre>
      </>
    );
  } else {
    content = <TableCardBody>{rows}</TableCardBody>;
  }
  return (
    <>
      <div key={label} className="card p-3 bg-gradient-dark">
        <h3 className="card-header-title mb-4 text-uppercase">{label}</h3>
        {content}
      </div>
    </>
  );
}
