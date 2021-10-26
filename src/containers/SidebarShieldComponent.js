import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CButton, CCol } from "@coreui/react";
import { useInterval } from "../hooks/useInterval";
import { BASE_Address } from "../contracts/ContractProvider";
import {
  RiDiscordFill,
  RiExternalLinkLine,
  RiTelegramFill,
  RiTwitterFill,
  RiSwapLine,
  RiStockLine,
} from "react-icons/ri";

const SidebarShieldComponentt = () => {
  const CONTRACT_POLLING_INTERVAL = 30000; // millis

  const [tokenPriceInDollars, setTokenPriceInDollars] = React.useState(0);

  const fetchData = async () => {
    const response = await fetch(
      "https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json"
    );
    // waits until the request completes...
    const item = await response.json();
    //console.log(item)
    setTokenPriceInDollars(item.shieldPrice);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useInterval(() => {
    try {
      fetchData();
    } catch (error) {}
  }, CONTRACT_POLLING_INTERVAL);

  return (
    <div
      className="w-100 p-2 mb-3"
      style={{ position: "absolute", bottom: "0" }}
    >
      <CCol className="text-primary mb-1 text-center">
        Price:{" "}
        <span style={{ color: "#ffffff" }}>
          ${parseFloat(tokenPriceInDollars).toFixed(3)}
        </span>
      </CCol>

      <CCol className="w-100">
        {/* <a
          style={{ textDecoration: "none", color: "#fff" }}
          href={`https://quickswap.exchange/#/swap/${BASE_Address}`}
          target="_blank"
          rel="noreferrer"
        > */}
        <NavLink to="/buy">
          <CButton block color="warning">
            BUY NOW
            {/* <RiExternalLinkLine style={{ marginTop: "-3px" }} /> */}
          </CButton>
        </NavLink>
        {/* </a> */}
      </CCol>
      <CCol className="w-100 d-flex justify-content-between align-items-center mt-3">
        <a
          href="https://discord.gg/GNpHaA5nfu"
          rel="noreferrer"
          target="_blank"
        >
          <RiDiscordFill className="icon-color" />
        </a>
        <a href="https://t.me/polyshield" rel="noreferrer" target="_blank">
          <RiTelegramFill className="icon-color" />
        </a>
        <a
          href="https://twitter.com/TeamPolyShield"
          rel="noreferrer"
          target="_blank"
        >
          <RiTwitterFill className="icon-color" />
        </a>
        <a
          href={
            "https://quickswap.exchange/#/swap?outputCurrency=" + BASE_Address
          }
          rel="noreferrer"
          target="_blank"
        >
          <RiSwapLine className="icon-color" />
        </a>
        <a
          href={"https://swap.arken.finance/tokens/polygon/" + BASE_Address}
          rel="noreferrer"
          target="_blank"
        >
          <RiStockLine className="icon-color" />
        </a>
      </CCol>
      <CCol className="w-100 d-flex justify-content-around align-items-center mt-3 small audits">
        <a
          href="https://raw.githubusercontent.com/polyshield-finance/audit-reports/main/HazeSecurity_Polyshield.pdf"
          rel="noreferrer"
          target="_blank"
        >
          HAZE AUDIT
        </a>{" "}
        -<a href="https://paladinsec.co/projects/polyshield/">PALADIN AUDIT</a>
      </CCol>

      <CCol className="mt-3 w-100 d-flex justify-content-between align-items-center">
        <div>
          <a
            style={{
              textDecoration: "none",
              color: "#fff",
              paddingLeft: "8px",
            }}
            href="https://rugdoc.io/project/polyshield-finance/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="RugDoc"
              src="/rugdoc-review-badge-with-glow.png"
              width="96"
            />
          </a>
        </div>
        <div>
          <a
            style={{
              textDecoration: "none",
              color: "#fff",
              paddingRight: "8px",
            }}
            href="https://6kstarter.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="6KSTARTER" src="/6k.png" height="31" />
          </a>
        </div>
      </CCol>
    </div>
  );
};

export default SidebarShieldComponentt;
