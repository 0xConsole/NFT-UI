import { CContainer, CCard, CCol, CRow, CCardBody } from "@coreui/react";
import React from "react";
import Vault from "./Vault";

const Vaults = () => {
  return (
    <CContainer>
      <CRow>
        <CCol>
          <Vault poolId={0} compounding={true} />
          <Vault poolId={17} depositsClosed={false} name="wbtc"/>
          <Vault poolId={14} />
          <Vault
            poolId={15}
            exchangeLink={"app.elk.finance"}
            tokenInfoLink={"matic-info.elk.finance"}
            depositsClosed={false}
          />
          <Vault poolId={12} />
          <Vault poolId={1} />
          <Vault poolId={2} depositsClosed={false} name="quick"/>
          <Vault poolId={3} depositsClosed={false} name="wmatic"/>
          <Vault poolId={4} depositsClosed={false} name="usdc"/>
          <Vault poolId={10} depositsClosed={false} name="power"/>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Vaults;
