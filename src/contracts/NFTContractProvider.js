import Web3 from "web3";
import {
  masterChefContractABI,
  QUICKRouterABI,
  PolyshieldABI,
  BurnerABI,
} from "./contractABI";
import { IERC20 } from "./contractABI";


const getWeb3 = ()=>{

return new Web3(
  "https://speedy-nodes-nyc.moralis.io/89b4f5c6d2fc13792dcaf416/polygon/mumbai\n"
);

}

export const web3 = getWeb3();

export const Network = "Mumbai Testnet";
export const ChainId = 80001;

export const AVERAGE_SECS = 2.0;

export const BLOCKS_PER_DAY = 86400/AVERAGE_SECS;

// NFTBasic
export const NFTBasicABI = [{"inputs":[{"internalType":"contract IERC20","name":"_rewardToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"allocPoint","type":"uint256"}],"name":"minting","type":"event"},{"inputs":[],"name":"MINT_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getClaimableAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"allocPoint","type":"uint256"}],"name":"mint_NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalClaimedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
export const NFTBasic_Address = "0x9f01C000b251d9d3Ae5A48992e1293E39260c618";
export const NFTBasicContract = new web3.eth.Contract(
  NFTBasicABI,
  NFTBasic_Address
);

// NFTMarket
export const NFTMarketABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"nftContract","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"bidder","type":"address"},{"indexed":false,"internalType":"uint256","name":"bidAmount","type":"uint256"}],"name":"ItemOfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"nftContract","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"category","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"MarketItemCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"nftContract","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"string","name":"category","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"MarketSaleCreated","type":"event"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"uint256","name":"offerIndex","type":"uint256"}],"name":"acceptOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"cancelMarketItem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"uint256","name":"offerIndex","type":"uint256"}],"name":"cancelOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"contractToTokenToItemId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"category","type":"string"}],"name":"createMarketItem","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"createMarketSale","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"discountManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchCreateNFTs","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct NFTMarket.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchPurchasedNFTs","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct NFTMarket.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"category","type":"string"}],"name":"getItemsByCategory","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct NFTMarket.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getItemsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketItems","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct NFTMarket.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"getMarketOffers","outputs":[{"components":[{"internalType":"uint256","name":"offerId","type":"uint256"},{"internalType":"address payable","name":"bidder","type":"address"},{"internalType":"uint256","name":"offerAmount","type":"uint256"},{"internalType":"uint256","name":"offerTime","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"},{"internalType":"bool","name":"accepted","type":"bool"}],"internalType":"struct NFTMarket.MarketOffer[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"idToMarketItem","outputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"bool","name":"cancelled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"makeOffer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"numberOfItemsListed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleFeePercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_discountManager","type":"address"}],"name":"setDiscountManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setSalePercentageFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"volumeTraded","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
export const NFTMarket_Address = "0xFad0Dc20D4000c84DfD80Bb4710988D8E000d971";
export const NFTMarketContract = new web3.eth.Contract(
  NFTMarketABI,
  NFTMarket_Address
);

// SHI3LD

export const BASE_Address = "0x0252E64567ee30BA80784B1B907DFBc9b47018e6";
export const PolyshieldContract = new web3.eth.Contract(
  PolyshieldABI,
  BASE_Address
);

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

const isUSDToken = (tokenAddress)=>{
  if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()===USDT_Address.toLowerCase()) {
    return true;
  }
  return false;
}

