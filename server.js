const path = require('path');
const express = require('express');

const app = express();

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

try {
  const env = require('./env');
  Object.assign(process.env, env);
}
catch(ex){

}

const aws = require('aws-sdk');

const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

require('bluebird').promisifyAll(S3);


app.get('/api/buckets', (req, res, next)=> {
  S3.listBucketsAsync()
    .then( result => res.send(result.Buckets))
    .catch(next);
});

app.get('/api/buckets/:bucket', (req, res, next)=> {
  S3.listObjectsAsync({
    Bucket: req.params.bucket
  })
  .then( result => res.send(result.Contents))
  .catch(next);
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));
