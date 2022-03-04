import React from "react";
import Logo from "img/logos-solana/dark-explorer-logo.svg";
import { clusterPath } from "utils/url";
import { Link, NavLink } from "react-router-dom";
import { ClusterStatusButton } from "components/ClusterStatusButton";

export function Navbar() {
  // TODO: use `collapsing` to animate collapsible navbar
  const [collapse, setCollapse] = React.useState(false);
  // TODO(thlorenz): Total hack to fix static resources like this not working on gh-pages
  const logo =
    process.env.NODE_ENV === "production" ? (
      <img
        src="./build/static/media/dark-explorer-logo.2d910a55.svg"
        width="250"
        alt="Solana Explorer"
      />
    ) : (
      <img src={Logo} width="250" alt="Solana Explorer" />
    );

  return (
    <nav className="navbar navbar-expand-md navbar-light">
      <div className="container">
        <Link to={clusterPath("/")}>
          <span>Amman</span>
          {logo}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setCollapse((value) => !value)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ms-auto me-4 ${
            collapse ? "show" : ""
          }`}
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to={clusterPath("/")} exact>
                Cluster Stats
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={clusterPath("/supply")}>
                Supply
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={clusterPath("/tx/inspector")}>
                Inspector
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="d-none d-md-block">
          <ClusterStatusButton />
        </div>
      </div>
    </nav>
  );
}
