import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CToggler,
  CButton,
  CCol,
} from "@coreui/react";
import { useInterval } from "../hooks/useInterval";
import useContract from "../hooks/useContractOperations";
import { RiShieldUserLine, RiMenuLine } from "react-icons/ri";
import { ChainId } from "../contracts/ContractProvider";
// routes config
import { HalfCircleSpinner } from "react-epic-spinners";

import TransactionQueueSize from "../hooks/TransactionQueueSize";

import ConnectWalletModal from "../wallet/ConnectWalletModal";

const TheHeader = () => {
  const CONTRACT_POLLING_INTERVAL = 4000; // millis
  const [wrongNetwork, setWrongNetwork] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [walletModal, setWalletModal] = React.useState(false);

  const [queueSize, setQueueSize] = React.useState(0);

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const { getNetwork, getAccountInfo, isWeb3Available } = useContract();

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };
  const fetchData = async () => {
    const network = await getNetwork();
    if (network !== ChainId && network !== -1 && network!==undefined) {
      console.log(network);
      setWrongNetwork(true);
    } else {
      setWrongNetwork(false);
    }

    setQueueSize(TransactionQueueSize.size);

    const isWeb3 = await isWeb3Available();
    if (isWeb3) {
      const currentAccount = await getAccountInfo();
      //console.log("currentAccount " + currentAccount)

      if (currentAccount === undefined) {
        setAccount(null);
      }

      if (currentAccount !== account) {
        setAccount(currentAccount);
      }
    }else{
      setAccount(null);
    }
  };

  useInterval(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, CONTRACT_POLLING_INTERVAL);

  return (
    <>
      {walletModal && (
        <ConnectWalletModal close={() => setWalletModal(false)} />
      )}

      <CHeader className="p-3" withSubheader>
        {/* <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      /> */}
        <RiMenuLine
          className="ml-md-3 d-lg-none mt-3 ml-3 h2 menu-btn"
          onClick={toggleSidebarMobile}
        />
        {/*
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      /> */}
        {/* <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo" />
      </CHeaderBrand> */}

        {queueSize > 0 && (
          <CHeaderNav className="px-3">
            <CCol>
              <CButton color="primary">
                <HalfCircleSpinner
                  size="16"
                  color="#fff"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />{" "}
                {queueSize} {} pending{" "}
                {queueSize > 1 ? " transactions" : " transaction"}
              </CButton>
            </CCol>
          </CHeaderNav>
        )}

        {/* <CHeaderBrand className="mx-auto" to="/"><img id="header-logo" height="72"
        src={require(`../logo/logo.svg`).default}
        alt="POLYSHIELD" /></CHeaderBrand> */}

        {/* <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <></>
        </CHeaderNavItem>
      </CHeaderNav> */}

        {wrongNetwork && (
          <CHeaderNav className="px-3">
            <div className="text-warning">
              Wrong network: Please connect to Polygon Mainnet
            </div>
          </CHeaderNav>
        )}

        {account !== null && account !== undefined ? (
          <CHeaderNav className="px-3 ml-auto">
            <CCol>
              <CButton color="warning">
                <RiShieldUserLine
                  style={{ marginTop: "-2px", marginRight: "2px" }}
                />
                {account.substring(0, 6)}..
                {account.substring(account.length - 4)}
              </CButton>
            </CCol>
          </CHeaderNav>
        ) : (
          <CHeaderNav className="px-3 ml-auto">
            <CCol>
              <CButton color="warning" onClick={() => setWalletModal(true)}>
                <RiShieldUserLine
                  style={{ marginTop: "-2px", marginRight: "2px" }}
                />
                Connect
              </CButton>
            </CCol>
          </CHeaderNav>
        )}

        {/* 
      <CHeaderNav className="px-3">
        <CToggler
          inHeader
          className="ml-3 d-md-down-none c-d-legacy-none"
          onClick={() => dispatch({type: 'set', darkMode: !darkMode})}
          title="Toggle Light/Dark Mode"
        >
          <CIcon name="cil-moon" className="c-d-dark-none" alt="CoreUI Icons Moon" />
          <CIcon name="cil-sun" className="c-d-default-none" alt="CoreUI Icons Sun" />
        </CToggler>
        <CToggler
          inHeader
          className="d-md-down-none"
          onClick={() => dispatch({type: 'set', asideShow: !asideShow})}
        >
          <CIcon className="mr-2" size="lg" name="cil-applications-settings" />
        </CToggler>
      </CHeaderNav> */}
      </CHeader>
    </>
  );
};

export default TheHeader;
