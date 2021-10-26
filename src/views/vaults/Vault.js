import React, { useEffect, useState } from "react";
import useContract from "../../hooks/useContractOperations";
import { useInterval } from "../../hooks/useInterval";
import { IERC20, masterChefContractABI } from "../../contracts/contractABI";
import CountUp from "react-countup";
import {
  RiArrowDropDownFill,
  RiArrowDropUpFill,
  RiCalculatorLine,
  RiExternalLinkLine,
  RiInformationLine,
  RiShieldCrossLine,
  RiShieldFlashLine,
  RiShieldStarLine,
  RiCheckLine,
  RiLinksLine,
  RiRobotLine,
} from "react-icons/ri";
import {
  ChainId,
  MasterChefContract,
  masterChefAddr,
  web3,
  getTokenPriceInDollars,
} from "../../contracts/ContractProvider";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CInput,
  CFormText,
  CLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CCollapse,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { HollowDotsSpinner } from "react-epic-spinners";
import { farms } from "../../contracts/stakingConfig";
import { useTransactionMonitor } from "../../hooks/useTransactionMonitor";
import ConnectedWeb3Provider from "../../wallet/ConnectedWeb3Provider";
import ConnectWalletModal from "../../wallet/ConnectWalletModal";
import { NavLink } from "react-router-dom";
import "spinkit/spinkit.min.css";

const Vault = (props) => {
  let exchangeLink = "quickswap.exchange";
  let tokenInfoLink = "info.quickswap.exchange";
  if (props.exchangeLink !== undefined) {
    exchangeLink = props.exchangeLink;
  }
  if (props.tokenInfoLink !== undefined) {
    tokenInfoLink = props.tokenInfoLink;
  }

  let POOL_ID = parseInt(props.poolId); // get this passed in
  const FARM = farms[POOL_ID];

  const CONTRACT_POLLING_INTERVAL = 10000; // millis
  const CONTRACT_DATA_INTERVAL = 20000;
  const [lastContractQueryTime, setLastContractQueryTime] = React.useState(
    Date.now() - 20001
  );

  const [gasPrice, setGasPrice] = React.useState(2.0);
  const [aprData, setAprData] = React.useState({
    pool_id: 0,
    ticker: "---",
    APR: 0,
    tokenRewardPerDayFor1000Dollars: 0,
    APY: 0,
    poolInfo: { allocPoint: 0 },
  });

  const [walletModal, setWalletModal] = React.useState(false);

  const [wrongNetwork, setWrongNetwork] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [contractData, setContractData] = React.useState({});
  const [userData, setUsertData] = React.useState({});
  const [modal, setModal] = React.useState(false);
  const [supplyAmount, setSupplyAmount] = React.useState(0);

  const [loading, setLoading] = React.useState(true);

  const [account, setAccount] = React.useState(null);
  const { getNetwork, getAccountInfo, isWeb3Available, requestAccounts } =
    useContract();

  const { monitorTransaction } = useTransactionMonitor();

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

    const response = await fetch(
      "https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json"
    );
    // waits until the request completes...
    const item = await response.json();
    const shieldPriceInDollars = item.shieldPrice;

    let tokenPriceInDollars;
    if (FARM.ticker==="PCAKE"){
      
      tokenPriceInDollars = await getTokenPriceInDollars("0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", "BSC");
    }
    else if (FARM.ticker==="ELK"){
      tokenPriceInDollars = await getTokenPriceInDollars(FARM.address, "ELK");
    }else{
      tokenPriceInDollars = await getTokenPriceInDollars(FARM.address);
    }

    if (Date.now() - lastContractQueryTime < CONTRACT_DATA_INTERVAL) {
      //  console.log("not quering contract this time " + parseInt(Date.now()-lastContractQueryTime))
    } else {
      //  console.log("querying contract...")

      try {
        let totalLiquidityStaked = await balanceOf(
          FARM.address,
          masterChefAddr
        );

        // USDC for example has 6 decimal
        if (FARM.decimals !== 18) {
          totalLiquidityStaked = totalLiquidityStaked * 10 ** -FARM.decimals;
        } else {
          totalLiquidityStaked = parseFloat(
            web3.utils.fromWei(totalLiquidityStaked, "ether")
          );
        }

        //console.log("shieldPriceInDollars" + shieldPriceInDollars)

        // console.log(FARM.ticker + " " + tokenPriceInDollars);
        let totalLiquidityStakedUSD = parseFloat(
          totalLiquidityStaked * tokenPriceInDollars
        ).toFixed(2);

        var cData = {
          totalLiquidityStaked: totalLiquidityStaked,
          totalLiquidityStakedUSD: totalLiquidityStakedUSD,
        };
        setLastContractQueryTime(Date.now());
        setContractData(cData);
      } catch (e) {}
    } // if not querying

    // USER DATA
    try {
      let uData = { tokenBalance: 0, allowance: 0, stakedAmount: 0, tvl: 0 };
      // does the browser have web3?
      const isWeb3 = await isWeb3Available();
      if (isWeb3) {
        const currentAccount = await getAccountInfo();
        if (currentAccount === undefined) {
          setAccount(null);
        }

        if (currentAccount !== account) {
          setAccount(currentAccount);
        }

        if (currentAccount !== null && currentAccount !== undefined) {
          const allowanceWei = await allowance(FARM.address, currentAccount);
          uData.allowance = parseFloat(
            web3.utils.fromWei(allowanceWei, "ether")
          );

          if (uData.allowance > 0) {
            // get user information
            const tokenBalanceWei = await balanceOf(
              FARM.address,
              currentAccount
            );
            uData.tokenBalance = web3.utils.fromWei(tokenBalanceWei, "ether");

            const allowanceWei = await allowance(FARM.address, currentAccount);
            uData.allowance = parseFloat(
              web3.utils.fromWei(allowanceWei, "ether")
            );

            const userInfo = await MasterChefContract.methods
              .userInfo(POOL_ID, currentAccount)
              .call();

            // USDC for example has 6 decimal
            if (FARM.decimals !== 18) {
              uData.tokenBalance = tokenBalanceWei / 10 ** FARM.decimals;
              uData.stakedAmount = userInfo.amount / 10 ** FARM.decimals;
            } else {
              uData.stakedAmount = parseFloat(
                web3.utils.fromWei(userInfo.amount, "ether")
              );
            }

            // get the pending rewards
            const pendingShieldWei = await MasterChefContract.methods
              .pendingShield(POOL_ID, currentAccount)
              .call();
            uData.earned = parseFloat(
              web3.utils.fromWei(pendingShieldWei, "ether")
            ).toFixed(8);

            uData.tvl = parseFloat(
              tokenPriceInDollars * uData.stakedAmount +
                uData.earned * shieldPriceInDollars
            ).toFixed(2);
          } // end if approved

          // console.log("uData.stakedAmount "+ FARM.ticker + " " + uData.stakedAmount)
        }
      } else {
        setAccount(null);
      }

      setUsertData(uData);
    } catch (e) {}

    setLoading(false);
  }; // end fetch data

  useInterval(() => {
    fetchData();
    // fetchAPRCalculations();
  }, CONTRACT_POLLING_INTERVAL);

  const fetchGasPrice = async () => {
    fetch("https://gasstation-mainnet.matic.network")
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.standard)
        setGasPrice(parseFloat(json.standard));
      });
  };

  const fetchAPRCalculations = async () => {
    let ready = false;
    while (!ready) {
      const response = await fetch(
        "https://polyshield-media.s3.eu-west-1.amazonaws.com/aprCalculations.json"
      ).catch(() => {});
      if (response.status === 200) {
        const item = await response.json();
        //console.log(item)
        setAprData(item[POOL_ID]);
        ready = true;
      }
    }
  };

  useEffect(() => {
    fetchAPRCalculations();
    fetchGasPrice();
    fetchData();
  }, []);

  const balanceOf = async (token, address) => {
    const tokenContract = new web3.eth.Contract(IERC20, token);
    const result = tokenContract.methods.balanceOf(address).call();
    return result;
  };

  const allowance = async (token, address) => {
    const tokenContract = new web3.eth.Contract(IERC20, token);
    const result = tokenContract.methods
      .allowance(address, masterChefAddr)
      .call();
    return result;
  };

  const onApproveClicked = async (account) => {
    if (account === null || account === undefined) return false;

    const web3I = ConnectedWeb3Provider.web3;
    const TokenContractWrite = new web3I.eth.Contract(IERC20, FARM.address);
    const amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    //const amountWei = web3.utils.toWei(amount, "ether");
    const result = TokenContractWrite.methods
      .approve(masterChefAddr, amount)
      .send({ from: account }, monitorTransaction)
      .catch(() => {});
    return result;
  };

  const onHarvestClicked = async (account) => {
    if (account === null || account === undefined) return false;
    const web3I = ConnectedWeb3Provider.web3;

    const MasterChefWrite = new web3I.eth.Contract(
      masterChefContractABI,
      masterChefAddr
    );

    MasterChefWrite.methods
      .harvest(POOL_ID)
      .send(
        { from: account, gas: 2000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});
  };

  const onWithdrawClicked = async (account) => {
    if (account === null || account === undefined) return false;
    const web3I = ConnectedWeb3Provider.web3;

    const MasterChefWrite = new web3I.eth.Contract(
      masterChefContractABI,
      masterChefAddr
    );

    const userInfo = await MasterChefContract.methods
      .userInfo(POOL_ID, account)
      .call();

    MasterChefWrite.methods
      .withdraw(POOL_ID, userInfo.amount)
      .send(
        { from: account, gas: 2000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});
  };

  const onSupplyAmountChange = (evt) => {
    const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;
    if (rx_live.test(evt.target.value)) {
      const supply = evt.target.value;
      setSupplyAmount(supply);
    }
  };

  const onDepositClicked = async (account) => {
    if (account === null || account === undefined) return false;
    const web3I = ConnectedWeb3Provider.web3;

    const MasterChefWrite = new web3I.eth.Contract(
      masterChefContractABI,
      masterChefAddr
    );

    let amountWei = web3.utils.toWei(supplyAmount.toString(), "ether");

    // for usdc and such
    if (FARM.decimals !== 18) {
      amountWei = parseInt(supplyAmount * 10 ** FARM.decimals);
    }

    console.log(gasPrice * 10 ** 9);
    console.log(POOL_ID, amountWei);
    setSupplyAmount(0);

    MasterChefWrite.methods
      .deposit(POOL_ID, amountWei.toString())
      .send(
        { from: account, gas: 2000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});
  };

  const toggleCollapse = () => {
    setOpen(!open);
  };

  const calculateLiquidityShare = (supplyAmount) => {
    if (supplyAmount === 0) return 0;
    let newTotal =
      parseFloat(contractData.totalLiquidityStaked) + parseFloat(supplyAmount);
    //console.log(newTotal)
    let lShare = parseFloat((supplyAmount * 100) / newTotal).toFixed(2);
    return lShare;
  };

  return (
    <>
      {walletModal && (
        <ConnectWalletModal close={() => setWalletModal(false)} />
      )}

      <CCard
        className="vault-card w-100"
        style={{ wordWrap: loading ? "unset" : "break-word" }}
      >
        {loading ? (
          <CCardBody className="vault-card-body">
            <div className="vault-grid">
              <div className="vault-logo-holder">
                <img
                  className="vault-logo"
                  height="42"
                  src={require(`../../logo/${FARM.logo}`).default}
                  alt={FARM.ticker}
                />
              </div>{" "}
            </div>
            <HollowDotsSpinner color="#00f792" className="m-auto pt-3 pb-3" />
            {/* <div className="mt-3 text-center">Loading {FARM.ticker} vault<span className="loading-dots"></span></div> */}
          </CCardBody>
        ) : (
          <CCardBody className="vault-card-body">
            <div className="vault-grid">
              <div className="vault-logo-holder">
                <img
                  className="vault-logo"
                  height="42"
                  src={require(`../../logo/${FARM.logo}`).default}
                  alt={FARM.ticker}
                />
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">
                  Asset
                  {props.compounding && (
                    <CTooltip
                      content={
                        "0% deposit, 0% withdrawal auto-compounding with Kogefarm"
                      }
                    >
                      <RiRobotLine
                        style={{
                          marginLeft: "4px",
                          marginTop: "-4px",
                          cursor: "pointer",
                        }}
                      />
                    </CTooltip>
                  )}
                </div>
                <div>{FARM.ticker}</div>
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">Rate</div>
                <div>{parseInt(aprData.poolInfo.allocPoint) / 100}X</div>
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">
                  APR
                  {/* <CIcon
                    name="cil-calculator"
                    style={{ marginTop: "-3px", cursor: "pointer" }}
                    onClick={() => setModal(true)}
                  /> */}
                  <RiCalculatorLine
                    style={{
                      marginLeft: "4px",
                      marginTop: "-4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setModal(true)}
                  />
                </div>
                <div>
                  <CountUp
                    end={parseInt(aprData.APY.toFixed(0))}
                    duration={1.5}
                    suffix="%"
                    separator=","
                    preserveValue
                  />
                </div>
                {/* <div>{contractData.APY.toFixed(0)}%</div> */}
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">ROI (1D)</div>
                <div>
                  <CountUp
                    end={parseFloat(aprData.APR.toFixed(2))}
                    duration={1.5}
                    suffix="%"
                    separator=","
                    decimals={2}
                    preserveValue
                  />
                </div>
                {/* <div>{contractData.APR.toFixed(2)}%</div> */}
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">Liquidity</div>
                <div>
                  <CountUp
                    end={parseFloat(contractData.totalLiquidityStakedUSD)}
                    duration={1.5}
                    prefix="$"
                    //suffix={" " + FARM.ticker}
                    separator=","
                    decimals={2}
                    preserveValue
                  />
                </div>
              </div>

              <div className="vault-grid-item">
                <div className="text-primary">Fee</div>

                {parseInt(aprData.poolInfo.depositFeeBP) === 0 ? (
                  <div>
                    <RiCheckLine className="text-primary" /> Zero fees
                  </div>
                ) : (
                  <div>{parseInt(aprData.poolInfo.depositFeeBP) / 100}%</div>
                )}
              </div>

              <div
                className="collapse-btn-holder"
                onClick={!wrongNetwork ? toggleCollapse : undefined}
              >
                {open ? (
                  <CButton className="collapse-btn">
                    <RiArrowDropUpFill className="h1 mb-0" />
                  </CButton>
                ) : (
                  <CButton className="collapse-btn">
                    <RiArrowDropDownFill className="h1 mb-0" />
                  </CButton>
                )}
              </div>
            </div>

            <CCollapse show={open} style={{ position: "relative" }}>
              <hr />
              {account === null || account === undefined ? (
                <div className="approve-contract">
                  <CButton
                    className="approve-contract-btn d-flex"
                    color="dark"
                    onClick={() => setWalletModal(true)}
                  >
                    {/* <CIcon name="cil-check" /> */}
                    <RiLinksLine
                      style={{
                        marginRight: "0px",
                        marginTop: "4px",
                        cursor: "pointer",
                      }}
                    />
                    <span className="pl-2">Connect wallet</span>
                  </CButton>
                </div>
              ) : (
                <>
                  {userData.allowance === 0 && (
                    <div className="approve-contract">
                      <CButton
                        className="approve-contract-btn d-flex"
                        color="dark"
                        disabled={
                          account == null ||
                          account === undefined ||
                          wrongNetwork
                        }
                        onClick={() => onApproveClicked(account)}
                      >
                        {/* <CIcon name="cil-lock-unlocked" /> */}
                        <RiCheckLine
                          style={{
                            marginRight: "4px",
                            marginTop: "4px",
                            cursor: "pointer",
                          }}
                        />
                        <span>Approve contract</span>
                      </CButton>
                    </div>
                  )}
                </>
              )}
              <div
                className={
                  userData.allowance === 0
                    ? "vault-user-grid blur"
                    : "vault-user-grid"
                }
              >
                <div className="p-3">
                  <div className="vault-user-grid">
                    <div>
                      <div className="text-primary">Your {FARM.ticker}</div>
                      <div>
                        <CountUp
                          end={parseFloat(userData.tokenBalance)}
                          duration={1.5}
                          separator=","
                          decimals={4}
                          preserveValue
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-primary">Staked</div>
                      <div>{userData.stakedAmount}</div>
                    </div>
                  </div>
                  <div className="vault-user-grid">
                    <div>
                      <div className="text-primary">Earned</div>
                      <div>{userData.earned} SHI3LD</div>
                    </div>
                    <div>
                      <div className="text-primary">
                        Your TVL
                        <CTooltip
                          content={
                            "(Staked " + FARM.ticker + " + Earned SHI3LD) in $"
                          }
                        >
                          <RiInformationLine
                            style={{
                              marginLeft: "4px",
                              marginTop: "-4px",
                              cursor: "pointer",
                            }}
                          />
                        </CTooltip>
                      </div>
                      <div>
                        ${parseFloat(userData.tvl).toFixed(2)}
                        {props.compounding && (
                          <a
                            href="https://kogefarm.io/vaults?search=shi3ld"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <CButton
                              size="sm"
                              color="primary"
                              style={{
                                color: "#FEBB00",
                                cursor: "pointer",
                                float: "right",
                              }}
                            >
                              <CTooltip
                                content={
                                  "0% deposit, 0% withdrawal auto-compounding with Kogefarm"
                                }
                              >
                                <RiRobotLine
                                  style={{
                                    marginLeft: "4px",
                                    marginTop: "-4px",
                                    cursor: "pointer",
                                  }}
                                />
                              </CTooltip>
                              &nbsp; Compound
                            </CButton>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <CRow>
                    <CCol>
                      <CButton
                        block
                        className="mt-3 text-primary"
                        color="primary"
                        disabled={
                          account == null ||
                          account === undefined ||
                          parseFloat(userData.earned) === 0 ||
                          wrongNetwork
                        }
                        onClick={() => onHarvestClicked(account)}
                      >
                        <RiShieldFlashLine
                          style={{ marginTop: "-3px", marginRight: "4px" }}
                        />
                        Harvest
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton
                        block
                        className="mt-3 text-primary"
                        color="primary"
                        disabled={
                          account == null ||
                          account === undefined ||
                          parseFloat(userData.tvl) === 0 ||
                          wrongNetwork
                        }
                        onClick={() => onWithdrawClicked(account)}
                      >
                        <RiShieldStarLine
                          style={{ marginTop: "-3px", marginRight: "4px" }}
                        />
                        Withdraw
                      </CButton>
                    </CCol>
                  </CRow>
                </div>
                <div className="p-3">
                  <div>
                    <CLabel htmlFor="text-input">Amount</CLabel>
                    <CButton
                      size="sm"
                      color="primary"
                      style={{
                        color: "#FEBB00",
                        cursor: "pointer",
                        float: "right",
                      }}
                      onClick={() => setSupplyAmount(userData.tokenBalance)}
                    >
                      <span className="text-warning">MAX</span>
                    </CButton>
                  </div>

                  <div>
                    <CInput
                      placeholder="0"
                      required
                      value={supplyAmount}
                      onChange={onSupplyAmountChange}
                    />

                    <CFormText>
                      {parseFloat(supplyAmount) >
                      parseFloat(userData.tokenBalance) ? (
                        <div className="text-info">Insufficient funds.</div>
                      ) : (
                        <>
                          {contractData.totalLiquidityStaked > 0 ? (
                            <>
                              Receive&nbsp;
                              {calculateLiquidityShare(supplyAmount)}
                            </>
                          ) : supplyAmount > 0 ? (
                            100
                          ) : (
                            0
                          )}
                          % of pool.
                        </>
                      )}
                    </CFormText>
                  </div>

                  <div>
                    <CButton
                      disabled={
                        props.depositsClosed===true ||
                        wrongNetwork ||
                        parseFloat(supplyAmount) >
                          parseFloat(userData.tokenBalance)
                      }
                      className="mt-3"
                      block
                      color="warning"
                      onClick={() => onDepositClicked(account)}
                    >
                      <RiShieldCrossLine
                        style={{ marginTop: "-3px", marginRight: "4px" }}
                      />
                      Deposit
                    </CButton>
                    {account == null ||
                      (account === undefined && (
                        <CButton
                          disabled={wrongNetwork}
                          block
                          color="warning"
                          onClick={() => setWalletModal(true)}
                        >
                          Connect wallet
                        </CButton>
                      ))}
                  </div>
                </div>
              </div>
            </CCollapse>

            <hr />
            <CRow className="w-100 d-flex justify-content-between align-items-center m-0">
              <CCol xs="12" md="4">

                {(FARM.ticker==="ELK")
                ?
                <a
                style={{ textDecoration: "none" }}
                href={`https://${exchangeLink}/#/swap/${FARM.address}`}
                target="_blank"
                rel="noreferrer"
              > 
                <CButton block size="sm" className="text-primary">
                    BUY {FARM.ticker}&nbsp;
                    <RiExternalLinkLine style={{ marginTop: "-3px" }} />
                  </CButton>
                </a>
                :
                <NavLink
                  to={{ pathname: "/buy", buyProps: { address: FARM.address } }}
                >
                  <CButton block size="sm" className="text-primary">
                    BUY {FARM.ticker}
                    {/* <RiExternalLinkLine style={{ marginTop: "-3px" }} /> */}
                  </CButton>
                </NavLink>
                }
                
              </CCol>
              <CCol xs="12" md="4">
                <a
                  style={{ textDecoration: "none" }}
                  href={`https://${tokenInfoLink}/${FARM.type}/${FARM.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CButton block size="sm" className="text-primary">
                    TOKEN INFO{" "}
                    <RiExternalLinkLine style={{ marginTop: "-3px" }} />
                  </CButton>
                </a>
              </CCol>
              <CCol xs="12" md="4">
                <a
                  style={{ textDecoration: "none" }}
                  href={`https://explorer-mainnet.maticvigil.com/address/${FARM.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CButton block size="sm" className="text-primary">
                    CONTRACT{" "}
                    <RiExternalLinkLine style={{ marginTop: "-3px" }} />
                  </CButton>
                </a>
              </CCol>
            </CRow>
          </CCardBody>
        )}
      </CCard>

      {!loading && (
        <CModal centered color="secondary" show={modal} onClose={setModal}>
          <CModalHeader closeButton>
            <CModalTitle className="text-primary">
              ROI for {FARM.ticker}
            </CModalTitle>
          </CModalHeader>
          <CModalBody style={{ backgroundColor: "#000106" }}>
            <p>
              The amount of SHI3LD earned is estimated based on the current
              emission rate, % of liquidity pool held, SHI3LD token price and an
              investment of $1000 worth of {FARM.ticker}.
            </p>
            <p />
            <table width="100%">
              <tbody>
                <tr align="center">
                  <th className="text-primary text-left">Period</th>
                  <th className="text-primary text-left">ROI</th>
                  <th className="text-primary text-right">SHI3LD</th>
                </tr>
                <tr>
                  <td className="text-left">1 Day</td>
                  <td className="text-left">
                    <CountUp
                      end={parseFloat(aprData.APR.toFixed(2))}
                      duration={1.5}
                      separator=","
                      suffix="%"
                      decimals={2}
                      //start={modal}
                    />
                  </td>
                  <td className="text-right">
                    <CountUp
                      end={parseFloat(
                        aprData.tokenRewardPerDayFor1000Dollars.toFixed(2)
                      )}
                      duration={1.5}
                      separator=","
                      decimals={2}
                      //start={modal}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-left">30 Days</td>
                  <td className="text-left">
                    <CountUp
                      end={parseFloat(aprData.APR.toFixed(2) * 30)}
                      duration={1.5}
                      separator=","
                      suffix="%"
                      decimals={2}
                      // start={modal}
                    />
                  </td>
                  <td className="text-right">
                    <CountUp
                      end={parseFloat(
                        aprData.tokenRewardPerDayFor1000Dollars.toFixed(2) * 30
                      )}
                      duration={1.5}
                      separator=","
                      //start={modal}
                      decimals={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-left">365 Days (APR)</td>
                  <td className="text-left">
                    <CountUp
                      end={parseFloat(aprData.APR.toFixed(2) * 365)}
                      duration={1.5}
                      separator=","
                      suffix="%"
                      decimals={2}
                      //start={modal}
                    />
                  </td>
                  <td className="text-right">
                    <CountUp
                      end={parseFloat(
                        aprData.tokenRewardPerDayFor1000Dollars.toFixed(2) * 365
                      )}
                      duration={1.5}
                      separator=","
                      decimals={2}
                      // start={modal}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <p />
            <p className="text-warning">
              These estimates are not guarantees and are subject to change
              depending on token price and emission rates.
            </p>
            <CButton
              className="float-right"
              color="primary"
              onClick={() => setModal(false)}
            >
              Close
            </CButton>{" "}
          </CModalBody>
        </CModal>
      )}
    </>
  );
};

export default Vault;
