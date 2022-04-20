import { ErrorCard } from "../components/common/ErrorCard";
import { TableCardBody } from "../components/common/TableCardBody";
import { ResolvedAccountStates } from "./AccountStatesResolver";
import { useCustomAddressLabels } from "./providers";
import { displayTimestamp } from '../utils/date'

import formatDistance from 'date-fns/formatDistance'
import {Slot} from "../components/common/Slot";
import assert from "assert";

export function ResolvedAccountInfosCard({
  resolvedAccountStates,
  accountAddress,
}: {
  resolvedAccountStates?: ResolvedAccountStates;
  accountAddress: string;
}) {
  const [customAddressLabels] = useCustomAddressLabels();
  const customLabel = customAddressLabels.get(accountAddress);
  const label = customLabel ?? `${accountAddress.slice(0, 20)}...`;

  let content;
  if (resolvedAccountStates == null) {
    content = (
      <ErrorCard
        text={
          "No account info resolved, please set `relay.accountProviders` in your .ammanrc.js "
        }
      />
    );
  } else {
    content = []
    for (let idx = resolvedAccountStates.states.length - 1; idx >= 0; idx--) {
        const state = resolvedAccountStates.states[idx];
        content.push(RenderedResolvedAccountState(state, {
          label: `${label} ${idx +1 }`,
          nestedLevel: 0,
        }));
    }
  }

  return <>{content}</>;
}

export function RenderedResolvedAccountState(
  resolvedAccountState: {
    account: Record<string, any>;
    rendered?: string;
    timestamp?: number;
    slot?: number;
  },
  { label, nestedLevel }: { label?: string; nestedLevel: number }
) {
  const rows = Object.entries(resolvedAccountState.account).map(
    ([key, val]) => {
      if (Array.isArray(val)) {
        val =
          val.length <= 10
            ? val.map((x) =>
                RenderedResolvedAccountState(
                  { account: x },
                  { nestedLevel: (nestedLevel ?? 0) + 1, label }
                )
              )
            : JSON.stringify(val, null, 2);
      } else if (val != null && typeof val === "object") {
        val = RenderedResolvedAccountState(
          { account: val },
          { nestedLevel: (nestedLevel ?? 0) + 1, label }
        );
      } else {
        val =
          val === undefined
            ? "undefined"
            : val == null
            ? "null"
            : val.toString();
      }
      return (
        <tr key={`${key}-${nestedLevel}`}>
          <td>{key}</td>
          <td className="text-lg-end font-monospace">{val} </td>
        </tr>
      );
    }
  );
  let content;
  if (resolvedAccountState.rendered != null) {
    content = (
      <div>
        <TableCardBody>{rows}</TableCardBody>
        <h4>Rendered</h4>
        <pre>{resolvedAccountState.rendered}</pre>
      </div>
    );
  } else {
    content = <TableCardBody>{rows}</TableCardBody>;
  }
  if (nestedLevel > 0 ) return (
    <div key={`${label}-${nestedLevel}`} className="p-3 table-bordered">
      {content}
    </div>
  ) 
  const { slot, timestamp } = resolvedAccountState;
  assert(slot != null && timestamp != null, 'slot and timestamp must be defined for each state')
  return (
    <div key={label} className="card p-3 bg-gradient-dark">
      <h3 className="card-header-title mb-4 text-uppercase">{label}</h3>
      <span> Slot: <Slot slot={slot} link />
      <span className="text-muted px-3">
       {formatDistance(timestamp, Date.now(), { addSuffix: true })}, {displayTimestamp(timestamp)}
      </span>
    </span>
      {content}
    </div>
  );
}
