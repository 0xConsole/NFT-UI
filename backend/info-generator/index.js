const Web3 = require('web3')
const abis = require('./contractABI')
const web3 = new Web3('https://polygon-rpc.com/');
const AWS = require("aws-sdk");

AWS.config.update({region: 'eu-west-1'});

const USDC_Address="0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
const USDT_Address = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

const masterChefAddr = '0x0Ec74989E6f0014D269132267cd7c5B901303306';
const MasterChefContract = new web3.eth.Contract(abis.masterChefContractABI, masterChefAddr);

const TARGET_BUCKET="polyshield-media"
//const TARGET_READ_KEY="polyInfo.json"

const TARGET_WRITE_KEY="polyInfo.json"

const NOTIFICATION_TOPIC_ARN = "arn:aws:sns:eu-west-1:208408763189:polyshield-tvl";

const BASE_Address="0xf239e69ce434c7fb408b05a0da416b14917d934e"

// ROUTER
const Quick_Address = "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff";
const QuickRouterContract = new web3.eth.Contract(abis.QUICKRouterABI, Quick_Address);

// WMATIC
const WrappedNativeAddress="0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"

const isUSDToken = (tokenAddress)=>{
  if (tokenAddress.toLowerCase() === USDC_Address.toLowerCase() || tokenAddress.toLowerCase()===USDT_Address.toLowerCase()) {
    return true;
  }
  return false;
}

const getTokenPriceInDollars = async (tokenAddress) => {

  // get the price of this token in USDC
  // pick 100,000th of a token due to liquidity issues.
  let tokenPriceInDollars = 1;

  if (!isUSDToken(tokenAddress)) {
    let amountIn = web3.utils.toWei("0.0001", "ether");
    //amountIn  = 0.0001 * 10**6; // one ten thousand of a usd
    const amountsOutWei = await QuickRouterContract.methods
      .getAmountsOut(amountIn, [tokenAddress, USDC_Address])
      .call()
      .catch(() => {});
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
  console.log(amounts)
  return parseInt(usdAmount*10**6);

};

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

exports.handler = async (event) => {

    let amountIn = web3.utils.toWei("0.0001", "ether");
    const amountsOutWei = await QuickRouterContract.methods
    .getAmountsOut(amountIn, [BASE_Address, USDC_Address])
    .call()
    .catch(() => {});
    const amountsOutDollars = amountsOutWei[1] * 10 ** -6;
    const tokenPriceInDollars = amountsOutDollars * 10 ** 4;
  

    const shieldPerBlockWei = await MasterChefContract.methods
        .shieldPerBlock()
        .call()
        .catch(() => {return});
      const emissionRate = parseFloat(
        web3.utils.fromWei(shieldPerBlockWei, "ether")
      ).toFixed(4);

      const topPrice = await MasterChefContract.methods
      .topPrice()
      .call()
      .catch(() => {return});
      const bottomPrice = await MasterChefContract.methods
      .bottomPrice()
      .call()
      .catch(() => {return});

    let currentData={
      shieldPrice: tokenPriceInDollars,
      topPrice: topPrice,
      bottomPrice: bottomPrice,
      emissionRate: emissionRate
    }
    
    await putObjectToS3(TARGET_BUCKET , TARGET_WRITE_KEY , JSON.stringify(currentData));

   // await sendNotification(totalLockedValue , tokenPriceInDollars)

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify("output"),
    };



    return response;
};
