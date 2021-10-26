const Web3 = require('web3')
const abis = require('./contractABI')
const web3 = new Web3('https://polygon-rpc.com/');
const AWS = require("aws-sdk");

AWS.config.update({region: 'eu-west-1'});

const USDC_Address="0x2791bca1f2de4661ed88a30c99a7a9449aa84174"

const TARGET_BUCKET="polyshield-media"
const TARGET_READ_KEY="chartDataDays.json"

const TARGET_WRITE_KEY="chartDataDays.json"

const NOTIFICATION_TOPIC_ARN = "arn:aws:sns:eu-west-1:208408763189:polyshield-tvl";

const BASE_Address="0xf239e69ce434c7fb408b05a0da416b14917d934e"

// ROUTER
const Quick_Address = "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff";
const QuickRouterContract = new web3.eth.Contract(abis.QUICKRouterABI, Quick_Address);


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

    const RAWDATA = await getObjectFromS3(TARGET_BUCKET, "aprCalculations.json");

    const aprData = JSON.parse(RAWDATA);

    let totalLockedValue = 0;

      for (let i = 0; i < aprData.length; i++) {
         
          totalLockedValue = totalLockedValue + parseFloat(aprData[i].totalLiquidityStakedUSD);
          console.log(totalLockedValue)
       
      } // end for each farm

      console.log(totalLockedValue);

    let output = {
        totalLockedValue: totalLockedValue,
    }

    totalLockedValue =parseInt(totalLockedValue).toString()

    let currentDay =new Date().getDate()

    let currentData = await getObjectFromS3(TARGET_BUCKET,TARGET_READ_KEY);
    
    // remove first hout
    currentData = JSON.parse(currentData);
    currentData.shift();
    currentData.push
    (
      {
        "day": currentDay,
        "value": totalLockedValue
      }
    )
   
    console.log(JSON.stringify(currentData))
    
    await putObjectToS3(TARGET_BUCKET , TARGET_WRITE_KEY , JSON.stringify(currentData));


    await sendNotification(totalLockedValue , tokenPriceInDollars)

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(output),
    };



    return response;
};
