const aws = require('aws-sdk');
const chalk = require('chalk');

const env = require('./env');

Object.assign(process.env, env);

const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

require('bluebird').promisifyAll(S3);


const bucket = {
  Bucket: process.env.AWS_BUCKET
};

//pass in some data and get back a url
const upload = (data) => {
  let Key, Bucket;
  return S3.createBucketAsync(bucket)
    .then(()=> {
      const extensions = data.split(';')[0].split('/');
      const extension = extensions[extensions.length - 1];
      const Body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      Key = `${Math.random()}.${extension}`;
      Bucket = process.env.AWS_BUCKET;

      return S3.putObject({
        Bucket,
        ACL: 'public-read',
        Body,
        ContentType: `image/${extension}`,
        Key
      })
    })
    .then(()=> {
      return `https://s3.amazonaws.com/${Bucket}/${Key}`
    });
}

upload(require('./avatar'))
  .then( url => console.log(chalk.green(url)))
  .catch( ex => console.log(ex));

upload()
  .catch( ex => console.log(chalk.red(ex)));
