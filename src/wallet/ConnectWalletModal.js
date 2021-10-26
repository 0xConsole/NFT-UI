import React from "react";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";


import ConnectedWeb3Provider from "../wallet/ConnectedWeb3Provider";

const {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} = require("@coreui/react");

const ConnectWalletModal = (props) => {
  const [hidden, setHidden] = React.useState(false);
  const [chainError, setChainError] = React.useState(false);

  const onMetamaskConnect = async () => {
    const web3I = new Web3(Web3.givenProvider);
    await web3I.eth.requestAccounts().catch(() => { });
    props.close();
  };

  const onWalletConnect = async () => {

  const maticProvider = new WalletConnectProvider(
    {
        chainId: 137,
        rpc: {
            137: "https://polygon-rpc.com/",
          }
    }
  )

    maticProvider.on("unhandledRejection", (error) => {
      // Will print "unhandledRejection err is not defined"
      console.log("unhandledRejection", error.message);
    });

    // Subscribe to accounts change
    maticProvider.on("accountsChanged", (accounts) => {
      console.log(accounts);
      console.log(maticProvider);
      const walletConnectWeb3 = new Web3(maticProvider);
      ConnectedWeb3Provider.web3 = walletConnectWeb3;
      ConnectedWeb3Provider.wallet = "WalletConnect";
    });

    // Subscribe to chainId change
    maticProvider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    maticProvider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      ConnectedWeb3Provider.web3 = null;
    });

    try {
      console.log(maticProvider);

      const result = await maticProvider.enable().catch((err) => { console.log(err);  maticProvider.qrcodeModal.close();});
      // console.log(maticProvider)
      if (maticProvider.chainId !== 137) {
        // wrong chain.
        setChainError(true);
        setHidden(false);
        maticProvider.disconnect();
      } else {
        // connected on correct chain

        // end of
        props.close();
        setHidden(true);
      }

      //const walletConnectWeb3 = new Web3(maticProvider)
      //let accounts = await walletConnectWeb3.eth.getAccounts();
      //console.log(accounts)
      //  if (maticProvider.connected===true)

      //const walletConnectWeb3 = new Web3(maticProvider)
      //let accounts = await walletConnectWeb3.eth.getAccounts();
      //const networkId = await walletConnectWeb3.eth.net.getId();

      //console.log(result)
    } catch (error) {
      console.log(error);
    }
  };

  // rendering
  if (hidden === true) return null;

  return (
    <CModal centered color="secondary" show onClose={props.close} size="sm">
      <CModalHeader closeButton>
        <CModalTitle className="text-primary">Choose Wallet</CModalTitle>
      </CModalHeader>

      {chainError === true ? (
        <CModalBody className="text-warning">
          Wrong Chain Id. <p />
          First connect your wallet to the Polygon Mainnet. <p />
        </CModalBody>
      ) : (
        <CModalBody style={{ backgroundColor: "#000106" }}>
          <table width="100%">
            <tr
              onClick={() => onMetamaskConnect()}
              style={{ cursor: "pointer" }}
            >
              <td align="left">
                <span className="text-white">Metamask</span>
              </td>
              <td align="right">
                <div className="float-right" color="warning">
                  <img
                    alt="Metamask"
                    src={require(`./logos/metamask.svg`).default}
                    height="40"
                  />
                </div>
              </td>
            </tr>
            <p />
            {/** 
            <tr>
                <td align="left"><h5 className="text-info">Trust Wallet </h5></td>
                <td align="right">            
                    <div
                        style={{cursor: 'pointer'}}
                        className="float-right"
                        color="warning"
                        onClick={() => onMetamaskConnect()}
                    ><img alt="Metamask" src={require(`./logos/TWT.svg`).default} height="40"/></div>
                </td>
            </tr>
            <p/>*/}

            <tr onClick={() => onWalletConnect()} style={{ cursor: "pointer" }}>
              <td align="left">
                <span className="text-white">WalletConnect</span>
              </td>
              <td align="right">
                <div className="float-right" color="warning">
                  <img
                    alt="Metamask"
                    src={require(`./logos/walletconnect.svg`).default}
                    height="40"
                  />
                </div>
              </td>
            </tr>
          </table>
        </CModalBody>
      )}
    </CModal>
  );
};

export default ConnectWalletModal;
 