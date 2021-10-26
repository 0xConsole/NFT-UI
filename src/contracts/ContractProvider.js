import Web3 from "web3";
import {
  masterChefContractABI,
  QUICKRouterABI,
  PolyshieldABI,
  BurnerABI,
} from "./contractABI";
import { IERC20 } from "./contractABI";


const getWeb3 = ()=>{

/*
if (Math.floor(Math.random() * 10)>=7){
 // alert("dry-lingering-mountain.matic")
  return new Web3(
    "https://dry-lingering-mountain.matic.quiknode.pro/e948b5d6288a0f92d7bc3745b6584c49cf19aeb5/"
   // "https://polygon-rpc.com/"
  );
  
}
*/

return new Web3(
  "https://polygon-rpc.com/"
);

}

export const web3 = getWeb3();

export const Network = "Polygon Mainnet";
export const ChainId = 137;

export const AVERAGE_SECS = 2.0;

export const BLOCKS_PER_DAY = 86400/AVERAGE_SECS;

// SHI3LD
export const BASE_Address = "0xf239e69ce434c7fb408b05a0da416b14917d934e";
export const PolyshieldContract = new web3.eth.Contract(
  PolyshieldABI,
  BASE_Address
);

// MasterChef
export const masterChefAddr = "0x0Ec74989E6f0014D269132267cd7c5B901303306";
export const MasterChefContract = new web3.eth.Contract(
  masterChefContractABI,
  masterChefAddr
);

export const burnerAddress = "0xfbb307fea8cdaf614b66f82d8d233c947b07c4f5";
export const BurnerContract = new web3.eth.Contract(BurnerABI, burnerAddress);

// this so we can get the price of the token in $USDC
export const USDC_Address = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
export const BASE_USDC_Address = "0x0CA257A6cae5C89826DAae3BE0A64170e34493C5";

// WMATIC
export const WrappedNativeAddress =
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

// ROUTER
export const Quick_Address = "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff";
export const QuickRouterContract = new web3.eth.Contract(
  QUICKRouterABI,
  Quick_Address
);

// ELK Router
const ELK_Router_Address = "0xf38a7A7Ac2D745E2204c13F824c00139DF831FFf";
const ELKRouterContract = new web3.eth.Contract(QUICKRouterABI, ELK_Router_Address);

export const USDT_Address = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

const bscWeb3 = new Web3('https://bsc-dataseed.binance.org/');
const PCS_ROUTER_Address = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const BSC_ROUTERContract = new bscWeb3.eth.Contract(QUICKRouterABI, PCS_ROUTER_Address);

// WBTC
const wbtcAddress="0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6"

/*****COMMON FUNCTIONS *****/

let cacheTimeoutInterval = 60000;

let tokenPriceCached = [];
let lastTPQueryTime = Date.now()-(cacheTimeoutInterval+1);

const getBSCTokenPriceInDollars = async (tokenAddress) => {

  // get the price of this token in USDC
  // pick 100,000th of a token due to liquidity issues.
  let tokenPriceInDollars = 1;

  if (!isUSDToken(tokenAddress)) {
    let amountIn = web3.utils.toWei("0.0001", "ether");
    //amountIn  = 0.0001 * 10**6; // one ten thousand of a usd
    const amountsOutWei = await BSC_ROUTERContract.methods
      .getAmountsOut(amountIn, [tokenAddress, "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"])
      .call()
      .catch(() => {});
    // console.log(amountsOutWei)
    // convert back into dollars
    const amountsOutDollars = amountsOutWei[1] * 10 ** -18;
    tokenPriceInDollars = amountsOutDollars * 10 ** 4;
  }
  //console.log("returning fetched price: " +tokenPriceInDollars)

  return tokenPriceInDollars;
};

const getWBTCPriceInDollars = async () => {

  // get the price of this token in USDC
  let tokenPriceInDollars = 1;

    let amountIn = "100000000";
    let amountsOutWei;
   
    // quick swap
    amountsOutWei = await QuickRouterContract.methods
    .getAmountsOut(amountIn, [wbtcAddress, USDC_Address])
    .call()
    .catch(() => {});
   
    // console.log(amountsOutWei)
    // convert back into dollars
    const amountsOutDollars = amountsOutWei[1] * 10 ** -6;
    tokenPriceInDollars = amountsOutDollars;

  console.log("returning fetched price for wbtc: " +tokenPriceInDollars)

  return tokenPriceInDollars;
};


export const getTokenPriceInDollars = async (tokenAddress , router) => {

  if (router==="BSC")return getBSCTokenPriceInDollars(tokenAddress);
  if (tokenAddress===wbtcAddress)return getWBTCPriceInDollars();

 // console.log(Date.now()-lastTPQueryTime)
  if (Date.now()-lastTPQueryTime<cacheTimeoutInterval && tokenPriceCached[tokenAddress]!==undefined)
  {
    //console.log("returning cached price: " +tokenPriceCached[tokenAddress])
    return tokenPriceCached[tokenAddress];
  }
  //console.log("Fetching price")

  // get the price of this token in USDC
  // pick 100,000th of a token due to liquidity issues.
  let tokenPriceInDollars = 1;

//if ("0xc2132d05d31c914a87c6611c10748aeb04b58e8f"===tokenAddress.toLowerCase())return 1;

  if (tokenAddress.toLowerCase() !== USDC_Address.toLowerCase()) {
    let amountIn = web3.utils.toWei("0.0001", "ether");
    //amountIn  = 0.0001 * 10**6; // one ten thousand of a usd
    let amountsOutWei;
   if (router==="ELK"){
      amountsOutWei = await ELKRouterContract.methods
      .getAmountsOut(amountIn, [tokenAddress, USDC_Address])
      .call()
      .catch(() => {});
    }else{
      amountsOutWei = await QuickRouterContract.methods
      .getAmountsOut(amountIn, [tokenAddress, USDC_Address])
      .call()
      .catch(() => {});
    }
    
    // console.log(amountsOutWei)
    // convert back into dollars
    const amountsOutDollars = amountsOutWei[1] * 10 ** -6;
    tokenPriceInDollars = amountsOutDollars * 10 ** 4;
  }
  //console.log("returning fetched price: " +tokenPriceInDollars)

  lastTPQueryTime = Date.now();
  tokenPriceCached[tokenAddress]=tokenPriceInDollars;
  return tokenPriceInDollars;
};

export  const getAmountsOutInDollars = async (tokenAddress, amountInWei) => {

  if (isUSDToken(tokenAddress)) {
      return parseInt(amountInWei);
  }

  let usdAmount = 0;
  const amounts = await QuickRouterContract.methods
  .getAmountsOut(amountInWei.toString(), [tokenAddress, USDC_Address])
  .call()
  .catch(() => {});
  usdAmount = amounts[1];
  //console.log(amounts)
  return parseInt(usdAmount*10**6);

};


export const balanceOf = async (token, address) => {

  const tokenContract = new web3.eth.Contract(IERC20, token);
  const result = tokenContract.methods
    .balanceOf(address)
    .call()
    .catch(() => {});
  return result;
};

export const supply = async (token) => {
  const tokenContract = new web3.eth.Contract(IERC20, token);
  let result = await tokenContract.methods
    .totalSupply()
    .call()
    .catch(() => {});
  return result;
};

export  const calculateTotalLiquidityOfLP = async (FARM)=>{
      const amountStaked = await balanceOf(
          FARM.address,
          masterChefAddr
        );
     const totallLiquidityUSD= await calculateUSDValueOfStakedLiquidity(FARM,amountStaked)
    // console.log("totallLiquidityUSD " + totallLiquidityUSD);
     return totallLiquidityUSD;
  }

export const calculateUSDValueOfStakedLiquidity = async(FARM , amountStaked)=>{

  let userValue = web3.utils.fromWei(amountStaked,"ether");
  let lpTokenInUSD = await calculateValueOfStakedLiquidity (FARM , 1000000000000000000);

  if (FARM.ticker==="SHI3LD-KOGECOIN" || FARM.ticker==="SHI3LD-ELK"){
    //console.log("amountStaked: " + amountStaked);
    const lpSupply = await supply(FARM.address)
    //console.log("LP supply " + lpSupply);
  
    const userLPRatio  = amountStaked/lpSupply
    //console.log("userLPRatio " + userLPRatio);

    const pairPath = FARM.pairPath.replace("ETH", WrappedNativeAddress);
    const tokenAddrs = pairPath.split("/");


    let lpAmountToken0 = await balanceOf(tokenAddrs[0],FARM.address)
    //console.log("lpAmountToken0 " + lpAmountToken0); // SHI3LD (18)
  
    //let lpAmountToken1 = await balanceOf(tokenAddrs[1],FARM.address)
    //console.log("lpAmountToken1 " + lpAmountToken1); // KOGE (9)
  

    let amountOfToken0 = (userLPRatio*lpAmountToken0*10**-18);
   // let amountOfToken1 = parseInt(userLPRatio*lpAmountToken1);//*10**-9;

    //console.log("amountOfToken0:" + amountOfToken0);
    //console.log("amountOfToken1:" + amountOfToken1);

    const response = await fetch('https://polyshield-media.s3.eu-west-1.amazonaws.com/polyInfo.json');
    // waits until the request completes...
    const item = await response.json();
    const shieldPriceInDollars = item.shieldPrice;

    const userValueOfToken0USD = shieldPriceInDollars*amountOfToken0;

    //console.log("userValueOfToken0USD " + shieldPriceInDollars*amountOfToken0);

    return parseFloat(userValueOfToken0USD*2)
  }



  let value = parseFloat(userValue*lpTokenInUSD).toFixed(2)
 
  // whoo the fuck knows why
  if (FARM.ticker==="SHI3LD-USDC"){value=value*2}
  if (FARM.ticker==="POWER-USDC"){value=value*2}

  return(value);
  
}

const isUSDToken = (tokenAddress)=>{
  if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()===USDT_Address.toLowerCase()) {
    return true;
  }
  return false;
}


const calculateValueOfStakedLiquidity = async(FARM , amountStaked)=>{

  const lpSupply = await supply(FARM.address)
  //console.log("LP supply " + lpSupply);

  const userLPRatio  = amountStaked/lpSupply
  //console.log("userLPRatio " + userLPRatio);

  const pairPath = FARM.pairPath.replace("ETH", WrappedNativeAddress);
  const tokenAddrs = pairPath.split("/");

  let lpAmountToken0 = await balanceOf(tokenAddrs[0],FARM.address)
  //console.log("lpAmountToken0 " + lpAmountToken0);

  let lpAmountToken1 = await balanceOf(tokenAddrs[1],FARM.address)
 // console.log("lpAmountToken1 " + lpAmountToken1);


  let userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
  //console.log("userValueOfToken0 " + userValueOfToken0);

  // do this for 18 decimal tokens
  let userValueOfToken1 = parseInt(((userLPRatio*10**-6)*(lpAmountToken1)));
  
  // shield usdt
  if (!isUSDToken(tokenAddrs[0]) && isUSDToken(tokenAddrs[1])){
    userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
    userValueOfToken1 = parseInt(userLPRatio*10**6)*(lpAmountToken1);
  }

  if (!isUSDToken(tokenAddrs[0]) && !isUSDToken(tokenAddrs[1])){
    userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
  //  console.log("userValueOfToken0 " + userValueOfToken0);
    userValueOfToken1 = parseInt(userLPRatio*lpAmountToken1);
   // console.log("userValueOfToken1 " + userValueOfToken1);
  }

  if (isUSDToken(tokenAddrs[0]) && isUSDToken(tokenAddrs[1])){
    userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
 //   console.log("userValueOfToken0 " + userValueOfToken0);
    userValueOfToken1 = parseInt(userLPRatio*lpAmountToken1);
  //  console.log("userValueOfToken1 " + userValueOfToken1);
  }

      
  // convert to USD
  const userValueOfToken0USD = await getAmountsOutInDollars(tokenAddrs[0],userValueOfToken0);
 // console.log("userValueOfToken0USD " + userValueOfToken0USD);
  const userValueOfToken1USD = await getAmountsOutInDollars(tokenAddrs[1],userValueOfToken1);
  //console.log("userValueOfToken1USD " + userValueOfToken1USD);

  const valueOfLPHoldingInUSD = ((userValueOfToken0USD+userValueOfToken1USD));
 // console.log("valueOfLPHoldingInUSD " + valueOfLPHoldingInUSD);

  if (!isUSDToken(tokenAddrs[0]) && !isUSDToken(tokenAddrs[0])){
    return (valueOfLPHoldingInUSD*10**-12).toFixed(2);
  }

 return (valueOfLPHoldingInUSD*10**-6).toFixed(2);
}
