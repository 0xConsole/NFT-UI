import React, { useEffect } from "react";
import Web3 from "web3";

import CountUp from "react-countup";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInput,
} from "@coreui/react";
import { useInterval } from "../../hooks/useInterval";
import {
  BurnerABI,
  masterChefContractABI,
  PolyshieldABI,
} from "../../contracts/contractABI";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

import {
  MasterChefContract,
  PolyshieldContract,
  QuickRouterContract,
  burnerAddress,
  masterChefAddr,
  web3,
  BASE_Address,
  USDC_Address,
  ChainId,
  balanceOf,
  BurnerContract,
  calculateUSDValueOfStakedLiquidity,
  AVERAGE_SECS,
} from "../../contracts/ContractProvider";

import { farms } from "../../contracts/stakingConfig";
import {
  RiInformationLine,
  RiFireLine,
  RiShieldFlashLine,
  RiMoneyDollarCircleLine,
  RiRefreshLine,
  RiCoinLine,
  RiWaterFlashLine,
  RiArrowUpDownLine,
  RiPlantLine,
  RiSafe2Line,
  RiShieldLine,
  RiTimerLine,
  RiShieldUserLine,
} from "react-icons/ri";

import useContract from "../../hooks/useContractOperations";
import { useTransactionMonitor } from "../../hooks/useTransactionMonitor";
import ConnectedWeb3Provider from "../../wallet/ConnectedWeb3Provider";
import ConnectWalletModal from "../../wallet/ConnectWalletModal";
import MCCountdown from "src/utils/MCCountdown";

const Dashboard = () => {
  const web3T = new Web3("https://polygon-rpc.com/");
  const PolyshieldEventContract = new web3T.eth.Contract(
    PolyshieldABI,
    BASE_Address
  );

  const initialChartData = [
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
    { hour: "00AM", value: "0" },
  ];
  const [chartData, setChartData] = React.useState(initialChartData);
  const [chartRange, setChartRange] = React.useState({ min: 0, max: 1000000 });

  const [chartNoise, setChartNoise] = React.useState([0.98, 0.97,1.03,1.02,0.99,1.06,0.98, 0.97,1.03,1.02,0.99,1.01]);


  const [rotating, setRotating] = React.useState(false);
  const CONTRACT_POLLING_INTERVAL = 10000; // millis

  const initialData = {
    countdown: false,
    marketCapUSD: 0,
    totalSupply: 0,
    minted: 0,
    burned: 0,
    circulatingSupply: 0,
    tokenPriceUSD: 0,
    tvlUSD: 0,
    emissionRate: 0,
    bottomPrice: 1,
    topPrice: 100,
    poolLength: 0,
    burnable: 0,
  };

  const [contractData, setContractData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(true);
  const [burning, setBurning] = React.useState(false);

  const [gasPrice, setGasPrice] = React.useState(2.0);

  const [aprData, setAprData] = React.useState([]);
  const [wrongNetwork, setWrongNetwork] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [walletModal, setWalletModal] = React.useState(false);
  const [burnModal, setBurnModal] = React.useState(false);
  const [burnAnimation, setBurnAnimation] = React.useState(false);
  const [burnCongratulation, setBurnCongratulation] = React.useState(false);
  const [ownBurnAmount, setOwnBurnAmount] = React.useState(0);
  const [burnedOwnTokens, setBurnedOwnTokens] = React.useState(false);

  const [userData, setUserData] = React.useState({
    tokenBalance: 0,
    burnedAmount: 0,
    tvlUSD: 0,
    pendingShield: 0,
  });

  const { getNetwork, getAccountInfo, isWeb3Available } = useContract();

  const { monitorTransaction } = useTransactionMonitor();

  const fetchData = async () => {
    let cData = initialData;
    cData.tvlUSD = contractData.tvlUSD;

    try {
      const network = await getNetwork();
      if (network !== ChainId && network !== -1) {
        console.log(network);
        setWrongNetwork(true);
      } else {
        setWrongNetwork(false);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      let burnable = await balanceOf(BASE_Address, burnerAddress);
      burnable = web3.utils.fromWei(burnable, "ether");
      cData.burnable = burnable;

      let minted = await PolyshieldContract.methods
        .minted()
        .call()
        .catch(() => {});
      minted = web3.utils.fromWei(minted, "ether");
      cData.minted = minted;

      let burned = await PolyshieldContract.methods
        .burned()
        .call()
        .catch(() => {});
      burned = web3.utils.fromWei(burned, "ether");
      //console.log(burned)

      cData.burned = burned;

      // calculate the tvl of contract
      const poolLength = farms.length;
      cData.poolLength = poolLength;
      let totalLockedValue = 0;

      for (let i = 0; i < aprData.length; i++) {
        totalLockedValue =
          totalLockedValue + parseFloat(aprData[i].totalLiquidityStakedUSD);
        //  console.log(totalLockedValue)
      } // end for each farm

      //   console.log(totalLockedValue);
      cData.tvlUSD = totalLockedValue;

      // console.log("cData.tvlUSD " + cData.tvlUSD)

      const response = await fetch(
        "https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json"
      );
      // waits until the request completes...
      const polyInfo = await response.json();
      //console.log(item)
      cData.topPrice = polyInfo.topPrice;
      cData.bottomPrice = polyInfo.bottomPrice;
      cData.emissionRate = polyInfo.emissionRate;
      cData.tokenPriceUSD = polyInfo.shieldPrice;

      const totalSupplyWei = await PolyshieldContract.methods
        .totalSupply()
        .call()
        .catch(() => {});
      const totalSupply = parseFloat(
        web3.utils.fromWei(totalSupplyWei, "ether")
      );
      cData.totalSupply = totalSupply;
      cData.marketCapUSD = totalSupply * polyInfo.shieldPrice;

      setContractData(cData);
    } catch (e) {
      console.log(e);
    }

    const currentAccount = await checkUserAccount();
    //const currentAccount = account;

    // console.log(currentAccount);
    if (currentAccount !== null) {
      try {
        let uData = {
          tokenBalance: 0,
          burnedAmount: 0,
          tvlUSD: 0,
          pendingShield: 0,
        };
        if (currentAccount !== null && currentAccount !== undefined) {
          // get user information
          const tokenBalanceWei = await balanceOf(BASE_Address, currentAccount);
          uData.tokenBalanceWei = tokenBalanceWei;
          uData.tokenBalance = web3.utils.fromWei(tokenBalanceWei, "ether");

          const burnedAmountWei = await BurnerContract.methods
            .burnTotals(currentAccount)
            .call()
            .catch(() => {});
          uData.burnedAmount = web3.utils.fromWei(burnedAmountWei, "ether");

          // sum pending shield and tvl
          let sumOfTVL = 0;
          let sumOfPending = 0;
          for (let i = 0; i < farms.length; i++) {
            // get the pending rewards
            let FARM = farms[i];

            const userInfo = await MasterChefContract.methods
              .userInfo(i, currentAccount)
              .call()
              .catch(() => {});

            //console.log(userInfo)

            if (FARM.address === USDC_Address) {
              const farmLiquidity = userInfo.amount * 10 ** -6; // 6 decimals for USDC
              sumOfTVL = sumOfTVL + parseFloat(farmLiquidity);
            }

            if (FARM.address !== USDC_Address && FARM.type === "token") {
              if (userInfo.amount > 0) {
                const amountsOutWei = await QuickRouterContract.methods
                  .getAmountsOut(userInfo.amount, [FARM.address, USDC_Address])
                  .call()
                  .catch(() => {});
                const usdAmount = amountsOutWei[1];
                sumOfTVL = sumOfTVL + parseFloat(usdAmount * 10 ** -6);
              }
            }

            if (FARM.type === "pair") {
              let totalLiquidityStakedTokedUSD =
                userInfo.amount === 0
                  ? 0
                  : await calculateUSDValueOfStakedLiquidity(
                      FARM,
                      userInfo.amount
                    );
              sumOfTVL = sumOfTVL + parseFloat(totalLiquidityStakedTokedUSD);
            }

            // calculate pending shield
            let pendingShieldWei = await MasterChefContract.methods
              .pendingShield(i, currentAccount)
              .call()
              .catch(() => {});

            if (pendingShieldWei == undefined) {
              pendingShieldWei = 0;
            }
            const pending = parseFloat(
              web3.utils.fromWei(pendingShieldWei.toString(), "ether")
            );

            sumOfPending = sumOfPending + parseFloat(pending);
          }

          uData.pendingShield = parseFloat(sumOfPending).toFixed(8);
          uData.tvlUSD = parseFloat(sumOfTVL).toFixed(2);
          //console.log("sumOfTVL " + sumOfTVL)
          setUserData(uData);
        }
      } catch (e) {
        console.log(e);
      }
    }

    setLoading(false);
  };

  const checkUserAccount = async () => {
    const isWeb3 = await isWeb3Available();
    if (isWeb3) {
      const currentAccount = await getAccountInfo();
      if (currentAccount === undefined) {
        setAccount(null);
      }

      if (currentAccount !== account) {
        setAccount(currentAccount);
      }
      return currentAccount;
    }
    return null;
  };

  const onBurnClicked = async () => {
    if (account === null || account === undefined) return false;

    const web3I = ConnectedWeb3Provider.web3;
    const BurnerContractWrite = new web3I.eth.Contract(
      BurnerABI,
      burnerAddress
    );
    await BurnerContractWrite.methods
      .burn()
      .send(
        { from: account, gas: 3000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});
  };

  const onHarvestClicked = async (account) => {
    if (account === null || account === undefined) return false;
    const web3I = ConnectedWeb3Provider.web3;

    const MasterChefWrite = new web3I.eth.Contract(
      masterChefContractABI,
      masterChefAddr
    );

    await MasterChefWrite.methods
      .harvestAll()
      .send(
        { from: account, gas: 3000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});
  };

  const fetchGasPrice = async () => {
    fetch("https://gasstation-mainnet.matic.network")
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.standard);
        setGasPrice(parseFloat(json.standard));
      }).catch(() => {});
  };

  const fetchAPRCalculations = async () => {
    fetch(
      "https://polyshield-media.s3.eu-west-1.amazonaws.com/aprCalculations.json"
    )
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.standard)
        setAprData(json);
      });
  };

  const fetchChartData = async () => {
    await fetch(
      "https://polyshield-media.s3.eu-west-1.amazonaws.com/chartDataDays.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let days = 12;
        let min = parseFloat(data[0].value);
        let max = 0;
        for (var i = 0; i < data.length; i++) {
          data[i].day = days + "d ago";
          days--;

          //let amount = 2500-5000;

         // data[i].value=data[i].value+amount;
          //console.log();

          let amount = data[i].value*chartNoise[i];
          data[i].value=amount;


          if (parseFloat(data[i].value) < min) min = parseFloat(data[i].value);

          if (parseFloat(data[i].value) > max) max = parseFloat(data[i].value);
        }
        // console.log("max " + max);
        setChartRange({ min: min - 1000000, max: max + 1000000 });
        setChartData(data);
      });
  };

  const monitorEvents = async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    PolyshieldEventContract.getPastEvents(
      "Transfer",
      {
        fromBlock: "latest",
      },
      async function (error, events) {
        //console.log(events)

        if (events.length > 0 && !burning) {
          //console.log(events[0].returnValues);
          const toAddress = events[0].returnValues.to;
          if (toAddress === "0x0000000000000000000000000000000000000000") {
            setBurning(true);
            await delay(5000);
            setBurning(false);
          }
        }
      }
    );
  };

  const fetchOneTimeData = async () => {
    try {
      const response = await fetch(
        "https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json"
      );
      // waits until the request completes...
      const polyInfo = await response.json();
      //console.log(item)

      let cData = contractData;
      cData.topPrice = polyInfo.topPrice;
      cData.bottomPrice = polyInfo.bottomPrice;
      cData.emissionRate = polyInfo.emissionRate;
      cData.tokenPriceUSD = polyInfo.shieldPrice;
      setContractData(cData);
    } catch (error) {}
  };

  useEffect(() => {
    setTimeout(() => {
      setRotating(true);
    }, 3300);

    checkUserAccount();
    fetchAPRCalculations();
    fetchOneTimeData();
    fetchData();
    fetchChartData();
    fetchGasPrice();
  }, []);

  useInterval(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, CONTRACT_POLLING_INTERVAL);

  useInterval(() => {
    monitorEvents();
  }, 3000);

  let vaultCount = 0;
  let farmCount = 0;

  farms.map((f) => {
    return f.type === "token" ? vaultCount++ : farmCount++;
  });

  const burnOwnTokens = () => {
    setBurnAnimation(true);
    setTimeout(() => {
      setBurnAnimation(false);
      setBurnCongratulation(true);
      setBurnedOwnTokens(true);
    }, 4750);
  };

  return (
    <>
      {walletModal && (
        <ConnectWalletModal close={() => setWalletModal(false)} />
      )}

      <h1 className="tagline">SAFE, SECURE, SUSTAINABLE</h1>

      <CRow>
        <CCol xs="12" md="6">
          {contractData.countdown ? (
            //  false ? (
            <>
              <CCard>
                <CCardBody>
                  <div style={{ textAlign: "center" }}>
                    <h5 className="text-warning">Estimated launch time</h5>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <MCCountdown
                      endDate={parseInt(contractData.startTimeSeconds)}
                    />
                  </div>
                </CCardBody>
              </CCard>
              <CCard>
                <CCardBody>
                  <CRow>
                    <CCol>
                      <CCol className="text-primary">Current block</CCol>
                      <CCol>{contractData.currentBlock}</CCol>
                    </CCol>
                    <CCol>
                      <CCol className="text-primary">Start block</CCol>
                      <CCol>{contractData.startBlock}</CCol>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CCol className="text-primary">Remaining blocks</CCol>
                      <CCol>{contractData.remainingBlocks}</CCol>
                    </CCol>
                    <CCol>
                      <CCol className="text-primary">Average block time</CCol>
                      <CCol>{AVERAGE_SECS} Secs</CCol>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </>
          ) : (
            <CCard>
              <CCardBody>
                <CCol className="text-primary">Total value locked</CCol>
                <CCol>
                  <CountUp
                    className="h4"
                    end={
                      contractData.tvlUSD
                        ? parseInt(contractData.tvlUSD)
                        : parseInt(chartData[11].value)
                    }
                    duration="3"
                    prefix="$"
                    separator=","
                    preserveValue
                  />
                </CCol>
                <CCol style={{ height: "200px" }}>
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart width={200} height={100} data={chartData}>
                      <Tooltip
                        formatter={(label) =>
                          "$" + new Intl.NumberFormat("en").format(label)
                        }
                        separator=": "
                        label="Value"
                      />

                      <XAxis
                        style={{ fontSize: "12px" }}
                        stroke="rgba(0, 247, 146, 0.66)"
                        dataKey="day"
                        ticks={[
                          chartData[1].day,
                          chartData[4].day,
                          chartData[7].day,
                          chartData[10].day,
                        ]}
                      />
                      <YAxis
                        domain={[chartRange.min, chartRange.max]}
                        hide={true}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00f792"
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CCol>
              </CCardBody>
            </CCard>
          )}
        </CCol>

        <CCol
          xs="12"
          md="3"
          className="d-flex justify-content-center align-items-center"
        >
          {burning ? (
            <img
              src={require(`../../logo/burn.webp`).default}
              width="100%"
              alt="Burning SHI3LD"
            />
          ) : !burning && rotating ? (
            <img
              src={require(`../../logo/rotate.webp`).default}
              width="100%"
              alt="Rotating SHI3LD"
            />
          ) : (
            <img
              src={require(`../../logo/split.webp`).default}
              width="100%"
              alt="Splitting SHI3LD"
            />
          )}
        </CCol>
        <CCol xs="12" md="3" className="mb-4">
          <CCard className="h-100">
            <div className="text-primary">
              <CTooltip
                content={"These tokens can be burned by anyone. Go for it!"}
              >
                <RiInformationLine
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    cursor: "pointer",
                  }}
                />
              </CTooltip>
            </div>
            <CCardBody className="h-100">
              <CCol className="h-100 w-100 d-flex flex-column justify-content-between align-items-start">
                <div className="w-100 d-flex flex-column justify-content-center align-items-center h-75 w-100">
                  <div className="text-primary">Burnable tokens</div>

                  <div className="text-center">
                    <CountUp
                      className="h1"
                      end={parseFloat(contractData.burnable)}
                      duration="3"
                      separator=","
                      decimals={2}
                      preserveValue
                    />
                  </div>
                  <div className="text-primary text-center">SHI3LD</div>
                </div>
                <div className="w-100">
                  {account === null || account === undefined ? (
                    <CButton
                      block
                      color="primary"
                      onClick={() => setWalletModal(true)}
                    >
                      {/* <CIcon name="cil-fire" /> */}
                      <RiShieldUserLine
                        style={{ marginTop: "-3px", marginRight: "-5px" }}
                      />
                      <span className="pl-2">Connect</span>
                    </CButton>
                  ) : (
                    <CButton
                      block
                      color="warning"
                      //disabled={parseFloat(contractData.burnable) === 0}
                      onClick={() => onBurnClicked()}
                    >
                      {/* <CIcon name="cil-fire" /> */}
                      <RiFireLine
                        style={{ marginTop: "-4px", marginRight: "4px" }}
                      />
                      <span>Burn Now</span>
                    </CButton>
                  )}
                </div>
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow></CRow>

      <CRow>
        <CCol xs="12" md="6">
          <CRow>
            <CCol xs="12" md="6">
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiMoneyDollarCircleLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Market cap</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={parseFloat(contractData.marketCapUSD)}
                        duration="3"
                        prefix="$"
                        separator=","
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiFireLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Burned tokens</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={parseFloat(contractData.burned)}
                        duration="3"
                        separator=","
                        decimals={2}
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiRefreshLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Circulating tokens</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={parseInt(contractData.totalSupply)}
                        duration="3"
                        separator=","
                        //suffix=" SHI3LD"
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiCoinLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Total tokens</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={
                          parseInt(contractData.totalSupply) +
                          parseInt(contractData.burned)
                        }
                        duration="3"
                        separator=","
                        //suffix=" SHI3LD"
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
              </CCol>
            </CCol>
            <CCol xs="12" md="6">
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiWaterFlashLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">
                      Emission rate
                      <CTooltip
                        content={
                          "The current rate that SHI3LD are minted. This varies inversely with the price of the token."
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
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={parseFloat(contractData.emissionRate)}
                        duration="3"
                        separator=","
                        decimals={2}
                        suffix=" / block"
                      />
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiArrowUpDownLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">
                      Price range
                      <CTooltip
                        content={
                          "The emission rate varies within this price range. Outside this range the emission rate will remain at 1% or 100% of 1 SHI3LD per block."
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
                    <div style={{ marginBottom: "-4px" }}>
                      ${contractData.bottomPrice} - ${contractData.topPrice}
                    </div>
                  </div>
                </div>
              </CCol>

              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiPlantLine className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Farms</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={farmCount}
                        duration="3"
                        separator=","
                        //suffix=" SHI3LD"
                      />
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol>
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <div className="icon-holder">
                    <RiSafe2Line className="m-2 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary">Vaults</div>
                    <div style={{ marginBottom: "-4px" }}>
                      <CountUp
                        end={vaultCount}
                        duration="3"
                        separator=","
                        //suffix=" SHI3LD"
                      />
                    </div>
                  </div>
                </div>
              </CCol>
            </CCol>
          </CRow>
        </CCol>

        <CCol xs="12" md="6">
          <>
            <CRow>
              <CCol xs="12" md="6">
                <CCol>
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <div className="icon-holder-warning">
                      <RiShieldLine className="m-2 text-warning" />
                    </div>
                    <div>
                      <div className="text-warning">Your SHI3LD</div>
                      <div style={{ marginBottom: "-4px" }}>
                        {userData.tokenBalance === 0 ? (
                          "-"
                        ) : (
                          <CountUp
                            end={parseFloat(userData.tokenBalance)}
                            duration="3"
                            separator=","
                            decimals={4}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CCol>

                <CCol>
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <div className="icon-holder-warning">
                      <RiFireLine className="m-2 text-warning" />
                    </div>
                    <div>
                      <div className="text-warning">Burned by You</div>
                      <div style={{ marginBottom: "-4px" }}>
                        {userData.burnedAmount === 0 ? (
                          "-"
                        ) : (
                          <CountUp
                            end={parseFloat(userData.burnedAmount)}
                            duration="3"
                            separator=","
                            decimals={4}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CCol>
              </CCol>

              <CCol xs="12" md="6">
                <CCol>
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <div className="icon-holder-warning">
                      <RiMoneyDollarCircleLine className="m-2 text-warning" />
                    </div>
                    <div>
                      <div className="text-warning">
                        Your value locked
                        <CTooltip
                          content={"Total across all farms and vaults."}
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
                      <div style={{ marginBottom: "-4px" }}>
                        ${userData.tvlUSD}
                      </div>
                    </div>
                  </div>
                </CCol>
                <CCol>
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <div className="icon-holder-warning">
                      <RiTimerLine className="m-2 text-warning" />
                    </div>
                    <div>
                      <div className="text-warning">
                        Pending SHI3LD
                        <CTooltip
                          content={
                            "Sum of your SHI3LD earnings across all farms and vaults."
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
                      <div style={{ marginBottom: "-4px" }}>
                        {userData.pendingShield === 0
                          ? "-"
                          : userData.pendingShield}
                      </div>
                    </div>
                  </div>
                </CCol>
              </CCol>
            </CRow>
          </>
          <CRow>
            <CCol xs="12" md="6">
              <CButton
                block
                className="mt-3 text-primary"
                color="primary"
                disabled={
                  account == null ||
                  account === undefined ||
                  parseFloat(userData.pendingShield) === 0 ||
                  wrongNetwork
                }
                onClick={() => onHarvestClicked(account)}
              >
                <RiShieldFlashLine
                  style={{ marginTop: "-3px", marginRight: "4px" }}
                />
                Harvest all
              </CButton>
            </CCol>
            <CCol xs="12" md="6" className="mb-5">
              <CButton
                block
                className="mt-3"
                color="warning"
                disabled={true}
                // disabled={
                //   account == null ||
                //   account === undefined ||
                //   parseFloat(userData.pendingShield) === 0 ||
                //   wrongNetwork
                // }
                onClick={() => setBurnModal(true)}
              >
                <RiFireLine style={{ marginTop: "-3px", marginRight: "4px" }} />
                Burn tokens
              </CButton>
            </CCol>
          </CRow>
        </CCol>
        <CModal
          centered
          color="secondary"
          show={burnModal}
          onClick={() => {
            setBurnCongratulation(false);
          }}
        >
          <CModalHeader closeButton>
            <CModalTitle className="text-primary">Burn tokens</CModalTitle>
          </CModalHeader>
          <CModalBody
            className="text-center"
            style={{ backgroundColor: "#000106" }}
          >
            {burnAnimation && (
              <img
                src={require(`../../logo/burn.webp`).default}
                width="50%"
                alt="Burning SHI3LD"
              />
            )}

            {burnCongratulation && (
              <div className="mb-5">
                <h2 className="mb-3">Congratulations!</h2>
                <h4>
                  You burned <span className="text-warning">24.24</span> SHI3LD
                </h4>
                <h4>
                  with an approx. value of{" "}
                  <span className="text-primary">$842.24</span>
                </h4>
              </div>
            )}
            {!burnCongratulation && !burnAnimation && (
              <>
                <h2 className="text-primary">{ownBurnAmount}</h2>
                <CInput
                  className="my-3"
                  type="range"
                  value={ownBurnAmount}
                  onChange={(e) => setOwnBurnAmount(e.target.value)}
                />
                <CButton color="warning" onClick={burnOwnTokens}>
                  Burn them!
                </CButton>
              </>
            )}
            {burnedOwnTokens && (
              <CButton
                className="m-auto"
                color="primary"
                onClick={() => {
                  setBurnModal(false);
                  setBurnedOwnTokens(false);
                }}
              >
                Close
              </CButton>
            )}
          </CModalBody>
        </CModal>
      </CRow>
    </>
  );
};

export default Dashboard;
