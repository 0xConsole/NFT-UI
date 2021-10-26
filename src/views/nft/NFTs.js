import { CContainer, CCard, CCol, CRow, CCardBody } from "@coreui/react";
import React from "react";
import NFT from "./NFTCard"

const NFTs = () => {
  return (
    <CContainer>
      <CRow>
        <CCol>
        <NFT num={1}/>
        </CCol>
        <CCol>
        <NFT num={2}/>
        </CCol>
        <CCol>
        <NFT num={3}/>
        </CCol>
        <CCol>
        <NFT num={4}/>
        </CCol>
        <CCol>
        <NFT num={5}/>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default NFTs;
