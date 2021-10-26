import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

import SidebarShieldComponent from "./SidebarShieldComponent";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand
        to="/"
        style={{
          textTransform: "none",
          textDecoration: "none",
          verticalAlign: "middle",
        }}
      >
        <div className="w-100 p-3 mr-3 h1 d-flex justify-content-between align-items-center">
          <div>
            <img
              width="100%"
              style={{ minWidth: "64px" }}
              src={require(`../logo/logo.svg`).default}
              alt="POLYSHIELD"
            />
          </div>
          <div className="logo-text">Polyshield</div>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
        <SidebarShieldComponent />
      </CSidebarNav>
      {/* <CSidebarMinimizer className="c-d-md-down-none" /> */}
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
