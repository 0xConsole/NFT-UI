import React from "react";
import { ArkenWidget } from "arken-widget";
import { useLocation } from "react-router-dom";
import { HollowDotsSpinner } from "react-epic-spinners";

const Buy = ({ baseTokenAddress }) => {
  let location = useLocation();
  console.log(location.buyProps);
  return (
    <div style={{ position: "relative" }}>
      <HollowDotsSpinner
        color="#00f792"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <ArkenWidget
        chain="polygon"
        mode="dark"
        themeColor="rgba(0, 247, 146, 0.5)"
        themeTextColor="#f5f5f5"
        baseTokenAddress={
          location.buyProps
            ? location.buyProps.address
            : "0xf239e69ce434c7fb408b05a0da416b14917d934e"
        }
        quoteTokenAddress="0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
        externalTopTokenAddress={[]}
        graphRange={1}
        //enableGraph
        containerStyle={{
          width: "100%",
          marginTop: "64px",
        }}
      />
    </div>
  );
};

export default Buy;
