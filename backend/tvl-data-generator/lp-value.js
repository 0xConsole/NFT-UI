const Web3 = require('web3')
const abis = require('./contractABI')
const web3 = new Web3('https://polygon-rpc.com/');

const stakingConfig = require('./stakingConfig')

const USDC_Address="0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
const USDT_Address="0xc2132d05d31c914a87c6611c10748aeb04b58e8f"

const masterChefAddr = '0x0Ec74989E6f0014D269132267cd7c5B901303306';
const MasterChefContract = new web3.eth.Contract(abis.masterChefContractABI, masterChefAddr);
const WrappedNativeAddress = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

// ROUTER
const Quick_Address = "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff";
const QuickRouterContract = new web3.eth.Contract(
  abis.QUICKRouterABI,
  Quick_Address
);

const getTokenDecimals = async (tokenAddress) =>{
    if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()==USDT_Address.toLowerCase()) {
        return 6;
    }
    return 18;
}

 const balanceOf = async (token, address) => {
    const tokenContract = new web3.eth.Contract(abis.IERC20, token);
    const result = tokenContract.methods
      .balanceOf(address)
      .call()
      .catch(() => {});
    return result;
  };
  
   const supply = async (token) => {
    const tokenContract = new web3.eth.Contract(abis.IERC20, token);
    let result = await tokenContract.methods
      .totalSupply()
      .call()
      .catch(() => {});
    return result;
  };
  
 const getAmountsOutInDollars = async (tokenAddress, amountInWei) => {

    if (isUSDToken(tokenAddress)) {
        return parseInt(amountInWei);
    }

    let usdAmount = 0;
    const amounts = await QuickRouterContract.methods
    .getAmountsOut(amountInWei.toString(), [tokenAddress, USDC_Address])
    .call()
    .catch(() => {});
    usdAmount = amounts[1];
    console.log(amounts)
    return parseInt(usdAmount*10**6);

  };

  const isUSDToken = (tokenAddress)=>{
    if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()===USDT_Address.toLowerCase()) {
      return true;
    }
    return false;
  }

  const calculateUserValueOfLPHolding = async(currentAccount , POOL_ID)=>{

    const FARM = stakingConfig.farms[POOL_ID];
    console.log("FARM: " + FARM.address)
    const userInfo = await MasterChefContract.methods
    .userInfo(POOL_ID, currentAccount)
    .call();
    console.log("userInfo: " + JSON.stringify(userInfo))

    const amountStaked = userInfo.amount;
  
    const valueUSD = calculateValueOfStakedLiquidity(FARM,amountStaked)
    console.log ("valueUSD " + valueUSD);
    return valueUSD;
  }

    const calculateTotalLiquidityOfLP = async (POOL_ID)=>{
        const FARM = stakingConfig.farms[POOL_ID];
        const amountStaked = await balanceOf(
            FARM.address,
            masterChefAddr
          );
       const totallLiquidityUSD= await calculateValueOfStakedLiquidity(FARM,amountStaked)
       console.log("totallLiquidityUSD " + totallLiquidityUSD);
       return totallLiquidityUSD;
    }

    const calculateValueOfStakedLiquidity = async(FARM , amountStaked)=>{

      const lpSupply = await supply(FARM.address)
      console.log("LP supply " + lpSupply);
    
      const userLPRatio  = amountStaked/lpSupply
      console.log("userLPRatio " + userLPRatio);
    
      const pairPath = FARM.pairPath.replace("ETH", WrappedNativeAddress);
      const tokenAddrs = pairPath.split("/");
    
      let lpAmountToken0 = await balanceOf(tokenAddrs[0],FARM.address)
      console.log("lpAmountToken0 " + lpAmountToken0);
    
      let lpAmountToken1 = await balanceOf(tokenAddrs[1],FARM.address)
      console.log("lpAmountToken1 " + lpAmountToken1);
    
    
      let userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
      console.log("userValueOfToken0 " + userValueOfToken0);
    
      // do this for 18 decimal tokens
      let userValueOfToken1 = parseInt(((userLPRatio*10**-6)*(lpAmountToken1)));
      
      // shield usdt
      if (!isUSDToken(tokenAddrs[0]) && isUSDToken(tokenAddrs[1])){
        userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
        userValueOfToken1 = parseInt(userLPRatio*10**6)*(lpAmountToken1);
      }

      if (!isUSDToken(tokenAddrs[0]) && !isUSDToken(tokenAddrs[1])){
        userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
        console.log("userValueOfToken0 " + userValueOfToken0);
        userValueOfToken1 = parseInt(userLPRatio*lpAmountToken1);
        console.log("userValueOfToken1 " + userValueOfToken1);
      }

      if (isUSDToken(tokenAddrs[0]) && isUSDToken(tokenAddrs[1])){
        userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
        console.log("userValueOfToken0 " + userValueOfToken0);
        userValueOfToken1 = parseInt(userLPRatio*lpAmountToken1);
        console.log("userValueOfToken1 " + userValueOfToken1);
      }

          
      // convert to USD
      const userValueOfToken0USD = await getAmountsOutInDollars(tokenAddrs[0],userValueOfToken0);
      console.log("userValueOfToken0USD " + userValueOfToken0USD);
      const userValueOfToken1USD = await getAmountsOutInDollars(tokenAddrs[1],userValueOfToken1);
      console.log("userValueOfToken1USD " + userValueOfToken1USD);
    
      const valueOfLPHoldingInUSD = ((userValueOfToken0USD+userValueOfToken1USD));
      console.log("valueOfLPHoldingInUSD " + valueOfLPHoldingInUSD);

      if (!isUSDToken(tokenAddrs[0]) && !isUSDToken(tokenAddrs[0])){
        return (valueOfLPHoldingInUSD*10**-12).toFixed(2);
      }

     return (valueOfLPHoldingInUSD*10**-6).toFixed(2);
    }
    

  
  const currentAccount="0x556F99ff7D5F445f24437ce7c03a909Fc8BB650c"
  //const userLiquidity = calculateUserValueOfLPHolding(currentAccount , 5);

 const doWork = async()=>{
  let userValue = "1559000"
  let POOL_ID = 5
  let lpTokenInUSD = await calculateValueOfStakedLiquidity (stakingConfig.farms[POOL_ID] , userValue);
  console.log("user value for "+stakingConfig.farms[POOL_ID].ticker+" USD ="  + lpTokenInUSD);

  console.log("------")

  userValue = "29078413297060"
   POOL_ID = 7
   lpTokenInUSD = await calculateValueOfStakedLiquidity (stakingConfig.farms[POOL_ID] , userValue);
  console.log("user value for "+stakingConfig.farms[POOL_ID].ticker+" USD ="  + lpTokenInUSD);
  console.log("------")

  userValue = "142493792376407691"
   POOL_ID = 6
   lpTokenInUSD = await calculateValueOfStakedLiquidity (stakingConfig.farms[POOL_ID] , userValue);
  console.log("user value for "+stakingConfig.farms[POOL_ID].ticker+" USD ="  + lpTokenInUSD);
  console.log("------")


  userValue = "10000000000000000000"
  POOL_ID = 8
  lpTokenInUSD = await calculateValueOfStakedLiquidity (stakingConfig.farms[POOL_ID] , userValue);
 console.log("user value for "+stakingConfig.farms[POOL_ID].ticker+" USD ="  + lpTokenInUSD);
 console.log("------")


  userValue = "113472487415053990389"
   POOL_ID = 9
   lpTokenInUSD = await calculateValueOfStakedLiquidity (stakingConfig.farms[POOL_ID] , userValue);
  console.log("user value for "+stakingConfig.farms[POOL_ID].ticker+" USD ="  + lpTokenInUSD);
  console.log("------")


 }

  ///const totalLiquidity = calculateTotalLiquidityOfLP(5);


doWork();

//console.log("lpRatio x tokenAmount =" + parseFloat(0.8900854572529404) * 28531381152482958014090)
