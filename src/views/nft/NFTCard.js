import {
  CContainer, CCard, CCol, CRow, CCardBody, CCardTitle, CCardFooter, CButton, CButtonGroup, CBadge,
  CInput,
  CFormText,
  CLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
} from "@coreui/react";
import React, {useEffect} from "react";

import useContract from "../../hooks/useContractOperations";
import { useInterval } from "../../hooks/useInterval";
import { IERC20 } from "../../contracts/contractABI";


import {
  ChainId,
  web3,
  NFTBasicContract,
  NFTMarketContract,
  PolyshieldContract, NFTBasic_Address, NFTMarket_Address,NFTMarketABI, NFTBasicABI
} from "../../contracts/NFTContractProvider";

import ConnectedWeb3Provider from "../../wallet/ConnectedWeb3Provider";
import ConnectWalletModal from "../../wallet/ConnectWalletModal";
import {MasterChefContract} from "../../contracts/ContractProvider";
import {useTransactionMonitor} from "../../hooks/useTransactionMonitor";
import { useTestnetTransactionMonitor } from "../../hooks/useTestnetTransactionMonitor";
import {HollowDotsSpinner} from "react-epic-spinners";


const NFT = (props) => {

  const { getNetwork, getAccountInfo, isWeb3Available, requestAccounts } = useContract();
  const [wrongNetwork, setWrongNetwork] = React.useState(false);
  const [userData, setUsertData] = React.useState({});
  const [account, setAccount] = React.useState(null);

  const [loading, setLoading] = React.useState(true);

  const [owner, setOwner] = React.useState(null);
  const [isOwner, setIsOwner] = React.useState(false);

  // sell part
  const [modal, setModal] = React.useState(false);
  const [sellAmount, setSellAmount] = React.useState(0);
  const [isApprove, setIsApprove] = React.useState(false);
  const [isSellPending, setIsSellPending] = React.useState(false);
  const [itemId, setItemId] = React.useState(0);

  // buy part
  const [sellPrice, setSellPrice] = React.useState(0);
  const { monitorTransaction } = useTestnetTransactionMonitor();

  // claim part
  const [claimAmount, setClaimAmount] = React.useState(0);


  const fetchData = async () => {
      try {
        const network = await getNetwork();
        if (network !== ChainId && network !== -1) {
          //console.log(network);
          setWrongNetwork(true);
        } else {
          setWrongNetwork(false);
        }
      } catch (e) {}

      // USER DATA
      try {
        let uData = {  };
        // does the browser have web3?
        const isWeb3 = await isWeb3Available();
        if (isWeb3) {
          const currentAccount = await getAccountInfo();
          console.log(currentAccount)
          if (currentAccount === undefined) {
            setAccount(null);
          }

          if (currentAccount !== account) {

            setAccount(currentAccount);
          }

        } else {
          setAccount(null);
        }

        setUsertData(uData);

        const nftowner = await NFTBasicContract.methods.ownerOf(props.tokenId).call();
        setOwner(nftowner);
        if(nftowner === account) {
          setIsOwner(true);
        }

        const approveAddress = await NFTBasicContract.methods.getApproved(props.tokenId).call();
        setIsApprove(approveAddress === NFTMarket_Address);

        const claimAmountFrom = await NFTBasicContract.methods.getClaimableAmount(props.tokenId).call();
        setClaimAmount(parseFloat(web3.utils.fromWei(claimAmountFrom.toString(), "ether")).toFixed(2));

        const nftMarketItemId = await NFTMarketContract.methods.contractToTokenToItemId(NFTBasic_Address, props.tokenId).call();
        setItemId(nftMarketItemId);

        const  idToMarketItem = await NFTMarketContract.methods.idToMarketItem(itemId).call();
        setIsSellPending(idToMarketItem.seller === account);

        if(itemId > 0) {
          setIsApprove(approveAddress === account);
          setSellPrice(web3.utils.fromWei(idToMarketItem.price.toString(), "ether"));
        }


      } catch (e) {}
      setLoading(false);
    }; // end fetch data

    useInterval(() => {
      fetchData();
      // fetchAPRCalculations();
    }, 5000);

    useEffect(() => {
      fetchData();
    }, []);

    const onSellAmountChange = (evt) => {
      const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;
      if (rx_live.test(evt.target.value)) {
        const supply = evt.target.value;
        setSellAmount(supply);
      }
    };

    const approve = async (_tokenId, _account, _approveAccount) => {
      if (_account === null || _account === undefined) return false;
      const web3I = ConnectedWeb3Provider.web3;

      const _NFTBasic_Address = new web3I.eth.Contract(
        NFTBasicABI,
        NFTBasic_Address
      );

      _NFTBasic_Address.methods
        .approve(_approveAccount, _tokenId)
        .send( { from: _account } )
        .then(function (e) {
          setIsApprove(true)
        })
        .catch(() => {
          // alert('something net wrong');
        });
    }

    const sellNft = async (_tokenId, _sellAmount, _account) => {

      if (_account === null || _account === undefined) return false;
      const web3I = ConnectedWeb3Provider.web3;

      const _NFTMarketContract = new web3I.eth.Contract(
        NFTMarketABI,
        NFTMarket_Address
      );

      _sellAmount = web3.utils.toWei(sellAmount.toString(), "ether");
      _NFTMarketContract.methods
        .createMarketItem(NFTBasic_Address, _tokenId, _sellAmount.toString(),'')
        .send( { from: _account } ).then(function (e){
          setIsApprove(false);
          setIsSellPending(true);
          setModal(false);
        })
        .catch(() => {});

    }

    const cancelSell = async (_itemId, _account) => {

      if (_account === null || _account === undefined) return false;
      const web3I = ConnectedWeb3Provider.web3;

      const _NFTMarketContract = new web3I.eth.Contract(
        NFTMarketABI,
        NFTMarket_Address
      );

      _NFTMarketContract.methods
        .cancelMarketItem(_itemId)
        .send( { from: _account } ).then(function (e) {
          setIsSellPending(false);
        })
        .catch(() => {});

    }

   const buy = async (_itemId, _account) => {
    if (_account === null || _account === undefined) return false;
    const web3I = ConnectedWeb3Provider.web3;

    const _NFTMarketContract = new web3I.eth.Contract(
      NFTMarketABI,
      NFTMarket_Address
    );

    _NFTMarketContract.methods
      .createMarketSale(_itemId)
      .send( { from: _account, value: web3.utils.toWei(sellPrice.toString(), "ether") } ).then(function (e){
      // setIsApprove(false);
      setIsSellPending(false);
    })
      .catch(() => {});

  }
    const claim = async (_tokenId, _account) => {
      if (_account === null || _account === undefined) return false;
      const web3I = ConnectedWeb3Provider.web3;

      const _NFTBasic_Address = new web3I.eth.Contract(
        NFTBasicABI,
        NFTBasic_Address
      );

      _NFTBasic_Address.methods
        .claim(_tokenId)
        .send( { from: _account } )
        .then(function (e) {
          setClaimAmount(0)
        })
        .catch(() => {
          // alert('something net wrong');
        });
    }


    return (
        <>

        <CCard>
            <CCardTitle>x{props.allockPoint} {props.tokenId}</CCardTitle>
            <CCardBody>

                <img
                  src={require(`../../logo/rotate.webp`).default}
                  width="100%"
                  alt="Rotating SHI3LD"
                />
              <h2><CBadge color="primary" size="sm" shape="rounded-pill">Claim: {claimAmount} SHI3LD</CBadge></h2>
              {!loading ? (
                <>
                  { isOwner || isSellPending ? (
                    <CButtonGroup role="group" aria-label="Owner buttons">
                      {itemId > 0 && isSellPending?
                        (
                          <CButton color="primary" variant="outline" onClick={() => cancelSell(itemId, account)}>Cancel Sale</CButton>
                        )
                        : (
                          <>
                            {claimAmount > 0 && (
                              <CButton color="primary" variant="outline" onClick={() => claim(props.tokenId, account)}>Claim</CButton>
                            )}
                            {!isApprove ? (
                              <CButton color="primary" variant="outline" onClick={ () => approve(props.tokenId,account, NFTMarket_Address)}>Approve</CButton>
                            ) : (
                              <CButton color="primary" variant="outline"
                                       onClick={() => setModal(true)}
                              >Sell</CButton>
                            )}
                          </>
                        )}
                    </CButtonGroup>
                  ): (
                    itemId > 0 && (
                      <>
                      <h2><CBadge color="primary" size="sm" shape="rounded-pill">{sellPrice} Matic</CBadge></h2>
                      <CButton color="primary" variant="outline"
                                 onClick={() => buy(itemId, account)}
                      >Buy</CButton>
                      </>
                    )
                  )}
                </>
              ):(
                <HollowDotsSpinner color="#00f792" className="m-auto pt-3 pb-3" />
              )}

              </CCardBody>
            <CCardFooter></CCardFooter>
        </CCard>

        <CModal centered color="secondary" show={modal} onClose={setModal}>
            <CModalHeader closeButton>
              <CModalTitle className="text-primary">
                Sell NFT {props.tokenId}
              </CModalTitle>
            </CModalHeader>
            <CModalBody style={{ backgroundColor: "#000106" }}>
              <label htmlFor="">Matic</label>
              <CInput
                placeholder="0"
                required
                value={sellAmount}
                onChange={onSellAmountChange}
              />
            </CModalBody>
            <CModalFooter style={{ backgroundColor: "#000106" }}>
              <CButton color="primary" variant="outline" onClick={() => setModal(false)}>Cancel</CButton>
              <CButton color="primary" variant="outline" onClick={ () => sellNft(props.tokenId, sellAmount,account)}>Sell</CButton>
            </CModalFooter>
        </CModal>

        </>
    );
  };
  export default NFT;
