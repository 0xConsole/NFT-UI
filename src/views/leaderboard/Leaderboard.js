import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CInput,
  CRow,
} from "@coreui/react";
import { HollowDotsSpinner } from "react-epic-spinners";
import useContract from "../../hooks/useContractOperations";
import Web3 from "web3";
import { leaderboardABI } from "src/contracts/contractABI";
import ConnectedWeb3Provider from "../../wallet/ConnectedWeb3Provider";
import { useTransactionMonitor } from "../../hooks/useTransactionMonitor";
import {
  QuickRouterContract,
  BASE_Address,
  USDC_Address,
} from "../../contracts/ContractProvider";
import { RiFireLine } from "react-icons/ri";
const fields = [
  { key: "placement", label: "#" },
  { key: "alias" },
  { key: "address" },
  {
    key: "burned",
    label: "SHI3LD burned",
    _style: { "text-align": "right" },
  },
];
const LEADERBOARD_ADDRESS = "0x730014E98a221ca0014C2774Fb4c8eccaa842F73";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [regOpen, setRegOpen] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [register, setRegister] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [web3Available, setWeb3Available] = useState(true);

  const [registered, setRegistered] = useState(false);
  const [account, setAccount] = useState(null);
  const { getAccountInfo, isWeb3Available } = useContract();
  const [gasPrice, setGasPrice] = React.useState(2.0);
  const { monitorTransaction } = useTransactionMonitor();

  const [tokenPriceInDollars, setTokenPriceInDollars] = React.useState(0);

  const web3 = new Web3("https://polygon-rpc.com/");

  const LeaderboardContract = new web3.eth.Contract(
    leaderboardABI,
    LEADERBOARD_ADDRESS
  );

  const checkRegistered = async () => {
    const isWeb3 = await isWeb3Available();
    if (isWeb3) {
      const currentAccount = await getAccountInfo();

      console.log(currentAccount);
      if (currentAccount === undefined) {
        setAccount(null);
      }

      if (currentAccount !== account) {
        setAccount(currentAccount);
      }
      if (currentAccount !== undefined && currentAccount !== null) {
        const isRegistered = await LeaderboardContract.methods
          .registrations(currentAccount)
          .call()
          .catch(() => {});
        setRegistered(isRegistered);
        //console.log(isRegistered);
      }
    } else {
      setWeb3Available(false);
    }
  };

  const fetchData = async () => {
   
    const response = await fetch('https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json');
    // waits until the request completes...
    const item = await response.json();
    //console.log(item)

    setTokenPriceInDollars(item.shieldPrice);
    setLoading(false);
  };

  const getLeaderboard = async () => {
    await fetch(
      "https://polyshield-media.s3.eu-west-1.amazonaws.com/burnerLeaderboard.json"
    )
      .then((response) => response.json())
      .then((data) => {
       // console.log(data);
        data.sort(function (a, b) {
          return parseFloat(b[2]) - parseFloat(a[2]);
        });

        let p = 1;

        data.map((l) => {
          return (l[3] = p++);
        });

        setLeaderboard(data);
      });
  };

  useEffect(() => {
    fetchGasPrice();
    getLeaderboard();
    checkRegistered();
    fetchData();
  }, []);

  const fetchGasPrice = async () => {
    fetch("https://gasstation-mainnet.matic.network")
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.standard);
        setGasPrice(parseFloat(json.standard));
      });
  };

  const onRegisterClicked = async () => {
    if (account === null || account === undefined) return false;

    const web3I = ConnectedWeb3Provider.web3;
    const LeaderContractWrite = new web3I.eth.Contract(
      leaderboardABI,
      LEADERBOARD_ADDRESS
    );
    await LeaderContractWrite.methods
      .register(newAlias)
      .send(
        { from: account, gas: 3000000, gasPrice: parseInt(gasPrice * 10 ** 9) },
        monitorTransaction
      )
      .catch(() => {});

    setRegOpen(false);
    setRegister(false);
  };

  const onChangeAlias = (evt) => {
    const alias = evt.target.value;
    setNewAlias(alias);
  };

  return (
    <>
      <CCol className="text-center">
        <h1 className="dashboard-topic">
          <RiFireLine className="text-warning mb-1" /> PYROMANIACS
        </h1>

        <div className="small text-warning font-italic mb-3">
          The leaderboard updates every 15 mins
        </div>
      </CCol>
      <CCol xs="12" md="10" className="m-auto">
        {!registered && regOpen && web3Available && account !== undefined && (
          <CCard>
            <div id="close-reg" onClick={() => setRegOpen(false)}>
              X
            </div>
            <CCardBody>
              <CCol className="text-center">
                You're not registered for the leaderboard yet!
                <div>
                  <CButton
                    className="mt-3"
                    color="warning"
                    onClick={() => setRegister(!register)}
                  >
                    Register now
                  </CButton>
                </div>
              </CCol>
            </CCardBody>
          </CCard>
        )}

        {loading ? (
          <HollowDotsSpinner color="#00f792" className="m-auto pt-3 pb-3" />
        ) : (
          <div id="leaderboard">
            <CDataTable
              items={leaderboard}
              fields={fields}
              itemsPerPage={10}
              hover
              sorter
              pagination={{ align: "center" }}
              scopedSlots={{
                alias: (item) => (
                  <td className={item[0] === account ? "my-color" : ""}>
                    {item[1]}
                  </td>
                ),
                placement: (item) => (
                  <td
                    style={{ width: "32px" }}
                    className={item[0] === account ? "my-color" : ""}
                  >
                    {item[3]}
                  </td>
                ),
                address: (item) => (
                  <td className={item[0] === account ? "my-color" : ""}>
                    {item[0].substring(0, 6)}..
                    {item[0].substring(item[0].length - 4)}
                  </td>
                ),
                burned: (item) => (
                  <td
                    className={
                      item[0] === account
                        ? "my-color text-right"
                        : " text-right"
                    }
                  >
                    {parseFloat(web3.utils.fromWei(item[2], "ether")).toFixed(
                      2
                    )}{" "}
                    ($
                    {(
                      tokenPriceInDollars *
                      parseFloat(web3.utils.fromWei(item[2], "ether")).toFixed(
                        2
                      )
                    )
                      .toFixed(2)
                      .toLocaleString("en-US")}
                    )
                  </td>
                ),
              }}
            />
          </div>
        )}
      </CCol>
      <CModal
        centered
        color="secondary"
        show={register}
        onClose={() => setRegister(false)}
      >
        <CModalHeader closeButton>
          <CModalTitle className="text-primary">
            Register for leaderboard
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ backgroundColor: "#000106" }}>
          <CRow className="w-100">
            <CCol xs="8">
              <CInput
                type="text"
                id="alias"
                name="alias"
                maxLength="16"
                placeholder="Enter an alias"
                value={newAlias}
                onChange={onChangeAlias}
              />
            </CCol>
            <CCol xs="4" className="text-right">
              <CButton
                color="warning"
                disabled={newAlias === ""}
                onClick={() => onRegisterClicked()}
              >
                Register now
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  );
};

export default Leaderboard;
