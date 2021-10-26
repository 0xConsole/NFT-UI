import React from "react";
import { CContainer, CCol, CRow } from "@coreui/react";

import Farm from "./Farm";

const Farms = () => {
  return (
    <CContainer>
      <CRow>
        <CCol>
          <Farm poolId={9} compounding={true} />
          <Farm poolId={8} compounding={true} />
          <Farm poolId={13} compounding={true} />
          <Farm poolId={16} exchangeLink={"app.elk.finance"} tokenInfoLink={"matic-info.elk.finance"}  compounding={true}/>
          <Farm poolId={7} />
          <Farm poolId={6} />
          <Farm poolId={5} />
          <Farm poolId={11} />
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Farms;
