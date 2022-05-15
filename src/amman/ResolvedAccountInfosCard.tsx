import { ErrorCard } from "../components/common/ErrorCard";
import { TableCardBody } from "../components/common/TableCardBody";
import {
  AccountDiffType,
  AccountStatesResolver,
  ResolvedAccountStates,
} from "./AccountStatesResolver";
import { useCustomAddressLabels } from "./providers";
import { displayTimestamp } from "../utils/date";

import formatDistance from "date-fns/formatDistance";
import { Slot } from "../components/common/Slot";
import assert from "assert";
import { InfoTooltip } from "../components/common/InfoTooltip";
import { Link } from "react-router-dom";

function classForDiff(diff?: AccountDiffType) {
  if (diff == null) return "";
  switch (diff) {
    case AccountDiffType.Added:
      return "text-warning";
    case AccountDiffType.Removed:
      return "text-danger";
    case AccountDiffType.Changed:
      return "text-primary";
  }
}

function maybeTooltip(
  diff: AccountDiffType | undefined,
  val: string,
  bottom: boolean = false
) {
  if (diff == null) return val;
  switch (diff) {
    case AccountDiffType.Added:
      return (
        <InfoTooltip right bottom={bottom} text="Property was added">
          {val}
        </InfoTooltip>
      );
    case AccountDiffType.Removed:
      return (
        <InfoTooltip right bottom={bottom} text="Property was removed">
          {val}
        </InfoTooltip>
      );
    case AccountDiffType.Changed:
      return (
        <InfoTooltip right bottom={bottom} text="Property was updated">
          {val}
        </InfoTooltip>
      );
  }
}

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
  if (
    resolvedAccountStates == null ||
    resolvedAccountStates.states.length === 0
  ) {
    content = (
      <ErrorCard
        text={
          "No account info resolved, please set `relay.accountProviders` in your .ammanrc.js "
        }
      />
    );
    // Request account states update here. This will asynchronously resolve the
    // states from the Relay and only cause rerender if the states changed.
    // See: src/amman/AccountStatesResolver.ts `onResolvedAccountStates`
    AccountStatesResolver.instance.requestAccountStates(accountAddress);
  } else {
    content = [];
    for (let idx = resolvedAccountStates.states.length - 1; idx >= 0; idx--) {
      const state = resolvedAccountStates.states[idx];
      content.push(
        RenderedResolvedAccountState(state, {
          label: `${label} ${idx + 1}`,
          nestedLevel: 0,
          path: "",
        })
      );
    }
  }

  return (
    <>
      <Link
        className="fs-5 d-inline ms-4 text-muted"
        to={"#"}
        onClick={() =>
          AccountStatesResolver.instance.requestAccountStates(accountAddress)
        }
      >
        Update
      </Link>
      {content}
    </>
  );
}

export function RenderedResolvedAccountState(
  resolvedAccountState: {
    account: Record<string, any>;
    accountDiff?: Map<string, AccountDiffType>;
    rendered?: string;
    timestamp?: number;
    slot?: number;
  },
  {
    label,
    nestedLevel,
    path,
  }: { label?: string; nestedLevel: number; path: string }
) {
  let rowIdx = 0;
  const rows = Object.entries(resolvedAccountState.account).map(
    ([key, val]) => {
      const keyPath = path.length === 0 ? key : `${path}.${key}`;
      if (Array.isArray(val)) {
        val =
          val.length <= 10
            ? val.map((x) =>
                RenderedResolvedAccountState(
                  { account: x },
                  { nestedLevel: (nestedLevel ?? 0) + 1, label, path: keyPath }
                )
              )
            : JSON.stringify(val, null, 2).slice(0, 150) + " …";
      } else if (val != null && typeof val === "object") {
        val = RenderedResolvedAccountState(
          { account: val, accountDiff: resolvedAccountState.accountDiff },
          { nestedLevel: (nestedLevel ?? 0) + 1, label, path: keyPath }
        );
      } else {
        val =
          val === undefined
            ? "undefined"
            : val == null
            ? "null"
            : val.toString();
      }
      const markKey = Array.isArray(val) || typeof val === "object";

      let keyDiff = undefined;
      let keyClassname = "text-lg-end font-monospace";
      let valDiff = undefined;
      let valClassname = "text-lg-end font-monospace";
      if (markKey) {
        keyDiff = resolvedAccountState.accountDiff?.get(keyPath);
        const keyDiffClass = classForDiff(keyDiff);
        keyClassname += ` ${keyDiffClass}`;
      } else {
        valDiff = resolvedAccountState.accountDiff?.get(keyPath);
        const valDiffClass = classForDiff(valDiff);
        valClassname += ` ${valDiffClass}`;
      }

      rowIdx++;

      return (
        <tr key={`${key}-${nestedLevel}`}>
          <td className={keyClassname}>
            {maybeTooltip(keyDiff, key, rowIdx <= 2)}
          </td>
          <td className={valClassname}>
            {maybeTooltip(valDiff, val, rowIdx <= 2)}
          </td>
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
  if (nestedLevel > 0)
    return (
      <div key={`${label}-${nestedLevel}`} className="p-3 table-bordered">
        {content}
      </div>
    );
  const { slot, timestamp } = resolvedAccountState;
  assert(
    slot != null && timestamp != null,
    "slot and timestamp must be defined for each state"
  );
  return (
    <div key={label} className="card p-3 bg-gradient-dark">
      <h3 className="card-header-title mb-4">
        <span className="px-3">
          <Slot slot={slot} link />
        </span>
        <span className="text-uppercase">{label}</span>
        <small className="text-muted px-3">
          {formatDistance(timestamp, Date.now(), { addSuffix: true })},{" "}
          {displayTimestamp(timestamp)}
        </small>
      </h3>
      {content}
    </div>
  );
}
