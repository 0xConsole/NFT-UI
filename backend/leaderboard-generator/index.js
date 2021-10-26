const Web3 = require('web3')
const abis = require('./contractABI')
const web3 = new Web3('https://polygon-rpc.com/');
const AWS = require("aws-sdk");
AWS.config.update({region: 'eu-west-1'});

const NOTIFICATION_TOPIC_ARN = "arn:aws:sns:eu-west-1:208408763189:polyshield-tvl";


const leaderboardAddr = '0x730014E98a221ca0014C2774Fb4c8eccaa842F73';
const LeaderboardContract = new web3.eth.Contract(abis.leaderBoardABI, leaderboardAddr);

const TARGET_BUCKET="polyshield-media"
const TARGET_KEY="burnerLeaderboard.json"
const TOP_30="burnerLeaderboardTop30Addresses.json"


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

/*
  const sendNotification = async (tvl , tokenPriceInDollars) =>{

    const messageText = "PolyShield TVL: $"+tvl + " Price: $" + tokenPriceInDollars;

    var params = {
      Message: messageText, 
      TopicArn: NOTIFICATION_TOPIC_ARN,
      Subject: messageText
    };

    var SNS = new AWS.SNS({apiVersion: '2010-03-31'});
    await SNS.publish(params).promise();

  }*/


  function compare( a, b ) {

    const aAmount = parseInt(a[2])
    const bAmount = parseInt(b[2])
  
    if ( aAmount< bAmount ){
      return 1;
    }
    if ( aAmount > bAmount){
      return -1;
    }
    return 0;
  }
  

exports.handler = async (event) => {

    let result = await LeaderboardContract.methods.getBurners().call();
   
    const mutableResult = Array.from(result);

    console.log(mutableResult);
    mutableResult.sort(compare);
    //console.log(sorted);

    await putObjectToS3(TARGET_BUCKET , TARGET_KEY , JSON.stringify(mutableResult));

    let top30Addresses = [];

    for (let i = 0;i<30;i++){
      top30Addresses.push(mutableResult[i][0]);
    }

    for (let i = 0;i<30;i++){
      top30Addresses.push(mutableResult[i][1]);
    }

    await putObjectToS3(TARGET_BUCKET , TOP_30 , JSON.stringify(top30Addresses));


    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify("ok"),
    };



    return response;
};
