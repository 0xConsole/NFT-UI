const Web3 = require('web3')
const abis = require('./contractABI')
//const web3 = new Web3('https://dry-lingering-mountain.matic.quiknode.pro/e948b5d6288a0f92d7bc3745b6584c49cf19aeb5/');

const web3 = new Web3('https://polygon-rpc.com/');

const bscWeb3 = new Web3('https://bsc-dataseed.binance.org/');
const PCS_ROUTER_Address = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const BSC_ROUTERContract = new bscWeb3.eth.Contract(abis.QUICKRouterABI, PCS_ROUTER_Address);

const AWS = require("aws-sdk");
AWS.config.update({region: 'eu-west-1'});

const stakingConfig = require('./stakingConfig')

const USDC_Address="0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
const USDT_Address = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

const masterChefAddr = '0x0Ec74989E6f0014D269132267cd7c5B901303306';
const MasterChefContract = new web3.eth.Contract(abis.masterChefContractABI, masterChefAddr);

const TARGET_BUCKET="polyshield-media"
const TARGET_KEY="aprCalculations.json"

const NOTIFICATION_TOPIC_ARN = "arn:aws:sns:eu-west-1:208408763189:polyshield-tvl";

const BASE_Address="0xf239e69ce434c7fb408b05a0da416b14917d934e"

// ROUTER
const Quick_Address = "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff";
const QuickRouterContract = new web3.eth.Contract(abis.QUICKRouterABI, Quick_Address);

// ELK Router
const ELK_Router_Address = "0xf38a7A7Ac2D745E2204c13F824c00139DF831FFf";
const ELKRouterContract = new web3.eth.Contract(abis.QUICKRouterABI, ELK_Router_Address);

// WMATIC
const WrappedNativeAddress="0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"

// WBTC
const wbtcAddress="0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6"

const AVERAGE_SECS = 2.2; 
const BLOCKS_PER_DAY = 86400/AVERAGE_SECS;

const isUSDToken = (tokenAddress)=>{
  if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()===USDT_Address.toLowerCase()) {
    return true;
  }
  return false;
}

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
  console.log("returning fetched price: " +tokenPriceInDollars)

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

const getTokenPriceInDollars = async (tokenAddress, router) => {

  // get the price of this token in USDC
  // pick 100,000th of a token due to liquidity issues.
  let tokenPriceInDollars = 1;

  if (!isUSDToken(tokenAddress)) {
    let amountIn = web3.utils.toWei("0.0001", "ether");
    //amountIn  = 0.0001 * 10**6; // one ten thousand of a usd
    let amountsOutWei;
    
    if (router==="ELK"){
      amountsOutWei = await ELKRouterContract.methods
      .getAmountsOut(amountIn, [tokenAddress, USDC_Address])
      .call()
      .catch(() => {});
    }else{
      // quick swap
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
  console.log("returning fetched price: " +tokenPriceInDollars)

  return tokenPriceInDollars;
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
  //console.log(amounts)
  return parseInt(usdAmount*10**6);

};

const calculateUSDValueOfStakedLiquidity = async(FARM , amountStaked)=>{

  let userValue = web3.utils.fromWei(amountStaked,"ether");
  let lpTokenInUSD = await calculateValueOfStakedLiquidity (FARM , 1000000000000000000);
  console.log(lpTokenInUSD);
  console.log(userValue);
  console.log(userValue*lpTokenInUSD);

  let value = parseFloat(userValue*lpTokenInUSD).toFixed(2)

  if (FARM.ticker==="SHI3LD-KOGECOIN" || FARM.ticker==="SHI3LD-ELK"){
    const RAWDATA = await getObjectFromS3(TARGET_BUCKET, "polyInfo.json");
    const item = JSON.parse(RAWDATA);
    const shieldPriceInDollars = item.shieldPrice;

    const pairPath = FARM.pairPath.replace("ETH", WrappedNativeAddress);
    const tokenAddrs = pairPath.split("/");

    let lpAmountToken0 = await balanceOf(tokenAddrs[0],FARM.address)
    console.log("lpAmountToken0 " + lpAmountToken0); // SHI3LD (18)
  
    let amountOfToken0 = (lpAmountToken0*10**-18);

    const userValueOfToken0USD = shieldPriceInDollars*amountOfToken0;
    return parseFloat(userValueOfToken0USD*2)
  }

  // whoo the fuck knows why
  if (FARM.ticker==="SHI3LD-USDC"){value=value*2}
  if (FARM.ticker==="POWER-USDC"){value=value*2}

  return(parseFloat(value).toFixed(2));
  
}

const calculateValueOfStakedLiquidity = async(FARM , amountStaked)=>{

  const lpSupply = await supply(FARM.address)
 // console.log("LP supply " + lpSupply);

  const userLPRatio  = amountStaked/lpSupply
 // console.log("userLPRatio " + userLPRatio);

  const pairPath = FARM.pairPath.replace("ETH", WrappedNativeAddress);
  const tokenAddrs = pairPath.split("/");

  let lpAmountToken0 = await balanceOf(tokenAddrs[0],FARM.address)
 // console.log("lpAmountToken0 " + lpAmountToken0);

  let lpAmountToken1 = await balanceOf(tokenAddrs[1],FARM.address)
 // console.log("lpAmountToken1 " + lpAmountToken1);


  let userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
 // console.log("userValueOfToken0 " + userValueOfToken0);

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
  //  console.log("userValueOfToken1 " + userValueOfToken1);
  }

  if (isUSDToken(tokenAddrs[0]) && isUSDToken(tokenAddrs[1])){
    userValueOfToken0 = parseInt(userLPRatio*lpAmountToken0);
  //  console.log("userValueOfToken0 " + userValueOfToken0);
    userValueOfToken1 = parseInt(userLPRatio*lpAmountToken1);
 ////   console.log("userValueOfToken1 " + userValueOfToken1);
  }

      
  // convert to USD
  const userValueOfToken0USD = await getAmountsOutInDollars(tokenAddrs[0],userValueOfToken0);
//  console.log("userValueOfToken0USD " + userValueOfToken0USD);
  const userValueOfToken1USD = await getAmountsOutInDollars(tokenAddrs[1],userValueOfToken1);
 /// console.log("userValueOfToken1USD " + userValueOfToken1USD);

  const valueOfLPHoldingInUSD = ((userValueOfToken0USD+userValueOfToken1USD));
  //console.log("valueOfLPHoldingInUSD " + valueOfLPHoldingInUSD);

  if (!isUSDToken(tokenAddrs[0]) && !isUSDToken(tokenAddrs[0])){
    return (valueOfLPHoldingInUSD*10**-12).toFixed(2);
  }

 return (valueOfLPHoldingInUSD*10**-6).toFixed(2);
}


 const balanceOf = async (token, address) => {
    const tokenContract = new web3.eth.Contract(abis.IERC20, token);
    const result = tokenContract.methods.balanceOf(address).call();
    return result;
  };

  const supply = async (token) => {
    const tokenContract = new web3.eth.Contract(abis.IERC20, token);
    let result = await tokenContract.methods.totalSupply().call();    
    return result;
  };


  const  putObjectToS3 = async (bucket, key, data)=>{
    var s3 = new AWS.S3();
        var deleteparams = {
            Bucket : bucket,
            Key : key
        }

        await s3.deleteObject(deleteparams).promise();

      var putparams = {
          Bucket : bucket,
          Key : key,
          Body : data,
          ContentType: 'application/json',
          ACL: 'public-read',
          CacheControl: 'no-cache',
      }
      await s3.putObject(putparams).promise();
  };

  const  getObjectFromS3 = async (bucket, key, data)=>{
    var s3 = new AWS.S3();
        var params = {
            Bucket : bucket,
            Key : key
        }
        const file = await s3
        .getObject(params)
        .promise();

        return file.Body.toString('utf-8')
  };


  const sendNotification = async (tvl , tokenPriceInDollars) =>{

    const messageText = "PolyShield TVL: $"+tvl + " Price: $" + tokenPriceInDollars;

    var params = {
      Message: messageText, 
      TopicArn: NOTIFICATION_TOPIC_ARN,
      Subject: messageText
    };

    var SNS = new AWS.SNS({apiVersion: '2010-03-31'});
    await SNS.publish(params).promise();

  }


const calculateAPR = async(FARM, POOL_ID)=>{

    const poolInfo = await MasterChefContract.methods
      .poolInfo(POOL_ID)
      .call()
      .catch(() => {return});

      console.log(poolInfo)
      // doesn't exist but return something for it.
      if (poolInfo==null){

        var emptyAPRInfo = {
          pool_id: POOL_ID,
          ticker: FARM.ticker,
          APR: 0,
          tokenRewardPerDayFor1000Dollars: 0,
          APY: 0,
          poolInfo: 0,
          totalLiquidityStakedUSD: 0
        };
        return emptyAPRInfo;
      }
    
    const shieldPerBlockWei = await MasterChefContract.methods
        .shieldPerBlock()
        .call()
        .catch(() => {return});
      const emissionRate = parseFloat(
        web3.utils.fromWei(shieldPerBlockWei, "ether")
      ).toFixed(4);

    const totalAlloc = await MasterChefContract.methods
    .totalAllocPoint()
    .call()
    .catch(() => {return});


    let  shieldPriceInDollars = await getTokenPriceInDollars(BASE_Address, "QS");
    let tokenPriceInDollars = 0;
    // how many rewards to this pool per day
    const poolAllocationPerDay =
      ((BLOCKS_PER_DAY * emissionRate) / totalAlloc) * poolInfo.allocPoint;

    let totalLiquidityStaked = await balanceOf(FARM.address, masterChefAddr);

    console.log("totalLiquidityStaked: " + totalLiquidityStaked)

    let totalLiquidityStakedUSD = 0;

    if (FARM.type==="pair"){

        totalLiquidityStakedUSD =
          totalLiquidityStaked === 0
            ? 0
            : await calculateUSDValueOfStakedLiquidity(
                FARM,
                totalLiquidityStaked
              );

        // USDC for example has 6 decimal
        if (FARM.decimals !== 18) {
          totalLiquidityStaked = totalLiquidityStaked * 10 ** -FARM.decimals;
        } else {
          totalLiquidityStaked = web3.utils.fromWei(
            totalLiquidityStaked,
            "ether"
          );
        }
  }
  else{
    // a token
     console.log("Processing token : " + FARM.ticker)
    //console.log("shieldPriceInDollars" + shieldPriceInDollars)

    // USDC for example has 6 decimal
    if (FARM.decimals !== 18) {
      totalLiquidityStaked = totalLiquidityStaked * 10 ** -FARM.decimals;
    } else {
      totalLiquidityStaked = parseFloat(
        web3.utils.fromWei(totalLiquidityStaked, "ether")
      );
    }


     if (FARM.ticker==="PCAKE"){
      tokenPriceInDollars = await getBSCTokenPriceInDollars("0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");
     }
     else if (FARM.ticker==="ELK"){
      tokenPriceInDollars = await getTokenPriceInDollars(FARM.address, "ELK");
     } else if (FARM.ticker==="WBTC"){
        tokenPriceInDollars = await getWBTCPriceInDollars();
     }else{
      tokenPriceInDollars = await getTokenPriceInDollars(FARM.address, "QS");
     }

     
      console.log("tokenPriceInDollars: " + tokenPriceInDollars)

      totalLiquidityStakedUSD = parseFloat(
      totalLiquidityStaked * tokenPriceInDollars
    ).toFixed(2);
    console.log("totalLiquidityStakedUSD: " + totalLiquidityStakedUSD)

  }
    // find out the liquidity in USD

    // calculate the APY based on a stake of 1000$
    // how much of the liquidity pool would this user have at 1000$?
    let userAllocPercentageOfPool = 100;
    if (totalLiquidityStaked > 0) {
      userAllocPercentageOfPool = (
        (1000 * 100) /
        (parseFloat(totalLiquidityStakedUSD) + 1000)
      ).toFixed(2);
    }

    console.log("userAllocPercentageOfPool: " + userAllocPercentageOfPool)

    let userAllocTokensPerDay =
      (poolAllocationPerDay / 100) * userAllocPercentageOfPool;


      console.log("userAllocTokensPerDay: " + userAllocTokensPerDay)

    let dailyDollarReward = userAllocTokensPerDay * shieldPriceInDollars;
    let dailyPercentageRate = (dailyDollarReward * 100) / 1000;

    var APRInfo = {
      pool_id: POOL_ID,
      ticker: FARM.ticker,
      APR: dailyPercentageRate,
      tokenRewardPerDayFor1000Dollars: userAllocTokensPerDay,
      APY: dailyPercentageRate * 365,
      poolInfo: poolInfo,
      totalLiquidityStakedUSD
      
    };

    console.log(JSON.stringify(APRInfo))

    return APRInfo;

}

exports.handler = async (event) => {

  let farms = stakingConfig.farms;
  
  let aprCalcs = [];

  let hasError = false;
  for (let i = 0; i < farms.length; i++) {
   
   
    try {
      let aprcalc = await calculateAPR(farms[i], i);
      if (aprcalc!==undefined){aprCalcs.push(aprcalc);}else{hasError = true}
      
    } catch (error) {
      console.log(error)
      hasError = true
    }
  

  } // end for each farm
    if (!hasError)
    await putObjectToS3(TARGET_BUCKET , TARGET_KEY , JSON.stringify(aprCalcs));


    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify([]),
    };



    return response;
};
