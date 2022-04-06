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
        return RenderedResolvedAccountInfo(x, {
          label: `${label} ${slot}`,
          nestedLevel: 0,
        });
      });
  }

  return <>{content}</>;
}

export function RenderedResolvedAccountInfo(
  resolvedAccountInfo: ResolvedAccountInfo,
  { label, nestedLevel }: { label?: string; nestedLevel: number }
) {
  const rows = Object.entries(resolvedAccountInfo.pretty).map(([key, val]) => {
    if (Array.isArray(val)) {
      
      val = val.length <= 10 ? val.map((x) =>
        RenderedResolvedAccountInfo(
          { pretty: x },
          { nestedLevel: (nestedLevel ?? 0) + 1, label }
        )
      ): JSON.stringify(val, null, 2);
    } else if (val != null && typeof val === "object") {
      val = RenderedResolvedAccountInfo(
        { pretty: val },
        { nestedLevel: (nestedLevel ?? 0) + 1, label }
      );
    } else {
      val =
        val === undefined ? "undefined" : val == null ? "null" : val.toString();
    }
    return (
      <tr key={`${key}-${nestedLevel}`}>
        <td>{key}</td>
        <td className="text-lg-end font-monospace">{val} </td>
      </tr>
    );
  });
  let content;
  if (resolvedAccountInfo.rendered != null) {
    content = (
      <div>
        <TableCardBody>{rows}</TableCardBody>
        <h4>Rendered</h4>
        <pre>{resolvedAccountInfo.rendered}</pre>
      </div>
    );
  } else {
    content = <TableCardBody>{rows}</TableCardBody>;
  }
  return nestedLevel > 0 ? (
    <div key={`${label}-${nestedLevel}`} className="p-3 table-bordered">
      {content}
    </div>
  ) : (
    <div key={label} className="card p-3 bg-gradient-dark">
      <h3 className="card-header-title mb-4 text-uppercase">{label}</h3>
      {content}
    </div>
  );
}
