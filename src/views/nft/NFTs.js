import { CContainer, CCard, CCol, CRow, CCardBody } from "@coreui/react";
import React from "react";
import NFT from "./NFTCard"

const NFTs = () => {

  return (
    <CContainer>
      <CRow>
        <CCol>
        <NFT tokenId={1} allockPoint={10}/>
        </CCol>
        <CCol>
        <NFT tokenId={2} allockPoint={20}/>
        </CCol>
        <CCol>
        <NFT tokenId={3} allockPoint={30}/>
        </CCol>
        <CCol>
        <NFT tokenId={4} allockPoint={40}/>
        </CCol>
        <CCol>
        <NFT tokenId={5} allockPoint={50}/>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default NFTs;
