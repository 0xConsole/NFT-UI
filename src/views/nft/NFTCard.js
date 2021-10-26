import { CContainer, CCard, CCol, CRow, CCardBody, CCardTitle, CCardFooter, CButton } from "@coreui/react";
import React from "react";

import { useTransactionMonitor } from "../../hooks/useTransactionMonitor";
import ConnectedWeb3Provider from "../../wallet/ConnectedWeb3Provider";

import { IERC20 } from "../../contracts/contractABI";
import {
    ChainId,
    web3,
    getTokenPriceInDollars,
  } from "../../contracts/ContractProvider";



const NFT = (props) => {
    return (
        <CCard>
            <CCardTitle>x10 {props.num}</CCardTitle>
            <CCardBody>

            <img
              src={require(`../../logo/rotate.webp`).default}
              width="100%"
              alt="Rotating SHI3LD"
            />

                <CButton>Claim</CButton>
                <CButton>Sell</CButton>
                <CButton>Cancel Sale</CButton>
            </CCardBody>
            <CCardFooter></CCardFooter>
        </CCard>
    );
  };
  export default NFT;
  