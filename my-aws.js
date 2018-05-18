const aws = require('aws-sdk');

const env = require('./env');

Object.assign(process.env, env);

const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const data = require('./avatar');
console.log(data);

console.log(process.env.AWS_BUCKET);


const bucket = {
  Bucket: process.env.AWS_BUCKET
};

S3.createBucket(bucket, (err, result)=> {
  if(err){
    console.log(err);
    return;
  }

  const extensions = data.split(';')[0].split('/');
  const extension = extensions[extensions.length - 1];
  const Body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const Key = `${Math.random()}.${extension}`;
  const Bucket = process.env.AWS_BUCKET;

  S3.putObject({
    Bucket,
    ACL: 'public-read',
    Body,
    ContentType: `image/${extension}`,
    Key
  }, (err, result)=> {
    if(err){
      console.log(err);
      return
    }
    const url = `https://s3.amazonaws.com/${Bucket}/${Key}`
    console.log(url);
  });
});
