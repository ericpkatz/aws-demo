const aws = require('aws-sdk');
const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

S3.listBuckets((err, buckets)=> {
  if(err){
    console.log(err);
    return;
  }
  buckets.forEach( bucket=> console.log(bucket));
});
